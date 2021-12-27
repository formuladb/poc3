import "reflect-metadata";
import { Connection } from "typeorm";
import { putRow, putRows } from "../../core-orm/putRow";
import { PrwTable } from "@core/entity/PrwTable";
import { FrmdbSystemParam } from "@core/entity/PrwSystemParam";
import { putRole } from "src/core-orm/putRole";
import { entityMetadata } from "src/core-orm/entityMetadata";
import { PrwPage } from "@core/entity/PrwPage";
import { PrwDictionary } from "@core/entity/PrwDictionary";
import { metaColumnsDictionary } from "./metaColumnsDictonary";
import { PrwUser } from "@core/entity/PrwUser";
import { PrwTableColumn } from "@core/entity/PrwTableColumn";
import { prw_tables__id } from "./prw_tables__id";
import { PrwRole } from "@core/entity/PrwRole";
import { Currency } from "./entity/Currency";
import { autoMigrate } from "src/core-orm/autoMigrate";
import { ExchangeRate } from "./entity/ExchangeRate";
import permissions from "./permissions";

export default async (conn: Connection) => {
    console.log("################################################");
    console.log("## base ");
    console.log("################################################");

    await autoMigrate(conn, Currency);
    await conn.query("SHOW search_path");
    await autoMigrate(conn, ExchangeRate);

    const res1 = await putRow(conn, PrwTable, { id: entityMetadata(conn, PrwTable).tableName, idType: "text NOT NULL", parent: "administer", icon: "material-design-icons-table_rows", resource_type: "RESOURCE", menu_order: 0 });

    await putRows(conn, PrwTable, [
        { id: "debug", icon: "material-design-icons-settings_applications", idType: "n/a", resource_type: "GROUP", menu_order: 510 },
        { id: entityMetadata(conn, PrwPage).tableName, idType: "text NOT NULL", parent: "debug", icon: "material-design-icons-list_alt", resource_type: "RESOURCE", menu_order: 1 },
        { id: entityMetadata(conn, PrwTableColumn).tableName, idType: "text NOT NULL", parent: "debug", icon: "material-design-icons-table_rows", resource_type: "RESOURCE", menu_order: 2 },
        { id: "administer", icon: "material-design-icons-settings", idType: "n/a", resource_type: "GROUP", menu_order: 500 },
        { id: entityMetadata(conn, PrwDictionary).tableName, idType: "text NOT NULL", parent: "administer", icon: "material-design-icons-translate", resource_type: "RESOURCE", menu_order: 4 },
        { id: entityMetadata(conn, FrmdbSystemParam).tableName, idType: "text NOT NULL", parent: "administer", icon: "material-design-icons-edit_attributes", resource_type: "RESOURCE", menu_order: 5 },
        { id: entityMetadata(conn, PrwUser).tableName, idType: "text NOT NULL", parent: "administer", icon: "material-design-icons-people", resource_type: "RESOURCE", menu_order: 6 },
    ]);

    await putRows(conn, PrwPage, [
        { id: "prw_tables__id", content: prw_tables__id, prwTable: res1 },
    ]);

    await putRows(conn, FrmdbSystemParam, [
        { id: "LOCALE", val: "en" },
    ]);
    
    const admin = await putRow(conn, PrwRole, {id: 'administrator'});
    const oper = await putRow(conn, PrwRole, {id: 'operator'});
    await putRows(conn, PrwUser, [
        { id: 1, username: "admin", pass: "admin", prwRole: admin },
    ]);

    let tblName = entityMetadata(conn, PrwTable).tableName;
    await putRows(conn, PrwDictionary, [
        { id: `resources.debug.name`,  en: 'Sys Admin', ro: 'Admin Sistem'},
        { id: `resources.administer.name`,  en: 'Administration', ro: 'Administrare'},
        { id: `resources.${tblName}.name`,  en: 'Tables', ro: 'Tabele'},
        { id: `resources.${tblName}.fields.id`,  en: 'Id', ro: 'Id'},
        { id: `resources.${tblName}.fields.id_type`,  en: 'Id Column Type', ro: 'Tip Coloană Id'},
        { id: `resources.${tblName}.fields.parent`,  en: 'Parent', ro: 'Părinte'},
        { id: `resources.${tblName}.fields.resource_type`,  en: 'Type', ro: 'Tip'},
        { id: `resources.${tblName}.fields.icon`,  en: 'Icon', ro: 'Icoană'},
        { id: `resources.${tblName}.fields.menu_order`,  en: 'Menu Order', ro: 'Ordine Meniu'},
        ...metaColumnsDictionary(tblName),
    ]);

    //Diacritice (ă â î ș ț) (Ă Â Î Ș Ț)
    tblName = entityMetadata(conn, PrwTableColumn).tableName;
    await putRows(conn, PrwDictionary, [
        { id: `resources.${tblName}.name`,  en: 'Table Columns', ro: 'Coloane Tabele'},
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

    tblName = entityMetadata(conn, PrwPage).tableName;
    await putRows(conn, PrwDictionary, [
        { id: `resources.${tblName}.name`,  en: 'Pages', ro: 'Pagini'},
        { id: `resources.${tblName}.fields.id`,  en: 'Id', ro: 'Id'},
        ...metaColumnsDictionary(tblName),
    ]);

    tblName = entityMetadata(conn, PrwDictionary).tableName;
    await putRows(conn, PrwDictionary, [
        { id: `resources.${tblName}.name`,  en: 'Dictionary', ro: 'Dicționar'},
        { id: `resources.${tblName}.fields.id`,  en: 'Id', ro: 'Id'},
        { id: `resources.${tblName}.fields.en`,  en: 'English', ro: 'Engleză'},
        { id: `resources.${tblName}.fields.ro`,  en: 'Romanian', ro: 'Română'},
        { id: `resources.${tblName}.fields.fr`, en: 'fr', ro: 'fr'},
        { id: `resources.${tblName}.fields.de`, en: 'de', ro: 'de'},
        { id: `resources.${tblName}.fields.it`, en: 'it', ro: 'it'},
        { id: `resources.${tblName}.fields.es`, en: 'es', ro: 'es'},
        { id: `resources.${tblName}.fields.pl`, en: 'pl', ro: 'pl'},
        { id: `resources.${tblName}.fields.el`, en: 'el', ro: 'el'},
        { id: `resources.${tblName}.fields.bg`, en: 'bg', ro: 'bg'},
        { id: `resources.${tblName}.fields.da`, en: 'da', ro: 'da'},
        { id: `resources.${tblName}.fields.sv`, en: 'sv', ro: 'sv'},
        { id: `resources.${tblName}.fields.no`, en: 'no', ro: 'no'},
        { id: `resources.${tblName}.fields.nl`, en: 'nl', ro: 'nl'},
    
        ...metaColumnsDictionary(tblName),
    ]);
    
    tblName = entityMetadata(conn, FrmdbSystemParam).tableName;
    await putRows(conn, PrwDictionary, [
        { id: `resources.${tblName}.name`,  en: 'Parameters', ro: 'Parametri'},
        { id: `resources.${tblName}.fields.id`,  en: 'Id', ro: 'Id'},
        { id: `resources.${tblName}.fields.val`,  en: 'Value', ro: 'Valoare'},
        ...metaColumnsDictionary(tblName),
    ]);
    
    tblName = entityMetadata(conn, PrwUser).tableName;
    await putRows(conn, PrwDictionary, [
        { id: `resources.${tblName}.name`,  en: 'Users', ro: 'Utilizatori'},
        { id: `resources.${tblName}.fields.id`,  en: 'Id', ro: 'Id'},
        { id: `resources.${tblName}.fields.username`,  en: 'Username', ro: 'Nume Utilizator'},
        { id: `resources.${tblName}.fields.role`,  en: 'Role', ro: 'Rol'},
        { id: `resources.${tblName}.fields.pass`,  en: 'Pass', ro: 'Parolă'},
        ...metaColumnsDictionary(tblName),
    ]);


    await putRows(conn, Currency, [
        { id: "RON" },
        { id: "EUR" },
    ]);
    
    await permissions(conn);
}
