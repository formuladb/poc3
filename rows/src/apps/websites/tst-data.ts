import "reflect-metadata";
import { createConnection, getManager, getRepository } from "typeorm";
import { autoMigrate } from "../../core/orm/autoMigrate";
import { putRow } from "../../core/orm/putRow";
import { Page } from "./entity/Page";
import { Section } from "./entity/Section";

createConnection().then(async connection => {

    await autoMigrate(connection, Page);
    await autoMigrate(connection, Section);

    const page = await putRow(Page, {
        id: "landing-page",
        meta: { tenant: "base-app" },
        title: "FormulaDB Themes",
    });

    await putRow(Section, {
        meta: { tenant: "base-app" },
        id: "landing-page-s1",
        title: 't1',
        subtitle: 'st1',
        body: 'body1',
        mediaUrl: 'http:://media1',
        mediaType: "IMAGE",
        component: "CARDS_ICO",
        page
    });
}).catch(error => console.log(error));
