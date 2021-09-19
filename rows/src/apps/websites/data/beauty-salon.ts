
    import { putRow } from "../../../core-orm/putRow";
    import { Page } from "../entity/Page";
    import { Section, SubSection } from "../entity/Section";
    
    export default async () => {
        

        const page = await putRow(Page, {
            id: "index", title: "FormulaDB Themes", meta: { tenant: "beauty-salon" },
        });
        
        {
            const section = await putRow(Section, {
                id: "indexS2", title: `Magic Beauty Salon`, component: "COVER", subtitle: `Subtitle of app, can be a bit longer in words`,
                body: `Lead paragraph providing a short introduction to you website or app,
                    <br>it would be good to keep it under two lines of text
                `,
                mediaUrl: "/formuladb-env/frmdb-apps/beauty-salon/static/52e0d1404a5baa14f6da8c7dda79367f1c37dfe752506c4870277bd5944ac05bbb_1280.jpg",mediaType: "IMAGE",meta: { tenant: "beauty-salon" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS3", title: `Our Services`, component: "CARDS_IMG", subtitle: `Section lead paragraph, some text about the content described in this section.`,
                body: ``,
                meta: { tenant: "beauty-salon" }, page
            });
       
                    await putRow(SubSection, {
                        id: "indexS3sS1", title: ``, component: "CARD_IMG", subtitle: ``,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/beauty-salon/static/1450045__pink_hair_hairstyle_women_pink_hair_hairstyle_women_young_1450045.jpg",mediaType: "IMAGE",meta: { tenant: "beauty-salon" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS3sS2", title: ``, component: "CARD_IMG", subtitle: ``,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/beauty-salon/static/55e7d4414851ac14f6da8c7dda79367f1c37dfe752506c4870277bdc9f45c25bbb_1280.jpg",mediaType: "IMAGE",meta: { tenant: "beauty-salon" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS3sS3", title: ``, component: "CARD_IMG", subtitle: ``,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/beauty-salon/static/55e0dc454c54a814f6da8c7dda79367f1c37dfe752506c4870277bd09e45cd5cbb_640.jpg",mediaType: "IMAGE",meta: { tenant: "beauty-salon" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS3sS4", title: ``, component: "CARD_IMG", subtitle: ``,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/beauty-salon/static/55e7dc404e53af14f6da8c7dda79367f1c37dfe752506c4870277bd09e4cc25ebf_640.jpg",mediaType: "IMAGE",meta: { tenant: "beauty-salon" }
                        , section
                    });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS4", title: ``, component: "MEDIA", subtitle: ``,
                body: ``,
                mediaType: "IMAGE",meta: { tenant: "beauty-salon" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS5", title: `Our Products`, component: "MEDIA", subtitle: ``,
                body: `Pretium quis neque a faucibus. Quisque tempus pharetra tellus, sed molestie velit mattis ut. Suspendisse feugiat ligula dui, at
                    convallis turpis auctor et. Etiam odio augue, sagittis vel quam quis, ultricies mollis mi. Fusce elementum ipsum a vehicula vehicula.`,
                mediaUrl: "/formuladb-env/frmdb-apps/beauty-salon/static/52e7d7454f53af14f6da8c7dda79367f1c37dfe752506c4870277bd1974dc75eba_640.jpg",mediaType: "IMAGE",meta: { tenant: "beauty-salon" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS6", title: `How To Find Us`, component: "CARDS_ICO", subtitle: `Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur.`,
                body: ``,
                meta: { tenant: "beauty-salon" }, page
            });
       
                    await putRow(SubSection, {
                        id: "indexS6sS1", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-mobile-alt-apple-call-cell_phone-cellphone-device-iphone-number-screen-telephone",mediaType: "ICON",meta: { tenant: "beauty-salon" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS6sS2", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-map-marker-alt-address-coordinates-destination-gps-localize-location-map-navigation-paper-pin-place-point_of_interest-position-route-travel",mediaType: "ICON",meta: { tenant: "beauty-salon" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS6sS3", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-clock-date-late-schedule-time-timer-timestamp-watch",mediaType: "ICON",meta: { tenant: "beauty-salon" }
                        , section
                    });
        }

}
    