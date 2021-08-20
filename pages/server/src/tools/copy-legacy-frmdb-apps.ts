import { JSDOM } from 'jsdom';
import { HTMLTools, isHTMLElement } from "./html-tools";
import * as fs from 'fs';
import { cleanupDocumentDOM } from "./page-utils";
import { PageI } from "../../../../rows/src/apps/websites/entity/Page";
import { SectionI, SubSectionI } from "../../../../rows/src/apps/websites/entity/Section";

const BASEDIR = '/home/acr/code/frmdb/formuladb-env/frmdb-apps/';
const APPS = [
    'base-app'
]

for (let app of APPS) {
    const ts = landingPage2sql(app, `${BASEDIR}/${app}/landing-page.html`);
    fs.writeFileSync(`../../rows/src/apps/websites/data.ts`, ts.join("\n"));
}

function landingPage2sql(app: string, filePath: string) {
    const tenant = app;

    let html = fs.readFileSync(filePath).toString();
    const jsdom = new JSDOM(html, {
        // features: {
        //     'FetchExternalResources': false,
        //     'ProcessExternalResources': false
        // }
    });
    const htmlTools = new HTMLTools(jsdom.window.document, new jsdom.window.DOMParser());
    let cleanedUpDOM = cleanupDocumentDOM(htmlTools.doc);

    const page: PageI = {
        id: `landing-page`,
        meta: { tenant },
        title: cleanedUpDOM.querySelector(`title`)?.innerHTML || 'title-not-found',
    };
    const sections: SectionI[] = [];
    const subSections: SubSectionI[] = [];

    let sectionIdx = 0;
    for (let sectionEl of Array.from(cleanedUpDOM.querySelectorAll(`body > *`))) {
        sectionIdx++;
        const sectionPartial = {
            meta: { tenant },
            pageId: page.id,
            id: 'section' + sectionIdx,
            page,
        };

        if (sectionEl.tagName.toLowerCase() === "frmdb-t-cover") {
            const section: SectionI = {
                ...sectionPartial,
                component: 'COVER',
                title: sectionEl.querySelector('h1')?.innerHTML,
                subtitle: sectionEl.querySelector('h6')?.innerHTML,
                body: sectionEl.querySelector('.jumbotron p')?.innerHTML,
                mediaUrl: (sectionEl as HTMLElement)?.style?.getPropertyValue('--frmdb-bg-img')
                    .replace(/url\('/, '').replace(/'\)/, ''),
                mediaType: "IMAGE"
            }
            sections.push(section);
        } else if (sectionEl.tagName.toLowerCase() === "frmdb-t-header") {
            const section: SectionI = {
                ...sectionPartial,
                component: 'HEADER'
            }
            sections.push(section);
        } else if ("frmdb-t-media-section-main" === sectionEl.tagName.toLowerCase() ||
            (sectionEl.tagName.toLowerCase() === "section" && sectionEl.querySelector('.row .text-center .jumbotron'))
        ) {
            const section: SectionI = {
                ...sectionPartial,
                component: 'MEDIA'
            }
            sections.push(section);
        } else if (sectionEl.tagName.toLowerCase() === "section" && sectionEl.querySelector('frmdb-t-card-deck frmdb-t-card-media-main')) {
            const section: SectionI = {
                ...sectionPartial,
                component: 'CARDS_IMG',
                title: sectionEl.querySelector('h2')?.innerHTML,
            }
            sections.push(section);
        } else if (sectionEl.tagName.toLowerCase() === "frmdb-t-section-cards-icon") {
            const section: SectionI = {
                ...sectionPartial,
                component: 'CARDS_ICO'
            }
            sections.push(section);
        } else if ([
            "frmdb-t-main-nav",
            "frmdb-t-section-divider",
            "frmdb-notification-container",
            "frmdb-fe"].includes(sectionEl.tagName.toLowerCase())
            || sectionEl.matches('[data-frmdb-fragment="_footer.html"]')
            || sectionEl.matches('[data-frmdb-fragment="_scripts.html"]')
        ) {
            //ingnore
        } else throw new Error(`Unknown section ${htmlTools.normalizeDOM2HTML(sectionEl)}`);
    }

    let dataTsFile = [`
import "reflect-metadata";
import { createConnection, getManager, getRepository } from "typeorm";
import { autoMigrate } from "../../core/orm/autoMigrate";
import { putRow } from "../../core/orm/putRow";
import { Page } from "./entity/Page";
import { Section } from "./entity/Section";

createConnection().then(async connection => {

    await autoMigrate(connection, Page);
    await autoMigrate(connection, Section);        
    `];

    dataTsFile.push(`
    const page = await putRow(Page, {
        id: "${page.id}",
        meta: { tenant: "${tenant}" },
        title: "${page.title}",
    });
    `);
    for (let section of sections) {
        dataTsFile.push(`

    await putRow(Section, {
        meta: { tenant: "${tenant}" },
        id: "${section.id}",
        title: \`${section.title}\`,
        subtitle: \`${section.subtitle}\`,
        body: \`${section.body}\`,${
        section.mediaUrl ? `mediaUrl: "${section.mediaUrl}",`: ''}${
        section.mediaType ? `mediaType: "${section.mediaType}",`: ''}
        component: "${section.component}",
        page
    });
        `);
    }

    dataTsFile.push(`
}).catch(error => console.log(error));
    `);


    return dataTsFile;
}
