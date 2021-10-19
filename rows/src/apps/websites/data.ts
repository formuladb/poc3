
import "reflect-metadata";
import { autoMigrate } from "../../core-orm/autoMigrate";
import { Page } from "./entity/Page";
import { Section, SubSection } from "./entity/Section";

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

export default async () => {

    await autoMigrate(Page);
    await autoMigrate(Section);
    await autoMigrate(SubSection);

    await putRows(PrwTable, [
        { id: "websites", idType: "n/a", icon: "material-design-icons/settings", resource_type: "GROUP", menu_order: 1 },
        { id: entityMetadata(Page).tableName, idType: "text NOT NULL", parent: "websites", icon: "TBD", resource_type: "RESOURCE", menu_order: 1 },
        { id: entityMetadata(Section).tableName, idType: "text NOT NULL", parent: "websites", icon: "TBD", resource_type: "RESOURCE", menu_order: 2 },
        { id: entityMetadata(SubSection).tableName, idType: "text NOT NULL", parent: "websites", icon: "material-design-icons/settings", resource_type: "RESOURCE", menu_order: 3 },
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
