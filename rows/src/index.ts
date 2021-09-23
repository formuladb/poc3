import "reflect-metadata";
import { createConnection } from "typeorm";
import * as fs from 'fs';

// In order to use the MinIO JavaScript API to generate the pre-signed URL, begin by instantiating
// a `Minio.Client` object and pass in the values for your server.
// The example below uses values for play.min.io:9000

import * as Minio from 'minio';
import { spawn } from 'child_process';

import baseData from './apps/base/data';
import websitesData from './apps/websites/data';
import onrcData from './apps/onrc/data';

import basePermissions from './apps/base/permissions';
import websitesPermissions from './apps/websites/permissions';
import onrcPermissions from './apps/onrc/permissions';

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

import * as jwt from 'jsonwebtoken';

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

pgFmkInstall()
    .then(async () => {
        await createConnection();

        await baseData();
        // await websitesData();
        await onrcData();

        await basePermissions();
        // await websitesPermissions();
        await onrcPermissions();
    })
    .then(() => app.listen(8080))
    ;

async function pgFmkInstall() {
    await runCmd('timeout', '300', 'bash', '/scripts/pg-fmk.sh');

    if (process.env.ENVTYPE === "localdev") {
        var nodemon = require('nodemon');
        nodemon(`--exec 'bash /scripts/pg-fmk.sh' -e sql --watch /pg`);
    }
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
