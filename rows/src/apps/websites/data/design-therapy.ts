
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
            id: "index", title: "FormulaDB Themes", meta: { tenant: "design-therapy" },
        });
        
        {
            const section = await putRow(Section, {
                id: "indexS2", title: `design therapy`, component: "COVER", subtitle: `Subtitle of app, can be a bit longer in words`,
                body: `Lead paragraph providing a short introduction to you website or app,
                    <br>it would be good to keep it under two lines of text
                `,
                mediaUrl: "/formuladb-env/frmdb-apps/design-therapy/static/55e1d144425bae14f6da8c7dda79367f1c37dfe752506c4870277bdd974fc45db8_1280.jpg",mediaType: "IMAGE",meta: { tenant: "design-therapy" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS3", title: `great project - diana's apartment&nbsp;`, component: "MEDIA", subtitle: ``,
                body: `Pretium quis neque a faucibus. Quisque tempus pharetra tellus, sed molestie velit mattis ut. Suspendisse feugiat ligula dui, at
                        convallis turpis&nbsp;`,
                mediaUrl: "/formuladb-env/frmdb-apps/design-therapy/static/54e1d0464955aa14f6da8c7dda79367f1c37dfe752506c4870277bdd974dcd5cbd_640.jpg",mediaType: "IMAGE",meta: { tenant: "design-therapy" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS4", title: `first room for your baby`, component: "MEDIA", subtitle: ``,
                body: `Etiam porta magna eu rutrum rhoncus. Sed ut tempor nibh. Nullam tempus egestas ullamcorper. Proin sollicitudin diam vel risus egestas, in
                        fringilla ligula finibus.`,
                mediaUrl: "/formuladb-env/frmdb-apps/design-therapy/static/55e1d1464956ad14f6da8c7dda79367f1c37dfe752506c4870277bdd974cc759bd_640.jpg",mediaType: "IMAGE",meta: { tenant: "design-therapy" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS5", title: `playing with textures`, component: "MEDIA", subtitle: ``,
                body: `Etiam porta magna eu rutrum rhoncus. Sed ut tempor nibh. Nullam tempus egestas ullamcorper. Proin sollicitudin diam vel risus egestas, in
                        fringilla ligula finibus.`,
                mediaUrl: "/formuladb-env/frmdb-apps/design-therapy/static/57e1d2424e54ae14f6da8c7dda79367f1c37dfe752506c4870277bdd974cc75cb8_640.jpg",mediaType: "IMAGE",meta: { tenant: "design-therapy" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS6", title: `small details - big impact`, component: "MEDIA", subtitle: ``,
                body: `Etiam porta magna eu rutrum rhoncus. Sed ut tempor nibh. Nullam tempus egestas ullamcorper. Proin sollicitudin diam vel risus egestas, in
                        fringilla ligula finibus.`,
                mediaUrl: "/formuladb-env/frmdb-apps/design-therapy/static/52e2d0434a5aa914f6da8c7dda79367f1c37dfe752506c4870277bdd974cc659bd_640.jpg",mediaType: "IMAGE",meta: { tenant: "design-therapy" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS7", title: `work from home`, component: "MEDIA", subtitle: ``,
                body: `Etiam porta magna eu rutrum rhoncus. Sed ut tempor nibh. Nullam tempus egestas ullamcorper. Proin sollicitudin diam vel risus egestas, in
                        fringilla ligula finibus.`,
                mediaUrl: "/formuladb-env/frmdb-apps/design-therapy/static/57e0dd424d52a414f6da8c7dda79367f1c37dfe752506c4870277bdd974cc158b1_640.jpg",mediaType: "IMAGE",meta: { tenant: "design-therapy" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS8", title: `how it works`, component: "CARDS_ICO", subtitle: `Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur.`,
                body: ``,
                meta: { tenant: "design-therapy" }, page
            });
       
                    await putRow(SubSection, {
                        id: "indexS8sS1", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-id-card-alt-contact-demographics-document-identification-issued-profile",mediaType: "ICON",meta: { tenant: "design-therapy" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS8sS2", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-handshake-agreement-greeting-meeting-partnership",mediaType: "ICON",meta: { tenant: "design-therapy" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS8sS3", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-couch-chair-cushion-furniture-relax-sofa",mediaType: "ICON",meta: { tenant: "design-therapy" }
                        , section
                    });
       
                    await putRow(SubSection, {
                        id: "indexS8sS4", title: ``, component: "CARD_ICON", subtitle: ``,
                        body: ``,
                        mediaUrl: "fontawesome-solid-home-abode-building-house-main",mediaType: "ICON",meta: { tenant: "design-therapy" }
                        , section
                    });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS9", title: ``, component: "FORM", subtitle: ``,
                body: `<form class="p-3 m-3 border border-2 border-primary" data-frmdb-fragment="_form.html">
<div class="row">
    <div class="col-md-4">
        <div class="form-group">
            <div class="input-group date">
                <input type="date" class="form-control" placeholder="Date Field">
                <div class="input-group-append">
                    <span class="input-group-text">
                        <i class="frmdb-i-calendar" aria-hidden="true"></i>
                    </span>
                </div>
            </div>
        </div>
        <div class="form-group"></div>
    </div>
    <div class="col-md-4">
        <div class="form-group">
            <div class="input-group">
                <input type="number" class="form-control" placeholder="Number Field" required="" max="4">
            </div>
        </div>
        <div class="form-group">
            <div class="input-group"></div>
        </div>
    </div>
    <div class="col-md-4 text-center">
        <a class="btn btn-primary w-100" href="javascript:void(0)" data-i18n="en">book a creative meeting</a>
    </div>
    <div class="form-group">
        <div class="input-group"></div>
    </div>
</div>
</form>`,
                meta: { tenant: "design-therapy" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS10", title: `rent our meeting room`, component: "MEDIA", subtitle: ``,
                body: `Etiam porta magna eu rutrum rhoncus. Sed ut tempor nibh. Nullam tempus egestas ullamcorper. Proin sollicitudin diam vel risus egestas, in
                        fringilla ligula finibus.`,
                mediaUrl: "/formuladb-env/frmdb-apps/design-therapy/static/54e1dd424354ac14f6da8c7dda79367f1c37dfe752506c4870277bdd974cc550bd_640.jpg",mediaType: "IMAGE",meta: { tenant: "design-therapy" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS11", title: `visit our showroom`, component: "MEDIA", subtitle: ``,
                body: `Here's the place where you can find and test lots of chairs, armchairs, seat sofas, etc. We also have decorations, plants, handmade products. Our colleagues will guide into this universe and will help you find the perfect products that you need for your home or special gifts for your beloved ones. Hit the "contact" button to see the address and the opening hours. Come! We can't wait to meet you!`,
                mediaUrl: "/formuladb-env/frmdb-apps/design-therapy/static/54e5d34a4950a914f6da8c7dda79367f1c37dfe752506c4870277bdd974cc758b8_640.jpg",mediaType: "IMAGE",meta: { tenant: "design-therapy" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS12", title: `online shop`, component: "MEDIA", subtitle: ``,
                body: `We also have an online shop for those who can't come to our showroom. You will be delighted with great products and we also made a special app that will help you find out what is your home style, how to pick colors and many more. Enjoy!`,
                mediaUrl: "/formuladb-env/frmdb-apps/design-therapy/static/57e1d14a4e53a814f6da8c7dda79367f1c37dfe752506c4870277bdd974fc05bbf_640.jpg",mediaType: "IMAGE",meta: { tenant: "design-therapy" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS13", title: `cozy reading in greenhouse`, component: "MEDIA", subtitle: ``,
                body: `Etiam porta magna eu rutrum rhoncus. Sed ut tempor nibh. Nullam tempus egestas ullamcorper. Proin sollicitudin diam vel risus egestas, in
                        fringilla ligula finibus.`,
                mediaUrl: "/formuladb-env/frmdb-apps/design-therapy/static/57e8d1434f50aa14f6da8c7dda79367f1c37dfe752506c4870277bdd974dcd5cbd_640.jpg",mediaType: "IMAGE",meta: { tenant: "design-therapy" }, page
            });
        }
        
        {
            const section = await putRow(Section, {
                id: "indexS14", title: `bedroom dreams`, component: "MEDIA", subtitle: ``,
                body: `The legendary space where the dream factory is. Even if the dreams don't come true (all the time) you still have to personalise this room because this is the place where you sleep and you charge your batteries and you need to feel comfortable. We have some ideas that may inspire you.&nbsp;`,
                mediaUrl: "/formuladb-env/frmdb-apps/design-therapy/static/55e3d5454f52ad14f6da8c7dda79367f1c37dfe752506c4870277bdd974ccc5cb9_640.jpg",mediaType: "IMAGE",meta: { tenant: "design-therapy" }, page
            });
        }

}).catch(error => console.log(error));
    