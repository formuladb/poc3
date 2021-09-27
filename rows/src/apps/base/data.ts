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
import { FrmdbResourceField } from "@core/entity/FrmdbResourceFields";

export default async () => {

    await putRows(FrmdbResource, [
        { id: "debug", icon: "material-design-icons-settings_applications", resource_type: "GROUP", menu_order: 1 },
        { id: entityMetadata(FrmdbPage).tableName, parent: "debug", icon: "material-design-icons-list_alt", resource_type: "RESOURCE", menu_order: 1 },
        { id: entityMetadata(FrmdbResourceField).tableName, parent: "debug", icon: "material-design-icons-table_rows", resource_type: "RESOURCE", menu_order: 2 },
        { id: "administer", icon: "material-design-icons-settings", resource_type: "GROUP", menu_order: 2 },
        { id: entityMetadata(FrmdbResource).tableName, parent: "administer", icon: "material-design-icons-table_rows", resource_type: "RESOURCE", menu_order: 1 },
        { id: entityMetadata(FrmdbDictionary).tableName, parent: "administer", icon: "material-design-icons-translate", resource_type: "RESOURCE", menu_order: 4 },
        { id: entityMetadata(FrmdbSystemParam).tableName, parent: "administer", icon: "material-design-icons-settings_applications", resource_type: "RESOURCE", menu_order: 5 },
        { id: entityMetadata(FrmdbUser).tableName, parent: "administer", icon: "material-design-icons-people", resource_type: "RESOURCE", menu_order: 6 },
    ]);

    await putRows(FrmdbSystemParam, [
        { id: "LOCALE", val: "en" },
    ]);
    
    await putRole('administrator');
    await putRole('operator');
    await putRows(FrmdbUser, [
        { id: "100", username: "admin", pass: "admin", role: "administrator" },
    ]);

    let tblName = entityMetadata(FrmdbResource).tableName;
    await putRows(FrmdbDictionary, [
        { id: `resources.debug.name`,  en: 'Sys Admin', ro: 'Admin Sistem'},
        { id: `resources.administer.name`,  en: 'Administration', ro: 'Administrare'},
        { id: `resources.${tblName}.name`,  en: 'Resources', ro: 'Resurse'},
        { id: `resources.${tblName}.fields.id`,  en: 'Id', ro: 'Id'},
        ...metaColumnsDictionary(tblName),
    ]);

    //Diacritice (ă â î ș ț) (Ă Â Î Ș Ț)
    tblName = entityMetadata(FrmdbResourceField).tableName;
    await putRows(FrmdbDictionary, [
        { id: `resources.${tblName}.name`,  en: 'Resource Fields', ro: 'Câmpuri Resursă'},
        { id: `resources.${tblName}.fields.id`,  en: 'Id', ro: 'Id'},
        { id: `resources.${tblName}.fields.c_table_schema`, en: 'c_table_schema', ro: 'c_table_schema'}, 
        { id: `resources.${tblName}.fields.c_column_name`, en: 'c_column_name', ro: 'c_column_name'}, 
        { id: `resources.${tblName}.fields.c_data_type`, en: 'c_data_type', ro: 'c_data_type'}, 
        { id: `resources.${tblName}.fields.c_check`, en: 'c_check', ro: 'c_check'}, 
        { id: `resources.${tblName}.fields.c_default`, en: 'c_default', ro: 'c_default'}, 
        { id: `resources.${tblName}.fields.c_column_description`, en: 'c_column_description', ro: 'c_column_description'}, 
        { id: `resources.${tblName}.fields.c_is_updatable`, en: 'c_is_updatable', ro: 'c_is_updatable'}, 
        { id: `resources.${tblName}.fields.c_reference_to`, en: 'c_reference_to', ro: 'c_reference_to'}, 
        { id: `resources.${tblName}.fields.c_formula`, en: 'c_formula', ro: 'c_formula'}, 
        { id: `resources.${tblName}.fields.c_idx`, en: 'c_idx', ro: 'c_idx'}, 
    
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
}
