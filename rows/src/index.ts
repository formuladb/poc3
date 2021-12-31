import "reflect-metadata";
import * as fs from 'fs';
import prwApp from './apps/11_prw';

// In order to use the MinIO JavaScript API to generate the pre-signed URL, begin by instantiating
// a `Minio.Client` object and pass in the values for your server.
// The example below uses values for play.min.io:9000

import * as Minio from 'minio';

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
import { setupTenant } from "./setupTenant";

const app: express.Express = express();
app.use(cookieParser());
app.use((req: express.Request, res, next) => {
    let jwtToken: string | undefined = req.header['Authorization']?.replace(/^Bearer /, '') || 
        req.cookies.dbrestauth;
    let auth = `Bearer ${jwtToken}`

    if (req.path == "/rows-db/rpc/frmdb_login") {
        auth = "";
    } 

    if (jwtToken) {
        try {
            let claims = jwt.verify(jwtToken, process.env.JWT_SECRET);
            req.header['Authorization'] = auth;
            next();
        } catch (err) {
            res.status(401); res.end();
        }
    }
    res.locals.jwtToken = jwtToken;
    next();
});

app.use((req: express.Request, res, next) => {
    (async () => {
        console.log(req.url);
        const m = req.hostname.match(/^(-\w+)\.(.+?)$/);
        const subdomain = m ? m[1] : null;
        const conn = await PRW_CONN_P;
        let tenantSchema: string | null = null;
        if (subdomain) {
            const tenantRepo = conn.getRepository(PrwTenant);
            const tenants = await tenantRepo.find({ where: { domainName: subdomain } });
            if (tenants[0]) {
                const schemaName = tenants[0].id;
                tenantSchema = schemaName;
            } else {
                res.status(403).end("tenant not found");
            }
        }
        if (!tenantSchema) {
            tenantSchema = "prw";
        }

        if (req.method === "GET" || req.method === "HEAD") {
            req.headers["Accept-Profile"] = tenantSchema;
        } else if (req.method === "POST" || req.method === "PUT" || req.method === "DELETE" || req.method === "PATCH") {
            req.headers["Content-Profile"] = tenantSchema;
        }
        next();

    })();
});

const postgrestProxy = createProxyMiddleware({
    target: 'http://db:3000',
    protocolRewrite: 'http',
    pathRewrite: {'^/rows-db' : ''},
    // onProxyReq: (proxyReq, req) => {
    //     console.log(req.url, proxyReq.path);
    // },
    onProxyRes: (proxyRes, req, res) => {
        // log original request and proxied request info
        console.log(`[${req.method}] [${proxyRes.statusCode}] ${req.url}`, req.headers);
    },
    onError: (err, req, res, target) => {
        console.error(err);
    }
});
app.use('/rows-db', postgrestProxy);

app.get('/rows-obj/presignedUrl/:table/:column/:file', (req: express.Request, res) => {
    client.presignedPutObject('frmdb-bucket', `${req.params.table}/${req.params.column}/${req.params.file}`, (err, url) => {
        if (err) throw err;
        res.end(url.replace(/http:\/\/minio:9000/, `${req.protocol}://${req.hostname}`));
    })
});

app.put('/rows-obj/upload/:table/:column/:file', async (req: express.Request, res) => {
    let mimeType = mime.getType(req.params.file);
    await client.putObject('frmdb-bucket',
        `${req.params.table}/${req.params.column}/${req.params.file}`,
        req,
        {
            'Content-Type': mimeType,
        });
    res.status(200).end();
});


PRW_CONN_P
    .then(conn => setupTenant("prw", conn).then(() => conn))
    .then(conn => prwApp(conn).then(() => conn))
    .then(() => app.listen(8080))
    ;



process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});
