
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
            id: "index", title: "FormulaDB Themes", meta: { tenant: "luxurious-restaurant.html" },
        });
        
        {
            const section = await putRow(Section, {
                id: "indexS2", title: `Luxury dining`, component: "COVER", subtitle: `Subtitle of app, can be a bit longer in words`,
                body: `Lead paragraph providing a short introduction to you website or app,
                    <br>it would be good to keep it under two lines of text
                `,
                mediaUrl: "/formuladb-env/frmdb-apps/restaurant/static/luxurious-restaurant_52e4dc4a4f50b108f5d08460c6293e76143ddfe44e507441732d7cd79049c1_1280.jpg",mediaType: "IMAGE",meta: { tenant: "luxurious-restaurant.html" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS3", title: `a passion for details`, component: "CARDS_IMG", subtitle: `Section lead paragraph, some text about the content described in this section.`,
                body: ``,
                meta: { tenant: "luxurious-restaurant.html" }, page
            });
       
                    await putRow(SubSection, {
                        id: "indexS3sS1", title: `Card 1 title`, component: "CARD_IMG", subtitle: `Card 1 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/restaurant/static/luxurious-restaurant_57e9d7454356aa14f6da8c7dda2936771d3edce4524c704c7d2979d3944acd5f_1280.jpg",mediaType: "IMAGE",meta: { tenant: "luxurious-restaurant.html" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS3sS2", title: `Card 2 title`, component: "CARD_IMG", subtitle: `Card 2 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/restaurant/static/luxurious-restaurant_52e9d6454356ab14f6da8c7dda2936771d3edce4524c704c7d2979d3924bcd5c_1280.jpg",mediaType: "IMAGE",meta: { tenant: "luxurious-restaurant.html" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS3sS3", title: `Card 3 title`, component: "CARD_IMG", subtitle: `Card 3 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/restaurant/static/luxurious-restaurant_54e5d24b4e56aa14f6da8c7dda2936771d3edce4524c704c7d2979d39245c451_1280.jpg",mediaType: "IMAGE",meta: { tenant: "luxurious-restaurant.html" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS3sS4", title: `Card 4 title`, component: "CARD_IMG", subtitle: `Card 4 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/restaurant/static/luxurious-restaurant_50e9d4404355b108f5d08460c6293e76143ddfe44e507441732d7ed5974cc2_1280.jpg",mediaType: "IMAGE",meta: { tenant: "luxurious-restaurant.html" }
                        , section
                    });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS4", title: `luxury treating`, component: "CARDS_ICO", subtitle: `Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur.`,
                body: ``,
                meta: { tenant: "luxurious-restaurant.html" }, page
            });
       
                    await putRow(SubSection, {
                        id: "indexS4sS1", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-fish-fauna-gold-seafood-swimming",mediaType: "ICON",meta: { tenant: "luxurious-restaurant.html" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS4sS2", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-glass-martini-alt-alcohol-bar-beverage-drink-liquor",mediaType: "ICON",meta: { tenant: "luxurious-restaurant.html" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS4sS3", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-car-auto-automobile-sedan-transportation-travel-vehicle",mediaType: "ICON",meta: { tenant: "luxurious-restaurant.html" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS4sS4", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-brands-cc-diners-club-",mediaType: "ICON",meta: { tenant: "luxurious-restaurant.html" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS4sS5", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-crown-award-favorite-king-queen-royal-tiara",mediaType: "ICON",meta: { tenant: "luxurious-restaurant.html" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS4sS6", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-building-apartment-business-city-company-office-work",mediaType: "ICON",meta: { tenant: "luxurious-restaurant.html" }
                        , section
                    });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS5", title: `relax and enjoy`, component: "MEDIA", subtitle: ``,
                body: `Etiam porta magna eu rutrum rhoncus. Sed ut tempor nibh. Nullam tempus egestas ullamcorper. Proin sollicitudin diam vel risus egestas, in
                        fringilla ligula finibus.`,
                mediaUrl: "/formuladb-env/frmdb-apps/restaurant/static/luxurious-restaurant_54e4d0404952ab14f6da8c7dda2936771d3edce4524c704c7d2979d3954ac25c_1280.jpg",mediaType: "IMAGE",meta: { tenant: "luxurious-restaurant.html" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS6", title: `taste the beauty&nbsp;`, component: "MEDIA", subtitle: ``,
                body: `Pretium quis neque a faucibus. Quisque tempus pharetra tellus, sed molestie velit mattis ut. Suspendisse feugiat ligula dui, at
                        convallis turpis auctor et. Etiam odio augue, sagittis vel quam quis, ultricies mollis mi. Fusce elementum ipsum a vehicula vehicula.`,
                mediaUrl: "/formuladb-env/frmdb-apps/restaurant/static/luxurious-restaurant_54e6d5434357a814f6da8c7dda2936771d3edce4524c704c7d2979d3944fc051_1280.jpg",mediaType: "IMAGE",meta: { tenant: "luxurious-restaurant.html" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS7", title: `find joy in a plate`, component: "MEDIA", subtitle: ``,
                body: `Etiam porta magna eu rutrum rhoncus. Sed ut tempor nibh. Nullam tempus egestas ullamcorper. Proin sollicitudin diam vel risus egestas, in
                        fringilla ligula finibus.`,
                mediaUrl: "/formuladb-env/frmdb-apps/restaurant/static/luxurious-restaurant_54e2d5404c55ad14f6da8c7dda2936771d3edce4524c704c7d2979d3954ac25c_1280.jpg",mediaType: "IMAGE",meta: { tenant: "luxurious-restaurant.html" }, page
            });
        }

}).catch(error => console.log(error));
    