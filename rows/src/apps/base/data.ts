import "reflect-metadata";
import { createConnection, getManager, getRepository } from "typeorm";
import { putRows } from "../../core-orm/putRow";
import { FrmdbResource } from "@core/entity/FrmdbResource";
import { FrmdbSystemParam } from "@core/entity/FrmdbSystemParam";
import { putRole } from "src/core-orm/putRole";
import { entityMetadata } from "src/core-orm/entityMetadata";
import { FrmdbPage } from "@core/entity/FrmdbPage";
import { FrmdbDictionary } from "@core/entity/FrmdbDictionary";
import { metaColumnsDictionary } from "./metaColumnsDictonary";
import { FrmdbUser } from "@core/entity/FrmdbUser";

export default async () => {

    await putRows(FrmdbResource, [
        { id: "administer", icon: "material-design-icons-settings", resource_type: "GROUP", menu_order: 1 },
        { id: entityMetadata(FrmdbResource).tableName, parent: "administer", icon: "material-design-icons-table_rows", resource_type: "RESOURCE", menu_order: 1 },
        { id: entityMetadata(FrmdbPage).tableName, parent: "administer", icon: "material-design-icons-list_alt", resource_type: "RESOURCE", menu_order: 2 },
        { id: entityMetadata(FrmdbDictionary).tableName, parent: "administer", icon: "material-design-icons-translate", resource_type: "RESOURCE", menu_order: 3 },
        { id: entityMetadata(FrmdbSystemParam).tableName, parent: "administer", icon: "material-design-icons-settings_applications", resource_type: "RESOURCE", menu_order: 4 },
        { id: entityMetadata(FrmdbUser).tableName, parent: "administer", icon: "material-design-icons-people", resource_type: "RESOURCE", menu_order: 5 },
    ]);

    await putRows(FrmdbSystemParam, [
        { id: "LOCALE", val: "en" },
    ]);
    
    await putRows(FrmdbUser, [
        { id: "1", username: "admin", pass: "admin", role: "administrator" },
    ]);

    let tblName = entityMetadata(FrmdbResource).tableName;
    await putRows(FrmdbDictionary, [
        { id: `resources.administer.name`,  en: 'Administration', ro: 'Administrare'},
        { id: `resources.${tblName}.name`,  en: 'Resources', ro: 'Resurse'},
        { id: `resources.${tblName}.fields.id`,  en: 'Id', ro: 'Id'},
        ...metaColumnsDictionary(tblName),
    ]);

    tblName = entityMetadata(FrmdbPage).tableName;
    await putRows(FrmdbDictionary, [
        { id: `resources.${tblName}.name`,  en: 'Pages', ro: 'Pagini'},
        { id: `resources.${tblName}.fields.id`,  en: 'Id', ro: 'Id'},
        ...metaColumnsDictionary(tblName),
    ]);

    tblName = entityMetadata(FrmdbDictionary).tableName;
    await putRows(FrmdbDictionary, [
        { id: `resources.${tblName}.name`,  en: 'Dictionary', ro: 'Dicționar'},
        { id: `resources.${tblName}.fields.id`,  en: 'Id', ro: 'Id'},
        { id: `resources.${tblName}.fields.en`,  en: 'English', ro: 'Engleză'},
        { id: `resources.${tblName}.fields.ro`,  en: 'Romanian', ro: 'Română'},
        ...metaColumnsDictionary(tblName),
    ]);
    
    tblName = entityMetadata(FrmdbSystemParam).tableName;
    await putRows(FrmdbDictionary, [
        { id: `resources.${tblName}.name`,  en: 'System Params', ro: 'Parametri Sistem'},
        { id: `resources.${tblName}.fields.id`,  en: 'Id', ro: 'Id'},
        { id: `resources.${tblName}.fields.val`,  en: 'Value', ro: 'Valoare'},
        ...metaColumnsDictionary(tblName),
    ]);
    
    tblName = entityMetadata(FrmdbUser).tableName;
    await putRows(FrmdbDictionary, [
        { id: `resources.${tblName}.name`,  en: 'Users', ro: 'Utilizatori'},
        { id: `resources.${tblName}.fields.id`,  en: 'Id', ro: 'Id'},
        { id: `resources.${tblName}.fields.username`,  en: 'Username', ro: 'Nume Utilizator'},
        { id: `resources.${tblName}.fields.role`,  en: 'Role', ro: 'Rol'},
        { id: `resources.${tblName}.fields.pass`,  en: 'Pass', ro: 'Parolă'},
        ...metaColumnsDictionary(tblName),
    ]);

    await putRole('administrator');
    await putRole('operator');
}
