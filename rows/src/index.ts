import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import * as fs from 'fs';

// In order to use the MinIO JavaScript API to generate the pre-signed URL, begin by instantiating
// a `Minio.Client` object and pass in the values for your server.
// The example below uses values for play.min.io:9000

import * as Minio from 'minio';
import { spawn } from 'child_process';

import baseData from './apps/00_base';
import websitesData from './apps/10_websites/data';
import crmData from './apps/crm';
import inventoryData from './apps/inventory';
import serviceData from './apps/service';
import onrcData from './apps/90_form_builder/onrc';
import frfData from './apps/90_form_builder/frf/data';


var client = new Minio.Client({
    endPoint: 'minio',
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
});


// Instantiate an `express` server and expose an endpoint called `/presignedUrl` as a `GET` request that
// accepts a filename through a query parameter called `name`. For the implementation of this endpoint,
// invoke [`presignedPutObject`](https://docs.min.io/docs/javascript-client-api-reference#presignedPutObject) 
// on the `Minio.Client` instance to generate a pre-signed URL, and return that URL in the response:

// express is a small HTTP server wrapper, but this works with any HTTP server
import * as express from 'express';
import * as cookieParser from "cookie-parser";
const mime = require('mime');
import { createProxyMiddleware } from 'http-proxy-middleware';

import * as jwt from 'jsonwebtoken';
import { setPermission } from "./core-orm/setPermision";
import { URL } from "url";
import { BASE_CONNECTION, PRW_CONN_P } from "./conn";
import { autoMigrate } from "./core-orm/autoMigrate";
import { PrwTenant } from "@core/entity/PrwTenant";

const app: express.Express = express();
app.use(cookieParser());
app.use((req: express.Request, res, next) => {
    let jwtToken: string | undefined = req.cookies.dbrestauth ||
        req.header['Authorization']?.replace(/^Bearer /, '');
    if (jwtToken) {
        try {
            let claims = jwt.verify(jwtToken, process.env.JWT_SECRET);
            next();
        } catch (err) {
            res.status(401); res.end();
        }
    } else {
        res.status(403); res.end();
    }
});

app.use((req: express.Request, res, next) => {
    (async () => {
        const url = new URL(req.url);
        const m = url.hostname.match(/^(-\w+)\.(.+?)$/);
        const subdomain = m[1];
        const conn = await PRW_CONN_P;
        let tenantFound = false;
        if (subdomain) {
            const tenantRepo = conn.getRepository(PrwTenant);
            const tenants = await tenantRepo.find({ where: { domainName: subdomain } });
            if (tenants[0]) {
                const schemaName = tenants[0].id;
                if (req.method === "GET" || req.method === "HEAD") {
                } else if (req.method === "POST" || req.method === "PUT" || req.method === "DELETE" || req.method === "PATCH") {
                    req.headers["Content-Profile"] = schemaName;
                }
                tenantFound = true;
                next();
            }
        }
        if (!tenantFound) {
            res.status(403).end("tenant not found");
        }
    })();
});

const postgrestProxy = createProxyMiddleware({
    target: 'db:3000',
});
app.use('/rows-db', postgrestProxy);

app.get('/presignedUrl/:table/:column/:file', (req: express.Request, res) => {
    client.presignedPutObject('frmdb-bucket', `${req.params.table}/${req.params.column}/${req.params.file}`, (err, url) => {
        if (err) throw err;
        res.end(url.replace(/http:\/\/minio:9000/, `${req.protocol}://${req.hostname}`));
    })
});

app.put('/upload/:table/:column/:file', async (req: express.Request, res) => {
    let mimeType = mime.getType(req.params.file);
    await client.putObject('frmdb-bucket',
        `${req.params.table}/${req.params.column}/${req.params.file}`,
        req,
        {
            'Content-Type': mimeType,
        });
    res.status(200).end();
});

async function runSchema(tenantId: string, inputConn?: Connection) {
    let conn = inputConn;
    try {
        await pgFmkInstall(tenantId);
        if (!conn) {
            conn = await createConnection({
                ...BASE_CONNECTION,
                name: tenantId,
                type: "postgres",
                schema: "tenantId",
            }).then(async (conn) => {
                await conn.query(`SET search_path TO ${tenantId};`)
                return conn;
            });
        }

        await baseData(conn);
        await websitesData(conn);
        // await onrcData();
        // await frfData();

        await setPermission(conn, 'administrator', 'ALL-TABLES', true, true, true, true);

        console.log("#### init done ######################")
    } finally {
        if (!inputConn) {
            await conn.close();
        }
    }
}

PRW_CONN_P
    .then(conn => runSchema("prw", conn).then(() => conn))
    .then(conn => autoMigrate(conn, PrwTenant).then(() => conn))
    .then(conn => {
        const repo = conn.getRepository(PrwTenant);
        const prwTenant = repo.create({
            id: "prw",
            domainName: "",
        });
        repo.save(prwTenant);
    })
    .then(() => app.listen(8080))
    ;

async function pgFmkInstall(schema: string) {
    await runCmd('timeout', '300', 'bash', '-c', `cd /pg && make SCHEMA=${schema}`);
}


function runCmd(cmd: string, ...args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        var prc = spawn(cmd, args);

        //noinspection JSUnresolvedFunction
        prc.stdout.setEncoding('utf8');
        prc.stdout.on('data', function (data) {
            var str = data.toString()
            var lines = str.split(/(\r?\n)/g);
            console.log(lines.join(""));
        });
        prc.stderr.on('data', function (data) {
            var str = data.toString()
            var lines = str.split(/(\r?\n)/g);
            console.error(lines.join(""));
        });

        prc.on('close', function (code) {
            if (code) {
                const err = 'process exit code ' + code;
                console.error(err);
                reject(err);
            } else resolve();
        });
    });
}

process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});
