import { FrmdbDictionary } from "@core/entity/FrmdbDictionary";
import { FrmdbResource } from "@core/entity/FrmdbResource";
import { autoMigrate } from "src/core-orm/autoMigrate";
import { entityMetadata } from "src/core-orm/entityMetadata";
import { putRows } from "src/core-orm/putRow";
import { Form11_10_181 } from "./entity/Form11_10_181";

export default async () => {
    await autoMigrate(Form11_10_181);

    await putRows(FrmdbResource, [
        { id: "onrc", icon: "material-design-icons/settings", resource_type: "GROUP", menu_order: 1 },
        { id: entityMetadata(Form11_10_181).tableName, parent: "onrc", icon: "TBD", resource_type: "RESOURCE", menu_order: 0 },
    ]);

    const tblName = entityMetadata(Form11_10_181).tableName;
    await putRows(FrmdbDictionary, [
        { id: `resources.${tblName}.name`,  en: 'Form 11-10-181', ro: 'Formular 11-10-181'},
        { id: `resources.${tblName}.fields.id`,  en: 'Id', ro: 'Id'},
        { id: 'resources.quizzes.fields.meta_created_at', en: 'Created At', ro: 'Data Creare' },
        { id: 'resources.quizzes.fields.meta_created_by', en: 'Created By', ro: 'Creat De' },
        { id: 'resources.quizzes.fields.meta_updated_at', en: 'Updated At', ro: 'Data Modificare' },
        { id: 'resources.quizzes.fields.meta_updated_by', en: 'Updated By', ro: 'Modificat De' },
    ]);
}
