import { PrwDictionary } from "@core/entity/PrwDictionary";
import { PrwPage } from "@core/entity/PrwPage";
import { PrwTable } from "@core/entity/PrwTable";
import { PrwTableColumn } from "@core/entity/PrwTableColumn";
import { FrmdbSystemParam } from "@core/entity/PrwSystemParam";
import { setPermission } from "src/core-orm/setPermision"
import { Connection } from "typeorm";

export default async (conn: Connection) => {
    await setPermission(conn, 'administrator', 'ALL-TABLES', true, true, true, true);

    await setPermission(conn, 'frmdb_anon', PrwTable, true, false, false, false);
    await setPermission(conn, 'frmdb_anon', PrwPage, true, false, false, false);
    await setPermission(conn, 'frmdb_anon', PrwTableColumn, true, false, false, false);
    await setPermission(conn, 'frmdb_anon', PrwDictionary, true, false, false, false);
    await setPermission(conn, 'frmdb_anon', FrmdbSystemParam, true, false, false, false);

}
