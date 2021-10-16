import { PrwDictionary } from "@core/entity/PrwDictionary";
import { PrwPage } from "@core/entity/PrwPage";
import { PrwTable } from "@core/entity/PrwTable";
import { autoMigrate } from "src/core-orm/autoMigrate";
import { entityMetadata } from "src/core-orm/entityMetadata";
import { putRow, putRows } from "src/core-orm/putRow";
import { setPermission } from "src/core-orm/setPermision";
import { metaColumnsDictionary } from "../base/metaColumnsDictonary";
import { Isf } from "./entity/Isf";
import { Playfield } from "./entity/Playfield";
import { isf__id } from "./isf__id";

export default async () => {
    await autoMigrate(Isf);

    const res1 = await putRow(PrwTable, 
        { id: entityMetadata(Isf).tableName, parent: "frf", icon: "material-design-icons-sports_soccer", resource_type: "RESOURCE", menu_order: 0 });

    await putRows(PrwTable, [
        { id: "frf", icon: "material-design-icons-map", resource_type: "GROUP", menu_order: 6 },
        { id: entityMetadata(Playfield).tableName, parent: "_hidden_", icon: "tbd", resource_type: "RESOURCE", menu_order: 0 },

    ]);

    await putRows(PrwPage, [
        { id: "isf__id", content: isf__id, prwTable: res1 },
    ]);

    let tblName = entityMetadata(Isf).tableName;
    await putRows(PrwDictionary, [
        { id: `resources.frf.name`,  en: 'FRF Forms', ro: 'Formulare FRF'},
        { id: `resources.${tblName}.fields.id`,  en: 'Id', ro: 'Id'},
        { id: `resources.${tblName}.name`,  en: 'Soccer Map', ro: 'Harta Fotbalului'},

        ...metaColumnsDictionary(tblName),
    ]);


    await setPermission('frmdb_anon', Isf, true, true, true, false);
}
