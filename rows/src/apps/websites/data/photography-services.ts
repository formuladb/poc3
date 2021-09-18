
    import { putRow } from "../../../core-orm/putRow";
    import { Page } from "../entity/Page";
    import { Section, SubSection } from "../entity/Section";
    
    export default async () => {
    
        

        const page = await putRow(Page, {
            id: "index", title: "FormulaDB Themes", meta: { tenant: "photography-services" },
        });
        
        {
            const section = await putRow(Section, {
                id: "indexS1", title: `Peter Parker&nbsp;
                    <div data-i18n="en">Photography</div>
                `, component: "COVER", subtitle: `Subtitle of app, can be a bit longer in words`,
                body: ``,
                mediaUrl: "/formuladb-env/frmdb-apps/photography-services/static/5ee6d0414357b108f5d08460962936771d3edce4524c704c7d2f79d4974ecc5b_1280.jpg",mediaType: "IMAGE",meta: { tenant: "photography-services" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS2", title: `Portfolio`, component: "CARDS_IMG", subtitle: `Section lead paragraph, some text about the content described in this section.`,
                body: ``,
                meta: { tenant: "photography-services" }, page
            });
       
                    await putRow(SubSection, {
                        id: "indexS2sS1", title: `&nbsp;Food photography`, component: "CARD_IMG", subtitle: `Card 1 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/photography-services/static/50e9d542485ab108f5d08460962936771d3edce4524c704c7d2f7ad19249c55e_640.jpg",mediaType: "IMAGE",meta: { tenant: "photography-services" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS2sS2", title: `Editorial photography
                        <div data-i18n="en"></div>
                    `, component: "CARD_IMG", subtitle: `Card 2 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/photography-services/static/54e3d3454e51a414f6da8c7dda79367f1c37dfe752506c4870277bd59248c059b9_640.jpg",mediaType: "IMAGE",meta: { tenant: "photography-services" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS2sS3", title: `Sports photography`, component: "CARD_IMG", subtitle: `Card 3 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/photography-services/static/50e7d2434b4fad0bffd8992cc6293e76143ddfe44e507441752e7ed1914acc_640.jpg",mediaType: "IMAGE",meta: { tenant: "photography-services" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS2sS4", title: `Events photography`, component: "CARD_IMG", subtitle: `Card 4 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/photography-services/static/51e2d0474950b108f5d08460962936771d3edce4524c704c7d2f7ad1924bc759_640.jpg",mediaType: "IMAGE",meta: { tenant: "photography-services" }
                        , section
                    });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS3", title: ``, component: "MEDIA", subtitle: ``,
                body: ``,
                mediaType: "IMAGE",meta: { tenant: "photography-services" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS4", title: `Workshops`, component: "MEDIA", subtitle: ``,
                body: `Section lead paragraph, some text about the content described in this section.`,
                mediaUrl: "/formuladb-env/frmdb-apps/photography-services/static/50e9d4404355b108f5d08460962936771d3edce4524c704c7d2f79d4904cc25a_640.jpg",mediaType: "IMAGE",meta: { tenant: "photography-services" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS5", title: `The art of food photography`, component: "MEDIA", subtitle: ``,
                body: `Pretium quis neque a faucibus. Quisque tempus pharetra tellus, sed molestie velit mattis ut. Suspendisse feugiat ligula dui, at
                    convallis turpis auctor et. Etiam odio augue, sagittis vel quam quis, ultricies mollis mi. Fusce elementum ipsum a vehicula vehicula.`,
                mediaUrl: "/formuladb-env/frmdb-apps/photography-services/static/50e9d4404355b108f5d08460962936771d3edce4524c704c7d2f79d4904cc25a_640.jpg",mediaType: "IMAGE",meta: { tenant: "photography-services" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS6", title: `Going pro with portraits photography`, component: "MEDIA", subtitle: ``,
                body: `Pretium quis neque a faucibus. Quisque tempus pharetra tellus, sed molestie velit mattis ut. Suspendisse feugiat ligula dui, at
                    convallis turpis auctor et. Etiam odio augue, sagittis vel quam quis, ultricies mollis mi. Fusce elementum ipsum a vehicula vehicula.`,
                mediaUrl: "/formuladb-env/frmdb-apps/photography-services/static/54e6dc454356ab14f6da8c7dda79367f1c37dfe752506c4870277bd6974dcd51b1_640.jpg",mediaType: "IMAGE",meta: { tenant: "photography-services" }, page
            });
        }

}
    