
    import "reflect-metadata";
    import { createConnection, getManager, getRepository } from "typeorm";
    import { autoMigrate } from "../../core/orm/autoMigrate";
    import { putRow } from "../../core/orm/putRow";
    import { Page } from "./entity/Page";
    import { Section, SubSection } from "./entity/Section";
    
    export default createConnection().then(async connection => {
    
        await autoMigrate(connection, Page);
        await autoMigrate(connection, Section);        
        await autoMigrate(connection, SubSection);        
        

    const page = await putRow(Page, {
        id: "landing-page", title: "FormulaDB Themes", meta: { tenant: "base-app" },
    });
        
            {
                const section = await putRow(Section, {
                    id: "S2", title: `Title of web app`, component: "COVER", subtitle: `Subtitle of app, can be a bit longer in words`,
                    body: `Lead paragraph providing a short introduction to you website or app,
                    <br>it would be good to keep it under two lines of text
                `,
                    mediaUrl: "/formuladb-env/frmdb-apps/base-app/static/bg1.jpg",mediaType: "IMAGE",meta: { tenant: "base-app" }, page
                });
            }
        
            {
                const section = await putRow(Section, {
                    id: "S3", title: `Cards with Images`, component: "CARDS_IMG", subtitle: `Section lead paragraph, some text about the content described in this section.`,
                    body: ``,
                    meta: { tenant: "base-app" }, page
                });
       
                    await putRow(SubSection, {
                        id: "sS1", title: `Card 1 title`, component: "CARD_IMG", subtitle: `Card 1 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/base-app/static/card1.jpg",mediaType: "IMAGE",meta: { tenant: "base-app" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "sS2", title: `Card 2 title`, component: "CARD_IMG", subtitle: `Card 2 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/base-app/static/card2.jpg",mediaType: "IMAGE",meta: { tenant: "base-app" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "sS3", title: `Card 3 title`, component: "CARD_IMG", subtitle: `Card 3 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/base-app/static/card3.jpg",mediaType: "IMAGE",meta: { tenant: "base-app" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "sS4", title: `Card 4 title`, component: "CARD_IMG", subtitle: `Card 4 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/base-app/static/card4.jpg",mediaType: "IMAGE",meta: { tenant: "base-app" }
                        , section
                    });
            }
        
            {
                const section = await putRow(Section, {
                    id: "S4", title: ``, component: "MEDIA", subtitle: ``,
                    body: ``,
                    meta: { tenant: "base-app" }, page
                });
            }
        
            {
                const section = await putRow(Section, {
                    id: "S5", title: ``, component: "MEDIA", subtitle: ``,
                    body: ``,
                    meta: { tenant: "base-app" }, page
                });
            }
        
            {
                const section = await putRow(Section, {
                    id: "S6", title: `Cards with Icons`, component: "CARDS_ICO", subtitle: `Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur.`,
                    body: ``,
                    meta: { tenant: "base-app" }, page
                });
       
                    await putRow(SubSection, {
                        id: "sS1", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-utensils-cutlery-dining-dinner-eat-food-fork-knife-restaurant",mediaType: "ICON",meta: { tenant: "base-app" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "sS2", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-biking-bicycle-bike-cycle-cycling-ride-wheel",mediaType: "ICON",meta: { tenant: "base-app" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "sS3", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-car-auto-automobile-sedan-transportation-travel-vehicle",mediaType: "ICON",meta: { tenant: "base-app" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "sS4", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-tv-computer-display-monitor-television",mediaType: "ICON",meta: { tenant: "base-app" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "sS5", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-glass-martini-alt-alcohol-bar-beverage-drink-liquor",mediaType: "ICON",meta: { tenant: "base-app" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "sS6", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-building-apartment-business-city-company-office-work",mediaType: "ICON",meta: { tenant: "base-app" }
                        , section
                    });
            }
        
            {
                const section = await putRow(Section, {
                    id: "S7", title: ``, component: "MEDIA", subtitle: ``,
                    body: ``,
                    meta: { tenant: "base-app" }, page
                });
            }

}).catch(error => console.log(error));
    