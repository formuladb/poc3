
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
            id: "index", title: "FormulaDB Themes", meta: { tenant: "kids-playground" },
        });
        
        {
            const section = await putRow(Section, {
                id: "indexS2", title: `fun playground`, component: "COVER", subtitle: `all ages wellcome`,
                body: `We have the right kind of fun you need`,
                mediaUrl: "/formuladb-env/frmdb-apps/kids-playground/static/54e8d1444f52a414f6da8c7dda79367f1c37dfe752506c4870277ad59045c75fb8_1280.jpg",mediaType: "IMAGE",meta: { tenant: "kids-playground" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS3", title: ``, component: "MEDIA", subtitle: ``,
                body: ``,
                mediaType: "IMAGE",meta: { tenant: "kids-playground" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS4", title: `activities`, component: "CARDS_IMG", subtitle: `Section lead paragraph, some text about the content described in this section.`,
                body: ``,
                meta: { tenant: "kids-playground" }, page
            });
       
                    await putRow(SubSection, {
                        id: "indexS4sS1", title: `cozy playground`, component: "CARD_IMG", subtitle: `Card 1 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/kids-playground/static/50e4dc474c51b108f5d08460962936771d3edce4524c704c7d2e7bdd904ac759_1280.jpg",mediaType: "IMAGE",meta: { tenant: "kids-playground" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS4sS2", title: `cool games`, component: "CARD_IMG", subtitle: `Card 2 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/kids-playground/static/54e2d4464c52ad14f6da8c7dda79367f1c37dfe752506c4870277ad5924ac05bb1_640.jpg",mediaType: "IMAGE",meta: { tenant: "kids-playground" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS4sS3", title: `laser tag`, component: "CARD_IMG", subtitle: `Card 3 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/kids-playground/static/55e8dd4b4d5aaf14f6da8c7dda79367f1c37dfe752506c4870277ad5974dc15db0_1280.jpg",mediaType: "IMAGE",meta: { tenant: "kids-playground" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS4sS4", title: `escalade`, component: "CARD_IMG", subtitle: `Card 4 subtitle`,
                        body: ``,
                        mediaUrl: "/formuladb-env/frmdb-apps/kids-playground/static/52e8d5474f5bb108f5d08460962936771d3edce4524c704c7d2e7ad49745c558_1280.jpg",mediaType: "IMAGE",meta: { tenant: "kids-playground" }
                        , section
                    });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS5", title: `good vibes`, component: "MEDIA", subtitle: ``,
                body: `Pretium quis neque a faucibus. Quisque tempus pharetra tellus, sed molestie velit mattis ut. Suspendisse feugiat ligula dui, at
                        convallis turpis auctor et. Etiam odio augue, sagittis vel quam quis, ultricies mollis mi. Fusce elementum ipsum a vehicula vehicula.`,
                mediaUrl: "/formuladb-env/frmdb-apps/kids-playground/static/57e5d2424d56ab14f6da8c7dda79367f1c37dfe752506c4870277ad5924ac25ebd_640.jpg",mediaType: "IMAGE",meta: { tenant: "kids-playground" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS6", title: ``, component: "MEDIA", subtitle: ``,
                body: `Etiam porta magna eu rutrum rhoncus. Sed ut tempor nibh. Nullam tempus egestas ullamcorper. Proin sollicitudin diam vel risus egestas, in
                        fringilla ligula finibus.`,
                mediaUrl: "/formuladb-env/frmdb-apps/kids-playground/static/52e1d443485bb108f5d08460962936771d3edce4524c704c7d2e7ad49448c05b_1280.jpg",mediaType: "IMAGE",meta: { tenant: "kids-playground" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS7", title: `we like to party`, component: "CARDS_ICO", subtitle: `Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur.`,
                body: ``,
                meta: { tenant: "kids-playground" }, page
            });
       
                    await putRow(SubSection, {
                        id: "indexS7sS1", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-expand-arrow-bigger-enlarge-resize",mediaType: "ICON",meta: { tenant: "kids-playground" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS7sS2", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-handshake-agreement-greeting-meeting-partnership",mediaType: "ICON",meta: { tenant: "kids-playground" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS7sS3", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-user-clock-alert-person-remind-time",mediaType: "ICON",meta: { tenant: "kids-playground" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS7sS4", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-hamburger-bacon-beef-burger-burger_king-cheeseburger-fast_food-grill-ground_beef-mcdonalds-sandwich",mediaType: "ICON",meta: { tenant: "kids-playground" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS7sS5", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-gamepad-arcade-controller-d-pad-joystick-video-video_game",mediaType: "ICON",meta: { tenant: "kids-playground" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS7sS6", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-parking-auto-car-garage-meter",mediaType: "ICON",meta: { tenant: "kids-playground" }
                        , section
                    });
        }

}).catch(error => console.log(error));
    