
    import "reflect-metadata";
    import { createConnection, getManager, getRepository } from "typeorm";
    import { autoMigrate } from "../../../core/orm/autoMigrate";
    import { putRow } from "../../../core/orm/putRow";
    import { Page } from "../entity/Page";
    import { Section, SubSection } from "../entity/Section";
    
    export default createConnection().then(async connection => {
    
        await autoMigrate(connection, Page);
        await autoMigrate(connection, Section);        
        await autoMigrate(connection, SubSection);        
        

        const page = await putRow(Page, {
            id: "index", title: "FormulaDB Themes", meta: { tenant: "apollo-medical-center" },
        });
        
        {
            const section = await putRow(Section, {
                id: "indexS2", title: `Apollo Medical Center`, component: "COVER", subtitle: `Subtitle of app, can be a bit longer in words`,
                body: `Lead paragraph providing a short introduction to you website or app,
                    <br>it would be good to keep it under two lines of text
                `,
                mediaUrl: "/formuladb-env/frmdb-apps/apollo-medical-center/static/54e3d64b4b57a814f6da8c7dda79367f1c37dfe752506c4870277ad5974dc25cbc_1280.jpg",mediaType: "IMAGE",meta: { tenant: "apollo-medical-center" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS3", title: `Section Heading`, component: "MEDIA", subtitle: ``,
                body: `Pretium quis neque a faucibus. Quisque tempus pharetra tellus, sed molestie velit mattis ut. Suspendisse feugiat ligula dui, at
                        convallis turpis auctor et.&nbsp;`,
                mediaUrl: "/formuladb-env/frmdb-apps/apollo-medical-center/static/55e5d24a4a50a514f6da8c7dda79367f1c37dfe752506c4870277ad5974dc65fb0_640.jpg",mediaType: "IMAGE",meta: { tenant: "apollo-medical-center" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS4", title: `Cards with Icons`, component: "CARDS_ICO", subtitle: `Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur.`,
                body: ``,
                meta: { tenant: "apollo-medical-center" }, page
            });
       
                    await putRow(SubSection, {
                        id: "indexS4sS1", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-user-md-job-medical-nurse-occupation-physician-profile-surgeon",mediaType: "ICON",meta: { tenant: "apollo-medical-center" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS4sS2", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-notes-medical-clipboard-doctor-ehr-health-history-records",mediaType: "ICON",meta: { tenant: "apollo-medical-center" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS4sS3", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-hospital-alt-building-emergency_room-medical_center",mediaType: "ICON",meta: { tenant: "apollo-medical-center" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS4sS4", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-procedures-EKG-bed-electrocardiogram-health-hospital-life-patient-vital",mediaType: "ICON",meta: { tenant: "apollo-medical-center" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS4sS5", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-x-ray-health-medical-radiological_images-radiology-skeleton",mediaType: "ICON",meta: { tenant: "apollo-medical-center" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS4sS6", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-ambulance-emergency-emt-er-help-hospital-support-vehicle",mediaType: "ICON",meta: { tenant: "apollo-medical-center" }
                        , section
                    });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS5", title: `Section Heading`, component: "MEDIA", subtitle: ``,
                body: `Etiam porta magna eu rutrum rhoncus. Sed ut tempor nibh. Nullam tempus egestas ullamcorper. Proin sollicitudin diam vel risus egestas, in
                        fringilla ligula finibus.`,
                mediaUrl: "/formuladb-env/frmdb-apps/apollo-medical-center/static/54e4d4454356a914f6da8c7dda79367f1c37dfe752506c4870277ad5974dc059ba_640.jpg",mediaType: "IMAGE",meta: { tenant: "apollo-medical-center" }, page
            });
        }

}).catch(error => console.log(error));
    