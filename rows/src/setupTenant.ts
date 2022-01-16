import { Connection, createConnection } from "typeorm";
import { BASE_CONNECTION } from "./conn";
import { setPermission } from "./core-orm/setPermision";
import { runCmd } from "./runCmd";
import baseApp from './apps/00_base';
import websitesApp from './apps/10_websites';
import crmData from './apps/crm';
import inventoryData from './apps/inventory';
import serviceData from './apps/service';
import onrcData from './apps/90_form_builder/onrc';
import frfData from './apps/90_form_builder/frf/data';

async function getTenantConn(schemaName: string) {
    const conn = await createConnection({
        ...BASE_CONNECTION,
        name: schemaName,
        type: "postgres",
        schema: schemaName,
    }).then(async (conn) => {
        await conn.query(`SET search_path TO ${schemaName};`)
        return conn;
    });
    return conn;
}

export async function setupTenant(schemaName: string, inputConn?: Connection) {
    const conn = inputConn || (await getTenantConn(schemaName));
    try {
        await runSchema("prw", conn);
    } finally {
        if (!inputConn) {
            await conn.close();
        }
    }
}

async function pgFmkInstall(schema: string) {
    await runCmd('timeout', '300', 'bash', '-c', `cd /pg && make SCHEMA=${schema}`);
}

async function runSchema(tenantId: string, conn: Connection) {
    await pgFmkInstall(tenantId);

    await baseApp(conn);
    await websitesApp(conn);
    // await onrcData();
    // await frfData();

    await setPermission(conn, 'administrator', 'ALL-TABLES', true, true, true, true);

    console.log("#### init done ######################")
}