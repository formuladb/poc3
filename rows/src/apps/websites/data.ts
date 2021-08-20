
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
        id: "section2",
        title: `Title of web app`,
        subtitle: `Subtitle of app, can be a bit longer in words`,
        body: `Lead paragraph providing a short introduction to you website or app,
                    <br>it would be good to keep it under two lines of text
                `,mediaUrl: "/formuladb-env/frmdb-apps/base-app/static/bg1.jpg",mediaType: "IMAGE",
        component: "COVER",
        page
    });
        


    await putRow(Section, {
        meta: { tenant: "base-app" },
        id: "section3",
        title: `Cards with Images`,
        subtitle: `undefined`,
        body: `undefined`,
        component: "CARDS_IMG",
        page
    });
        


    await putRow(Section, {
        meta: { tenant: "base-app" },
        id: "section4",
        title: `undefined`,
        subtitle: `undefined`,
        body: `undefined`,
        component: "MEDIA",
        page
    });
        


    await putRow(Section, {
        meta: { tenant: "base-app" },
        id: "section5",
        title: `undefined`,
        subtitle: `undefined`,
        body: `undefined`,
        component: "MEDIA",
        page
    });
        


    await putRow(Section, {
        meta: { tenant: "base-app" },
        id: "section6",
        title: `undefined`,
        subtitle: `undefined`,
        body: `undefined`,
        component: "CARDS_ICO",
        page
    });
        


    await putRow(Section, {
        meta: { tenant: "base-app" },
        id: "section7",
        title: `undefined`,
        subtitle: `undefined`,
        body: `undefined`,
        component: "MEDIA",
        page
    });
        

}).catch(error => console.log(error));
    