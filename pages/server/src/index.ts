import * as express from 'express';
// import * as cookieParser from "cookie-parser";
// const mime = require('mime');

// import * as jwt from 'jsonwebtoken';

//@ts-ignore
const app: express.Express = express();

const staticFiles = express.static('/build');
app.get(/prws\/static\/.*\.(?:png|jpg|jpeg|svg|gif|webm|eot|ttf|woff|woff2|otf|css|js)$/, (req, res, next) => {
  req.url = req.url.replace(/^\/prws\//, '');
  staticFiles(req, res, next);
});

app.get(/.*/, function (req, res) {
    res.sendFile('/build/index.html');
});
// app.use(cookieParser());
// app.use((req: express.Request, res, next) => {
//     let jwtToken: string | undefined = req.cookies.dbrestauth ||
//         req.header['Authorization']?.replace(/^Bearer /, '');
//     if (jwtToken) {
//         try {
//             let claims = jwt.verify(jwtToken, process.env.JWT_SECRET);
//             next();
//         } catch (err) {
//             res.status(401); res.end();
//         }
//     } else {
//         res.status(403); res.end();
//     }
// });

app.listen(3000);
