
import "reflect-metadata";
import { autoMigrate } from "../../core-orm/autoMigrate";
import { StaticPage } from "./entity/StaticPage";

import app1 from './data/apollo-medical-center';
import app2 from './data/base-app';
import app3 from './data/beauty-salon';
import app4 from './data/blog-add-on-app';
import app5 from './data/dental-health';
import app6 from './data/design-therapy';
import app7 from './data/health-guardians';
import app8 from './data/it-services';
import app9 from './data/kids-playground';
import app10 from './data/law-firm';
import app11 from './data/photography-services';
import app12 from './data/vivaldi-restaurant';
import app13 from './data/luxurious-restaurant';

import { putRole } from "src/core-orm/putRole";
import { putRows } from "src/core-orm/putRow";
import { PrwTable } from "@core/entity/PrwTable";
import { entityMetadata } from "src/core-orm/entityMetadata";
import { PrwDictionary } from "@core/entity/PrwDictionary";
import { metaColumnsDictionary } from "../00_base/metaColumnsDictonary";

export default async () => {

    await autoMigrate(StaticPage);

    await putRows(PrwTable, [
        { id: "websites", idType: "n/a", icon: "material-design-icons-language", resource_type: "GROUP", menu_order: 10 },
        { id: entityMetadata(StaticPage).tableName, idType: "text NOT NULL", parent: "websites", icon: "material-design-icons-post_add", resource_type: "RESOURCE", menu_order: 1, options: {"frmdb_anon": {layoutType: "WEBSITE_PAGE"}} },
    ]);

    let tblName = entityMetadata(StaticPage).tableName;
    //Diacritice (ă â î ș ț) (Ă Â Î Ș Ț)
    await putRows(PrwDictionary, [
        { id: `resources.websites.name`,  en: 'Website', ro: 'Website'},
        { id: `resources.${tblName}.fields.id`,  en: 'Id', ro: 'Id'},
        { id: `resources.${tblName}.name`,  en: 'Page', ro: 'Pagină'},
        { id: `resources.${tblName}.fields.title`, en: 'Title', ro: 'Titlu'},
        ...metaColumnsDictionary(tblName),
    ]);

    // await app1();
    // await app2();
    // await app3();
    // await app4();
    // await app5();
    // await app6();
    // await app7();
    // await app8();
    // await app9();
    // await app10();
    // await app11();
    // await app12();
    // await app13();

}
