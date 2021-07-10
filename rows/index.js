"use strict";
// In order to use the MinIO JavaScript API to generate the pre-signed URL, begin by instantiating
// a `Minio.Client` object and pass in the values for your server.
// The example below uses values for play.min.io:9000
Object.defineProperty(exports, "__esModule", { value: true });
const Minio = require("minio");
const child_process_1 = require("child_process");
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
const express = require("express");
const cookieParser = require("cookie-parser");
const mime = require('mime');
const jwt = require("jsonwebtoken");
const app = express();
app.use(cookieParser());
app.use((req, res, next) => {
    var _a;
    let jwtToken = req.cookies.dbrestauth || ((_a = req.header['Authorization']) === null || _a === void 0 ? void 0 : _a.replace(/^Bearer /, ''));
    if (jwtToken) {
        try {
            let claims = jwt.verify(jwtToken, process.env.JWT_SECRET);
            next();
        }
        catch (err) {
            res.status(401);
            res.end();
        }
    }
    else {
        res.status(403);
        res.end();
    }
});
app.get('/presignedUrl/:table/:column/:file', (req, res) => {
    client.presignedPutObject('frmdb-bucket', `${req.params.table}/${req.params.column}/${req.params.file}`, (err, url) => {
        if (err)
            throw err;
        res.end(url.replace(/http:\/\/minio:9000/, `${req.protocol}://${req.hostname}`));
    });
});
app.put('/upload/:table/:column/:file', async (req, res) => {
    let mimeType = mime.getType(req.params.file);
    await client.putObject('frmdb-bucket', `${req.params.table}/${req.params.column}/${req.params.file}`, req, {
        'Content-Type': mimeType,
    });
    res.status(200).end();
});
app.listen(8080);
// startDevModeMigration();
// function startGitSync() {
//     console.log("Starting git-sync each 5 sec");
//     setInterval(() => {
//         runCmd('timeout', '30', 'bash', '/scripts/sync-git.sh');
//     }, 30000)
// }
// function startBackupDb() {
//     console.log("Starting backup-db every day");
//     setInterval(() => {
//         runCmd('timeout', '600', 'bash', '/scripts/backup-db.sh');
//     }, 24 * 3600000)
// }
// function startDevModeMigration() {
//     if (process.env.ENVTYPE === "localdev") {
//         console.log("Starting migration script");
//         runCmd('timeout', '300', 'bash', '/scripts/migrate_watch.sh');    
//     }
// }
function runCmd(cmd, ...args) {
    var prc = child_process_1.spawn(cmd, args);
    //noinspection JSUnresolvedFunction
    prc.stdout.setEncoding('utf8');
    prc.stdout.on('data', function (data) {
        var str = data.toString();
        var lines = str.split(/(\r?\n)/g);
        console.log(lines.join(""));
    });
    prc.stderr.on('data', function (data) {
        var str = data.toString();
        var lines = str.split(/(\r?\n)/g);
        console.error(lines.join(""));
    });
    prc.on('close', function (code) {
        if (code)
            console.error('process exit code ' + code);
    });
}
process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});
//# sourceMappingURL=index.js.map