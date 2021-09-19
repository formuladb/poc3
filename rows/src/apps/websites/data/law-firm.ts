
    import { putRow } from "../../../core-orm/putRow";
    import { Page } from "../entity/Page";
    import { Section, SubSection } from "../entity/Section";
    
    export default async () => {
        

        const page = await putRow(Page, {
            id: "index", title: "FormulaDB Themes", meta: { tenant: "law-firm" },
        });
        
        {
            const section = await putRow(Section, {
                id: "indexS2", title: `THE Attorneys at Law`, component: "COVER", subtitle: ``,
                body: `'Nulum crimen, nulla poena sine lege scripta'`,
                mediaUrl: "/formuladb-env/frmdb-apps/law-firm/static/55e5d2444857a414f6da8c7dda79367f1c37dfe752506c4870277ad49045cd51bf_1280.jpg",mediaType: "IMAGE",meta: { tenant: "law-firm" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS3", title: `Our Practices`, component: "MEDIA", subtitle: ``,
                body: `Pretium quis neque a faucibus. Quisque tempus pharetra tellus, sed molestie velit mattis ut. Suspendisse feugiat ligula dui, at
                        convallis turpis auctor et. Etiam odio augue, sagittis vel quam quis, ultricies mollis mi. Fusce elementum ipsum a vehicula vehicula.`,
                mediaUrl: "/formuladb-env/frmdb-apps/law-firm/static/52e7dd424f55a514f6da8c7dda79367f1c37dfe752506c4870277ad49045c25bb8_640.jpg",mediaType: "IMAGE",meta: { tenant: "law-firm" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS4", title: `Practice Areas`, component: "CARDS_ICO", subtitle: `Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur.`,
                body: ``,
                meta: { tenant: "law-firm" }, page
            });
       
                    await putRow(SubSection, {
                        id: "indexS4sS1", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-gavel-hammer-judge-law-lawyer-opinion",mediaType: "ICON",meta: { tenant: "law-firm" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS4sS2", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-university-bank-building-college-higher_education_-_students-institution",mediaType: "ICON",meta: { tenant: "law-firm" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS4sS3", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-registered-copyright-mark-trademark",mediaType: "ICON",meta: { tenant: "law-firm" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS4sS4", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-search-dollar-bigger-enlarge-find-magnify-money-preview-zoom",mediaType: "ICON",meta: { tenant: "law-firm" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS4sS5", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-balance-scale-left-justice-legal-measure-unbalanced-weight",mediaType: "ICON",meta: { tenant: "law-firm" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS4sS6", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-brain-cerebellum-gray_matter-intellect-medulla_oblongata-mind-noodle-wit",mediaType: "ICON",meta: { tenant: "law-firm" }
                        , section
                    });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS5", title: `About Us`, component: "MEDIA", subtitle: ``,
                body: `Etiam porta magna eu rutrum rhoncus. Sed ut tempor nibh. Nullam tempus egestas ullamcorper. Proin sollicitudin diam vel risus egestas, in
                        fringilla ligula finibus.`,
                mediaUrl: "/formuladb-env/frmdb-apps/law-firm/static/57e9d24a4854ad14f6da8c7dda79367f1c37dfe752506c4870277ad49f49cc5fba_640.jpg",mediaType: "IMAGE",meta: { tenant: "law-firm" }, page
            });
        }

}
    