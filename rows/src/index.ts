import "reflect-metadata";
import { createConnection } from "typeorm";
import * as fs from 'fs';
const SnakeNamingStrategy = require('typeorm-naming-strategies').SnakeNamingStrategy;

// In order to use the MinIO JavaScript API to generate the pre-signed URL, begin by instantiating
// a `Minio.Client` object and pass in the values for your server.
// The example below uses values for play.min.io:9000

import * as Minio from 'minio';
import { spawn } from 'child_process';

import baseData from './apps/00_base/data';
import websitesData from './apps/10_websites/data';
import crmData from './apps/crm/data';
import inventoryData from './apps/inventory/data';
import serviceData from './apps/service/data';
import onrcData from './apps/90_form_builder/onrc/data';
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
import { SetTenantSubscriber } from "./core-orm/SetTenantSubscriber";
import { PrwDictionary } from "@core/entity/PrwDictionary";
import { PrwPage } from "@core/entity/PrwPage";
import { PrwPermission } from "@core/entity/PrwPermission";
import { PrwRole } from "@core/entity/PrwRole";
import { FrmdbSystemParam } from "@core/entity/PrwSystemParam";
import { PrwTable } from "@core/entity/PrwTable";
import { PrwTableColumn } from "@core/entity/PrwTableColumn";
import { PrwUser } from "@core/entity/PrwUser";
import { Currency } from "./apps/00_base/entity/Currency";
import { ExchangeRate } from "./apps/00_base/entity/ExchangeRate";
import { Section, SubSection } from "./apps/10_websites/entity/Section";
import { StaticPage } from "./apps/10_websites/entity/StaticPage";
import { Customer } from "./apps/crm/entity/Customer";
import { InventoryLevel } from "./apps/inventory/entity/InventoryLevel";
import { InventoryTransaction, InventoryTransactionProduct } from "./apps/inventory/entity/InventoryTransaction";
import { ProductCategory } from "./apps/inventory/entity/ProductCategory";
import { ProductType } from "./apps/inventory/entity/ProductType";
import { Supplier, SupplierBill } from "./apps/inventory/entity/Supplier";
import { Equipment } from "./apps/service/entity/Equipment";
import { EquipmentCategory } from "./apps/service/entity/EquipmentCategory";
import { EquipmentType } from "./apps/service/entity/EquipmentType";
import { ServiceForm, ServiceFormCode, ServiceFormEquipment } from "./apps/service/entity/ServiceForm";
import { Technician } from "./apps/service/entity/Technician";
import { TravelForm, TravelFormProduct, TravelFormLevels } from "./apps/service/entity/TravelForm";

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

const postgrestProxy = createProxyMiddleware({
    target: 'db:3000',
    onProxyReqWs: function (proxyReq, req, socket, options, head) {
        const url = new URL(req.url);
        const m = url.hostname.match(/^(-\w+)\.(.+?)$/)

        // proxy_set_header Accept-Profile $accept_profile;
        // proxy_set_header Content-Profile $content_profile;
    }
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

const database = {
    development: 'dev',
    production: 'postgres',
    test: 'test'
};

pgFmkInstall()
    .then(async () => {
        console.log("################################################");
        console.log("## App data ");
        console.log("################################################");
        await createConnection({
            type: "postgres",
            schema: "t1",
            username: "postgres",
            password: "postgres",
            database: database[process.env.NODE_ENV],
            host: 'db',
            port: 5432,
            namingStrategy: new SnakeNamingStrategy(),
            logging: true,
            extra: { max: 10 },
            entities: [
                PrwDictionary,
                PrwPage,
                PrwPermission,
                PrwRole,
                FrmdbSystemParam,
                PrwTable,
                PrwTableColumn,
                PrwUser,
                Currency,
                ExchangeRate,
                Section,
                SubSection,
                StaticPage,
                Customer,
                InventoryLevel,
                InventoryTransaction,
                InventoryTransactionProduct,
                ProductCategory,
                ProductType,
                Supplier,
                SupplierBill,
                Equipment,
                EquipmentCategory,
                EquipmentType,
                ServiceForm,
                ServiceFormCode,
                ServiceFormEquipment,
                Technician,
                TravelForm,
                TravelFormProduct,
                TravelFormLevels,
            ],
            subscribers: [
                SetTenantSubscriber,
            ],
        });

        await baseData();
        await websitesData();
        // await onrcData();
        // await frfData();

        await setPermission('administrator', 'ALL-TABLES', true, true, true, true);

        console.log("#### init done ######################")
    })
    .then(() => app.listen(8080))
    ;

async function pgFmkInstall() {
    await runCmd('timeout', '300', 'bash', '-c', 'export PG_SCHEMA=t1 && cd /pg && make');
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
