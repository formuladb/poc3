
    import { putRow } from "../../../core-orm/putRow";
    import { Page } from "../entity/Page";
    import { Section, SubSection } from "../entity/Section";
    
    export default async () => {
    
        

        const page = await putRow(Page, {
            id: "index", title: "FormulaDB Themes", meta: { tenant: "health-guardians" },
        });
        
        {
            const section = await putRow(Section, {
                id: "indexS2", title: `Health Guardians`, component: "COVER", subtitle: `Subtitle of app, can be a bit longer in words`,
                body: `Lead paragraph providing a short introduction to you website or app,
                    <br>it would be good to keep it under two lines of text
                `,
                mediaUrl: "/formuladb-env/frmdb-apps/health-guardians/static/54e6d0474250af14f6da8c7dda79367f1c37dfe752506c4870277ad49f44cc5cbc_1280.jpg",mediaType: "IMAGE",meta: { tenant: "health-guardians" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS3", title: `meet the specialists`, component: "CARDS_IMG", subtitle: `Section lead paragraph, some text about the content described in this section.`,
                body: ``,
                meta: { tenant: "health-guardians" }, page
            });
       
                    await putRow(SubSection, {
                        id: "indexS3sS1", title: `dr. Lee Peng`, component: "CARD_IMG", subtitle: `GENERAL PRACTITIONER`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/health-guardians/static/52e6d2444e52ad14f6da8c7dda79367f1c37dfe752506c4870277bdd954bcd5bbd_640.jpg",mediaType: "IMAGE",meta: { tenant: "health-guardians" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS3sS2", title: `dr. John Perk`, component: "CARD_IMG", subtitle: `CARDIOLOGY SPECIALIST`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/health-guardians/static/57e1d14a4b56a514f6da8c7dda79367f1c37dfe752506c4870277bdd954bcd5bbd_640.jpg",mediaType: "IMAGE",meta: { tenant: "health-guardians" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS3sS3", title: `dr. Jose Lopez`, component: "CARD_IMG", subtitle: `HEMATOLOGIST`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/health-guardians/static/54e1d1424857a514f6da8c7dda79367f1c37dfe752506c4870277bdd954ac45cbe_640.jpg",mediaType: "IMAGE",meta: { tenant: "health-guardians" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS3sS4", title: `dr. Meghan Raw`, component: "CARD_IMG", subtitle: `DIABETOLOGIST`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/health-guardians/static/55e0d5464c5bae14f6da8c7dda79367f1c37dfe752506c4870277bdd954ac45cbe_640.png",mediaType: "IMAGE",meta: { tenant: "health-guardians" }
                        , section
                    });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS4", title: `how often should you visit your primary care dr?`, component: "MEDIA", subtitle: ``,
                body: `Pretium quis neque a faucibus. Quisque tempus pharetra tellus, sed molestie velit mattis ut. Suspendisse feugiat ligula dui, at
                        convallis turpis&nbsp;`,
                mediaUrl: "/formuladb-env/frmdb-apps/health-guardians/static/57e7d14a4f55ab14f6da8c7dda79367f1c37dfe752506c4870277bdd954bcd5bbd_640.jpg",mediaType: "IMAGE",meta: { tenant: "health-guardians" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS5", title: `medical support`, component: "MEDIA", subtitle: ``,
                body: `Etiam porta magna eu rutrum rhoncus. Sed ut tempor nibh. Nullam tempus egestas ullamcorper. Proin sollicitudin diam vel risus egestas, in
                        fringilla ligula finibus.`,
                mediaUrl: "/formuladb-env/frmdb-apps/health-guardians/static/53e6d647485ab108f5d08460962936771d3edce4524c704c7d2f72d69145c65d_640.jpg",mediaType: "IMAGE",meta: { tenant: "health-guardians" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS6", title: `health plan`, component: "MEDIA", subtitle: ``,
                body: `Pretium quis neque a faucibus. Quisque tempus pharetra tellus, sed molestie velit mattis ut. Suspendisse feugiat ligula dui, at
                        convallis turpis&nbsp;`,
                mediaUrl: "/formuladb-env/frmdb-apps/health-guardians/static/53e6d6474855b108f5d08460962936771d3edce4524c704c7d2f72d69145c65d_640.jpg",mediaType: "IMAGE",meta: { tenant: "health-guardians" }, page
            });
        }

}
    