
import "reflect-metadata";
import { createConnection, getManager, getRepository } from "typeorm";
import { autoMigrate } from "../../core-orm/autoMigrate";
import { putRow } from "../../core-orm/putRow";
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
import app12 from './data/restaurant';

export default createConnection().then(async connection => {

    await autoMigrate(connection, Page);
    await autoMigrate(connection, Section);        
    await autoMigrate(connection, SubSection);        

    await app1();
    await app2();
    await app3();
    await app4();
    await app5();
    await app6();
    await app7();
    await app8();
    await app9();
    await app10();
    await app11();
    await app12();

}).catch(error => console.log(error));
