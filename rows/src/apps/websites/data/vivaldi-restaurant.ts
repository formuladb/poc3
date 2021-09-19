
    import { putRow } from "../../../core-orm/putRow";
    import { Page } from "../entity/Page";
    import { Section, SubSection } from "../entity/Section";
    
    export default async () => {
        

        const page = await putRow(Page, {
            id: "index", title: "FormulaDB Themes", meta: { tenant: "vivaldi-restaurant" },
        });
        
        {
            const section = await putRow(Section, {
                id: "indexS2", title: `Vivaldi Slow Food`, component: "COVER", subtitle: `Subtitle of app, can be a bit longer in words`,
                body: `Lead paragraph providing a short introduction to you website or app,
                    <br>it would be good to keep it under two lines of text
                `,
                mediaUrl: "/formuladb-env/frmdb-apps/restaurant/static/vivaldi-restaurant_57e1d0464b51ae14f6da8c7dda2936771d3edce4524c704c7d2979d29f44c35b_1280.jpg",mediaType: "IMAGE",meta: { tenant: "vivaldi-restaurant" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS3", title: `MENU`, component: "CARDS_IMG", subtitle: `Section lead paragraph, some text about the content described in this section.`,
                body: ``,
                meta: { tenant: "vivaldi-restaurant" }, page
            });
       
                    await putRow(SubSection, {
                        id: "indexS3sS1", title: `Card 1 title`, component: "CARD_IMG", subtitle: `Card 1 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/restaurant/static/vivaldi-restaurant_54e4d6454d56a414f6da8c7dda2936771d3edce4524c704c7d2979d3934fc15e_1280.jpg",mediaType: "IMAGE",meta: { tenant: "vivaldi-restaurant" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS3sS2", title: `Card 2 title`, component: "CARD_IMG", subtitle: `Card 2 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/restaurant/static/vivaldi-restaurant_52e9d0404e54a914f6da8c7dda2936771d3edce4524c704c7d2979d3934ec65e_1280.jpg",mediaType: "IMAGE",meta: { tenant: "vivaldi-restaurant" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS3sS3", title: `Card 3 title`, component: "CARD_IMG", subtitle: `Card 3 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/restaurant/static/vivaldi-restaurant_52e5d4424d55af14f6da8c7dda2936771d3edce4524c704c7d2979d39348c551_1280.jpg",mediaType: "IMAGE",meta: { tenant: "vivaldi-restaurant" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS3sS4", title: `Card 4 title`, component: "CARD_IMG", subtitle: `Card 4 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/restaurant/static/vivaldi-restaurant_55e6d2454d5baa14f6da8c7dda2936771d3edce4524c704c7d2979d39345c45a_1280.jpg",mediaType: "IMAGE",meta: { tenant: "vivaldi-restaurant" }
                        , section
                    });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS4", title: ``, component: "MEDIA", subtitle: ``,
                body: ``,
                mediaType: "IMAGE",meta: { tenant: "vivaldi-restaurant" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS5", title: `Reservations`, component: "MEDIA", subtitle: ``,
                body: `Pretium quis neque a faucibus. Quisque tempus pharetra tellus, sed molestie velit mattis ut. Suspendisse feugiat ligula dui, at
                        convallis turpis auctor et. Etiam odio augue, sagittis vel quam quis, ultricies mollis mi. Fusce elementum ipsum a vehicula vehicula.`,
                mediaUrl: "/formuladb-env/frmdb-apps/restaurant/static/vivaldi-restaurant_50e9d54a4d57b108f5d08460c6293e76143ddfe44e507441732d7ed5974cc2_1280.jpg",mediaType: "IMAGE",meta: { tenant: "vivaldi-restaurant" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS6", title: `Vivaldi Steak Tradition`, component: "MEDIA", subtitle: ``,
                body: `Etiam porta magna eu rutrum rhoncus. Sed ut tempor nibh. Nullam tempus egestas ullamcorper. Proin sollicitudin diam vel risus egestas, in
                        fringilla ligula finibus.`,
                mediaUrl: "/formuladb-env/frmdb-apps/restaurant/static/vivaldi-restaurant_5ee2d34a4c53b108f5d08460c6293e76143ddfe44e507441732d7cd09f49c0_1280.jpg",mediaType: "IMAGE",meta: { tenant: "vivaldi-restaurant" }, page
            });
        }

}
    