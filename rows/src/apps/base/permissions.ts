import { PrwDictionary } from "@core/entity/PrwDictionary";
import { PrwPage } from "@core/entity/PrwPage";
import { PrwTable } from "@core/entity/PrwTable";
import { FrmdbResourceField } from "@core/entity/PrwTableColumn";
import { FrmdbSystemParam } from "@core/entity/PrwSystemParam";
import { setPermission } from "src/core-orm/setPermision"

export default async () => {
    await setPermission('administrator', 'ALL-TABLES', true, true, true, true);

    await setPermission('frmdb_anon', PrwTable, true, false, false, false);
    await setPermission('frmdb_anon', PrwPage, true, false, false, false);
    await setPermission('frmdb_anon', FrmdbResourceField, true, false, false, false);
    await setPermission('frmdb_anon', PrwDictionary, true, false, false, false);
    await setPermission('frmdb_anon', FrmdbSystemParam, true, false, false, false);

}
