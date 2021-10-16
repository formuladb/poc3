import { useNode } from '@craftjs/core';
import React from 'react';
import { RichTextField, TextField } from 'react-admin';
import { CBlockProps } from '../../core/entity/page';
import { Grid, Box } from '@material-ui/core';

export const CBlock = (nP: CBlockProps) => {
    const {
        connectors: { connect, drag },
    } = useNode();

    return (
        <Grid item md={nP?.item?.width || 3} ref={connect as (instance: HTMLDivElement | null) => void}>
            <Box {...nP.box?.borders} {...nP.box?.spacing}>
                {nP.title && <h3 dangerouslySetInnerHTML={{__html: nP.title}}></h3>}
                {nP.subtitle && <h5 dangerouslySetInnerHTML={{__html: nP.subtitle}}></h5>}
                {nP.body && <p dangerouslySetInnerHTML={{__html: nP.body}}></p>}
            </Box>
        </Grid>
    );
};

// export const CBlockCOVER = (nP: CBlockCOVERProps) => {
//     return <>
//         <frmdb-t-cover style="--frmdb-bg-img: url('/formuladb-env/frmdb-apps/base-app/static/bg1.jpg')" className="">
//             <frmdb-t-main className="">
//                 <div className="jumbotron">
//                     <h6>
//                         <TextField resource={nP.resource} source={nP.subtitleSource}></TextField></h6>
//                     <h1 className="display-4">
//                         <TextField resource={nP.resource} source={nP.titleSource}></TextField></h1>
//                     <p>
//                         <RichTextField resource={nP.resource} source={nP.bodySource}></RichTextField></p>
//                     <a href="javascript:void(0)" className="btn btn-primary mx-auto">
//                         <TextField resource={nP.resource} source={nP.actionSource}></TextField></a>
//                 </div>
//             </frmdb-t-main>
//             <frmdb-t-aside className="">
//                 <div data-frmdb-fragment="_form.html"></div>
//             </frmdb-t-aside>
//             <frmdb-t-section-divider></frmdb-t-section-divider>
//         </frmdb-t-cover>
//     </>;
// }
// export const CBlockHEADER = (nP: CBlockHEADERProps) => {
//     return <>
//         <frmdb-t-header className="frmdb-t-header" style="--frmdb-bg-img: url('/formuladb-env/frmdb-apps/base-app/static/bg1.jpg')">
//             <div className="jumbotron">
//                 <h1 className="display-4">Page Title</h1>
//                 <p>Lead paragraph providing a short introduction to you page/blog post.
//                     <br />
//                 </p>
//                 <a href="javascript:void(0)" className="btn btn-primary mx-auto">Call To Action</a>
//             </div>
//         </frmdb-t-header>
//     </>;
// }
// export const CBlockMEDIA = (nP: CBlockMEDIAProps) => {
//     return <>

//         <frmdb-t-media-section-main style="--frmdb-bg-img: url('/formuladb-env/frmdb-apps/base-app/static/bg-right.jpg')" className="">
//             <frmdb-t-section-divider></frmdb-t-section-divider>
//             <div className="container py-5">
//                 <div className="row py-5">
//                     <div className="jumbotron col-md-5">
//                         <h2 id="mediasectionmainleft">Section heading</h2>
//                         <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at,
//                             tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
//                         <a className="btn btn-primary mx-auto" href="javascript:void(0)">Call to Action</a>
//                     </div>
//                 </div>
//             </div>
//             <frmdb-t-section-divider></frmdb-t-section-divider>
//         </frmdb-t-media-section-main>
//         <section className="frmdb-section-light container">
//             <frmdb-t-section-divider></frmdb-t-section-divider>
//             <div className="row">
//                 <div className="col">
//                     <img className="img-fluid" src="/formuladb-env/frmdb-apps/base-app/static/section1.jpg" alt="..."></img>
//                 </div>
//                 <div className="col text-center d-flex flex-column justify-content-center">
//                     <div className="jumbotron">
//                         <h2 id="mediasectionminorright">Section Heading</h2>
//                         <p>Pretium quis neque a faucibus. Quisque tempus pharetra tellus, sed molestie velit mattis ut. Suspendisse feugiat ligula dui, at
//                             convallis turpis auctor et. Etiam odio augue, sagittis vel quam quis, ultricies mollis mi. Fusce elementum ipsum a vehicula vehicula.</p>
//                         <a className="btn btn-primary mx-auto" href="javascript:void(0)">Call to Action</a>
//                     </div>
//                 </div>
//             </div>
//             <frmdb-t-section-divider></frmdb-t-section-divider>
//         </section>

//         <section className="frmdb-section-light container py-5 my-5">
//             <frmdb-t-section-divider></frmdb-t-section-divider>
//             <div className="row">
//                 <div className="col text-center d-flex flex-column justify-content-center">
//                     <div className="jumbotron">
//                         <h2 id="mediasectionminorleft">Section Heading</h2>
//                         <p>Etiam porta magna eu rutrum rhoncus. Sed ut tempor nibh. Nullam tempus egestas ullamcorper. Proin sollicitudin diam vel risus egestas, in
//                             fringilla ligula finibus.</p>
//                         <a className="btn btn-primary mx-auto" href="javascript:void(0)">Call to Action</a>
//                     </div>
//                 </div>
//                 <div className="col">
//                     <img className="img-fluid" src="/formuladb-env/frmdb-apps/base-app/static/section2.jpg" alt="..."></img>
//                 </div>
//             </div>
//             <frmdb-t-section-divider></frmdb-t-section-divider>
//         </section>
//     </>;
// }
// export const CBlockCARDS = (nP: CBlockCARDSProps) => {
//     return <>
//         <section className="frmdb-section-light container py-5">
//             <frmdb-t-section-divider></frmdb-t-section-divider>
//             <div className="text-center mb-5">
//                 <h2 id="thememediacards">Cards with Images</h2>
//                 <p>Section lead paragraph, some text about the content described in this section.</p>
//             </div>
//             <frmdb-t-card-deck className="frmdb-cards-4">
//                 <frmdb-t-card-media-main className="">
//                     <frmdb-t-img className="overflow-hidden" style="--frmdb-bg-img: url('/formuladb-env/frmdb-apps/base-app/static/card1.jpg')"></frmdb-t-img>
//                     <div className="card-body">
//                         <h5>Card 1 title</h5>
//                         <h6>Card 1 subtitle</h6>
//                         <p>Quisque ornare, quam a blandit malesuada</p>
//                     </div>
//                     <frmdb-t-card-action className="">
//                         <a href="javascript:void(0)" className="">Action</a>
//                     </frmdb-t-card-action>
//                     <frmdb-t-card-note className="">
//                         <span>INFO
//                             <small>info</small>
//                         </span>
//                     </frmdb-t-card-note>
//                 </frmdb-t-card-media-main>
//                 <frmdb-t-card-media-main className="">
//                     <frmdb-t-img className="overflow-hidden" style="--frmdb-bg-img: url('/formuladb-env/frmdb-apps/base-app/static/card2.jpg')"></frmdb-t-img>
//                     <div className="card-body">
//                         <h5>Card 2 title</h5>
//                         <h6>Card 2 subtitle</h6>
//                         <p>Integer sit amet nisi viverra, pharetra nibh</p>
//                     </div>
//                     <frmdb-t-card-action className="">
//                         <a href="javascript:void(0)" className="">Action</a>
//                     </frmdb-t-card-action>
//                     <frmdb-t-card-note className="">
//                         <span>INFO
//                             <small>info</small>
//                         </span>
//                     </frmdb-t-card-note>
//                 </frmdb-t-card-media-main>
//                 <frmdb-t-card-media-main className="">
//                     <frmdb-t-img className="overflow-hidden" style="--frmdb-bg-img: url('/formuladb-env/frmdb-apps/base-app/static/card3.jpg')"></frmdb-t-img>
//                     <div className="card-body">
//                         <h5>Card 3 title</h5>
//                         <h6>Card 3 subtitle</h6>
//                         <p>Curabitur suscipit, massa eu maximus fringilla</p>
//                     </div>
//                     <frmdb-t-card-action className="">
//                         <a href="javascript:void(0)" className="">Action</a>
//                     </frmdb-t-card-action>
//                     <frmdb-t-card-note className="">
//                         <span>INFO
//                             <small>info</small>
//                         </span>
//                     </frmdb-t-card-note>
//                 </frmdb-t-card-media-main>
//                 <frmdb-t-card-media-main className="">
//                     <frmdb-t-img className="overflow-hidden" style="--frmdb-bg-img: url('/formuladb-env/frmdb-apps/base-app/static/card4.jpg')"></frmdb-t-img>
//                     <div className="card-body">
//                         <h5>Card 4 title</h5>
//                         <h6>Card 4 subtitle</h6>
//                         <p>Etiam porta magna eu rutrum rhoncus</p>
//                     </div>
//                     <frmdb-t-card-action className="">
//                         <a href="javascript:void(0)" className="">Action</a>
//                     </frmdb-t-card-action>
//                     <frmdb-t-card-note className="">
//                         <span>INFO
//                             <small>info</small>
//                         </span>
//                     </frmdb-t-card-note>
//                 </frmdb-t-card-media-main>
//             </frmdb-t-card-deck>
//             <frmdb-t-section-divider></frmdb-t-section-divider>
//         </section>
//     </>;
// }
// export const CBlockCARDS2 = (nP: CBlockCARDS2Props) => {
//     return <>

//         <frmdb-t-section-cards-icon style="--frmdb-bg-img: url('/formuladb-env/frmdb-apps/base-app/static/bg3.jpg')" className="">
//             <frmdb-t-section-divider></frmdb-t-section-divider>
//             <div className="section_title text-center">
//                 <h2 id="themeiconcards">Cards with Icons</h2>
//                 <p>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur.</p>
//             </div>
//             <div className="container">
//                 <frmdb-t-card-deck className="frmdb-cards-3">
//                     <frmdb-t-card-icon-main className="">
//                         <h4>
//                             <frmdb-icon name="fontawesome-solid-utensils-cutlery-dining-dinner-eat-food-fork-knife-restaurant"></frmdb-icon> <span>Food</span>
//                         </h4>
//                         <p>Integer placerat id risus imperdiet molestie. Donec tempor a tellus at vehicula.</p>
//                     </frmdb-t-card-icon-main>
//                     <frmdb-t-card-icon-main className="">
//                         <h4>
//                             <frmdb-icon name="fontawesome-solid-biking-bicycle-bike-cycle-cycling-ride-wheel"></frmdb-icon> <span>Sports</span>
//                         </h4>
//                         <p>Maecenas tempor erat eget ornare vulputate. Praesent sem mauris, varius ornare mattis ac, iaculis eget neque.</p>
//                     </frmdb-t-card-icon-main>
//                     <frmdb-t-card-icon-main className="">
//                         <h4>
//                             <frmdb-icon name="fontawesome-solid-car-auto-automobile-sedan-transportation-travel-vehicle"></frmdb-icon> <span>Auto</span>
//                         </h4>
//                         <p>Maecenas at maximus nisi, at porttitor libero. Morbi imperdiet, sem a maximus posuere, urna sem placerat libero, at accumsan nisi metus
//                             eu nulla.</p>
//                     </frmdb-t-card-icon-main>
//                     <frmdb-t-card-icon-main className="">
//                         <h4>
//                             <frmdb-icon name="fontawesome-solid-tv-computer-display-monitor-television"></frmdb-icon> <span>TV</span>
//                         </h4>
//                         <p>In sodales feugiat pellentesque. Ut eget metus eget nunc commodo finibus. Cras mattis dolor sit amet lectus laoreet fermentum.</p>
//                     </frmdb-t-card-icon-main>
//                     <frmdb-t-card-icon-main className="">
//                         <h4>
//                             <frmdb-icon name="fontawesome-solid-glass-martini-alt-alcohol-bar-beverage-drink-liquor"></frmdb-icon> <span>Drinks</span>
//                         </h4>
//                         <p>Aliquam dignissim et risus et sagittis. Donec eros nibh, finibus ut nulla vel, volutpat fermentum libero. Donec malesuada varius risus.
//                         </p>
//                     </frmdb-t-card-icon-main>
//                     <frmdb-t-card-icon-main className="">
//                         <h4>
//                             <frmdb-icon name="fontawesome-solid-building-apartment-business-city-company-office-work"></frmdb-icon> <span>Building</span>
//                         </h4>
//                         <p>Etiam odio augue, sagittis vel quam quis, ultricies mollis mi. Fusce elementum ipsum a vehicula vehicula. Nulla lacinia vel erat in
//                             tempus.</p>
//                     </frmdb-t-card-icon-main>
//                 </frmdb-t-card-deck>
//             </div>
//             <frmdb-t-section-divider></frmdb-t-section-divider>
//         </frmdb-t-section-cards-icon>

//     </>;
// }
