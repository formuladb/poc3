import { FrmdbDictionary } from "@core/entity/FrmdbDictionary";
import { FrmdbPage } from "@core/entity/FrmdbPage";
import { FrmdbResource } from "@core/entity/FrmdbResource";
import { FrmdbSystemParam } from "@core/entity/FrmdbSystemParam";
import { setPermission } from "src/core-orm/setPermision"

export default async () => {
    await setPermission('administrator', 'ALL-TABLES', true, true, true, true);

    await setPermission('frmdb_anon', FrmdbResource, true, false, false, false);
    await setPermission('frmdb_anon', FrmdbPage, true, false, false, false);
    await setPermission('frmdb_anon', FrmdbDictionary, true, false, false, false);
    await setPermission('frmdb_anon', FrmdbSystemParam, true, false, false, false);

}
