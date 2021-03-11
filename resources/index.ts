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

app.listen(8080)
