
    import "reflect-metadata";
    import { createConnection, getManager, getRepository } from "typeorm";
    import { autoMigrate } from "../../../core-orm/autoMigrate";
    import { putRow } from "../../../core-orm/putRow";
    import { Page } from "../entity/Page";
    import { Section, SubSection } from "../entity/Section";
    
    export default createConnection().then(async connection => {
    
        await autoMigrate(connection, Page);
        await autoMigrate(connection, Section);        
        await autoMigrate(connection, SubSection);        
        

        const page = await putRow(Page, {
            id: "index", title: "FormulaDB Themes", meta: { tenant: "dental-health" },
        });
        
        {
            const section = await putRow(Section, {
                id: "indexS2", title: `Dental Health`, component: "COVER", subtitle: `Subtitle of app, can be a bit longer in words`,
                body: `Lead paragraph providing a short introduction to your website or app,
                    <br>it would be good to keep it under two lines of text
                `,
                mediaUrl: "/formuladb-env/frmdb-apps/dental-health/static/53e6d647485bb108f5d08460962936771d3edce4524c704c7d2f7fdc9648c458_1280.jpg",mediaType: "IMAGE",meta: { tenant: "dental-health" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS3", title: `who we are and what we recommend`, component: "CARDS_IMG", subtitle: `Section lead paragraph, some text about the content described in this section.`,
                body: ``,
                meta: { tenant: "dental-health" }, page
            });
       
                    await putRow(SubSection, {
                        id: "indexS3sS1", title: `MEET THE EXPERTS`, component: "CARD_IMG", subtitle: ``,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/dental-health/static/54e0d44a4e50ac14f6da8c7dda79367f1c37dfe752506c4870277bd09648c651b0_640.jpg",mediaType: "IMAGE",meta: { tenant: "dental-health" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS3sS2", title: `SPECIAL TREATMENTS`, component: "CARD_IMG", subtitle: ``,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/dental-health/static/57e6d64a4c5aaf14f1dc8460c6293e76143ddfe44e507441702879d7944ac1_640.jpg",mediaType: "IMAGE",meta: { tenant: "dental-health" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS3sS3", title: `FAMILY CARD`, component: "CARD_IMG", subtitle: ``,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/dental-health/static/53e2d4464f53b108f5d08460962936771d3edce4524c704c7d2f7fdc964acd58_640.jpg",mediaType: "IMAGE",meta: { tenant: "dental-health" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS3sS4", title: `ADVICES FOR SENIORS`, component: "CARD_IMG", subtitle: ``,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/dental-health/static/52e7d7404d51ab14f6da8c7dda79367f1c37dfe752506c4870277bd09f4ccc5eb1_640.jpg",mediaType: "IMAGE",meta: { tenant: "dental-health" }
                        , section
                    });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS4", title: ``, component: "CARDS_IMG", subtitle: ``,
                body: ``,
                meta: { tenant: "dental-health" }, page
            });
       
                    await putRow(SubSection, {
                        id: "indexS4sS1", title: `DENTAL TECHNOLOGY`, component: "CARD_IMG", subtitle: ``,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/dental-health/static/57e8d3474350ad14f6da8c7dda79367f1c37dfe752506c4870277bd1974fc05aba_640.jpg",mediaType: "IMAGE",meta: { tenant: "dental-health" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS4sS2", title: `TEETH MOLD`, component: "CARD_IMG", subtitle: ``,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/dental-health/static/55e5d641435aad14f6da8c7dda79367f1c37dfe752506c4870277bd1974fc35db0_640.jpg",mediaType: "IMAGE",meta: { tenant: "dental-health" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS4sS3", title: `DENTAL VENEERS CARE`, component: "CARD_IMG", subtitle: ``,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/dental-health/static/54e3d64a4b54a414f6da8c7dda79367f1c37dfe752506c4870277bd1974fc35db0_640.jpg",mediaType: "IMAGE",meta: { tenant: "dental-health" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS4sS4", title: `BEFORE GETTING BRACES`, component: "CARD_IMG", subtitle: ``,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/dental-health/static/55e6d3404957b108f5d08460962936771d3edce4524c704c7d2f7ed4964ac459_640.jpg",mediaType: "IMAGE",meta: { tenant: "dental-health" }
                        , section
                    });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS5", title: `Our Services`, component: "CARDS_ICO", subtitle: `Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur.`,
                body: ``,
                meta: { tenant: "dental-health" }, page
            });
       
                    await putRow(SubSection, {
                        id: "indexS5sS1", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaType: "ICON",meta: { tenant: "dental-health" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS5sS2", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaType: "ICON",meta: { tenant: "dental-health" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS5sS3", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaType: "ICON",meta: { tenant: "dental-health" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS5sS4", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaType: "ICON",meta: { tenant: "dental-health" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS5sS5", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaType: "ICON",meta: { tenant: "dental-health" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS5sS6", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaType: "ICON",meta: { tenant: "dental-health" }
                        , section
                    });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS6", title: `Opening hours`, component: "MEDIA", subtitle: ``,
                body: ``,
                mediaUrl: "/formuladb-env/frmdb-apps/dental-health/static/54e0dc4a4e55a814f6da8c7dda79367f1c37dfe752506c4870277bd1974cc458b9_640.jpg",mediaType: "IMAGE",meta: { tenant: "dental-health" }, page
            });
        }

}).catch(error => console.log(error));
    