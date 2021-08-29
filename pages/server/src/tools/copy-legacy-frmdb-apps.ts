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

    let dataTsFile = [`
    import "reflect-metadata";
    import { createConnection, getManager, getRepository } from "typeorm";
    import { autoMigrate } from "../../core/orm/autoMigrate";
    import { putRow } from "../../core/orm/putRow";
    import { Page } from "./entity/Page";
    import { Section, SubSection } from "./entity/Section";
    
    export default createConnection().then(async connection => {
    
        await autoMigrate(connection, Page);
        await autoMigrate(connection, Section);        
        await autoMigrate(connection, SubSection);        
        `];

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

    dataTsFile.push(`
    const page = await putRow(Page, {
        id: "${page.id}", title: "${page.title}", meta: { tenant: "${tenant}" },
    });`);

    let sectionIdx = 0;
    for (let sectionEl of Array.from(cleanedUpDOM.querySelectorAll(`body > *`))) {
        sectionIdx++;
        const sectionPartial = {
            meta: { tenant },
            pageId: page.id,
            id: 'S' + sectionIdx,
            page,
        };
        let section: SectionI | null = null;

        if (sectionEl.tagName.toLowerCase() === "frmdb-t-cover") {
            section = {
                ...sectionPartial,
                component: 'COVER',
                title: sectionEl.querySelector('h1')?.innerHTML,
                subtitle: sectionEl.querySelector('h6')?.innerHTML,
                body: sectionEl.querySelector('.jumbotron p')?.innerHTML,
                mediaUrl: (sectionEl as HTMLElement)?.style?.getPropertyValue('--frmdb-bg-img')
                    .replace(/url\('/, '').replace(/'\)/, ''),
                mediaType: "IMAGE"
            }
        } else if (sectionEl.tagName.toLowerCase() === "frmdb-t-header") {
            section = {
                ...sectionPartial,
                component: 'HEADER'
            }
        } else if ("frmdb-t-media-section-main" === sectionEl.tagName.toLowerCase() ||
            (sectionEl.tagName.toLowerCase() === "section" && sectionEl.querySelector('.row .text-center .jumbotron'))
        ) {
            section = {
                ...sectionPartial,
                component: 'MEDIA'
            }
        } else if (sectionEl.tagName.toLowerCase() === "section" && sectionEl.querySelector('frmdb-t-card-deck frmdb-t-card-media-main')) {
            section = {
                ...sectionPartial,
                component: 'CARDS_IMG',
                title: sectionEl.querySelector('h2')?.innerHTML,
                subtitle: sectionEl.querySelector('h2 + p')?.innerHTML,
            }

        } else if (sectionEl.tagName.toLowerCase() === "frmdb-t-section-cards-icon") {
            section = {
                ...sectionPartial,
                component: 'CARDS_ICO',
                title: sectionEl.querySelector('h2')?.innerHTML,
                subtitle: sectionEl.querySelector('h2 + p')?.innerHTML,
            }
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

        if (section) {
            dataTsFile.push(`        
            {
                const section = await putRow(Section, {
                    id: "${section.id}", title: \`${section.title || ''}\`, component: "${section.component}", subtitle: \`${section.subtitle || ''}\`,
                    body: \`${section.body || ''}\`,
                    ${section.mediaUrl ? `mediaUrl: "${section.mediaUrl}",` : ''}${section.mediaType ? `mediaType: "${section.mediaType}",` : ''}meta: { tenant: "${tenant}" }, page
                });`);

            let subSections: SubSectionI[] = [];
            if (section.component === "CARDS_IMG") {
                subSections = getSubsections(sectionEl, "CARDS_IMG", tenant, section)
            } else if (section.component === "CARDS_ICO") {
                subSections = getSubsections(sectionEl, "CARDS_ICO", tenant, section)
            }

            if (subSections.length > 0) {
                for (let subSection of subSections) {
                    dataTsFile.push(`       
                    await putRow(SubSection, {
                        id: "${subSection.id}", title: \`${subSection.title || ''}\`, component: "${subSection.component}", subtitle: \`${subSection.subtitle || ''}\`,
                        body: \`${subSection.body || ''}\`,
                        ${subSection.mediaUrl ? `mediaUrl: "${subSection.mediaUrl}",` : ''}${subSection.mediaType ? `mediaType: "${subSection.mediaType}",` : ''}meta: { tenant: "${tenant}" }
                        , section
                    });`);
                }
            }
            dataTsFile.push(`            }`);
        }
    }

    dataTsFile.push(`
}).catch(error => console.log(error));
    `);


    return dataTsFile;
}


function getSubsections(
    sectionEl: Element,
    sectionType: 'CARDS_IMG' | 'CARDS_ICO',
    tenant: string,
    section: SectionI
): SubSectionI[] {
    const subSections: SubSectionI[] = [];

    const subSectionSelector = sectionType === "CARDS_IMG" ? 'frmdb-t-card-deck frmdb-t-card-media-main'
        : 'frmdb-t-card-deck frmdb-t-card-icon-main';

    let subSectionIdx = 0;
    for (let subSectionEl of Array.from(sectionEl.querySelectorAll(subSectionSelector))) {
        subSectionIdx++;
        const subSectionPartial = {
            meta: { tenant },
            id: 'sS' + subSectionIdx,
            section,
        };

        if (subSectionEl.tagName.toLowerCase() === "frmdb-t-card-media-main") {
            const subSection: SubSectionI = {
                ...subSectionPartial,
                component: 'CARD_IMG',
                title: subSectionEl.querySelector('h5')?.innerHTML,
                subtitle: subSectionEl.querySelector('h6')?.innerHTML,
                body: subSectionEl.querySelector('.h6 p')?.innerHTML,
                mediaUrl: (subSectionEl.querySelector('frmdb-t-img') as HTMLElement)?.style?.getPropertyValue('--frmdb-bg-img')
                    .replace(/url\('/, '').replace(/'\)/, ''),
                mediaType: "IMAGE",
                info: subSectionEl.querySelector('frmdb-t-card-note')?.innerHTML,
                action: subSectionEl.querySelector('frmdb-t-card-action')?.innerHTML,
            }
            subSections.push(subSection);
        } else if (subSectionEl.tagName.toLowerCase() === "frmdb-t-card-icon-main") {
            const subSection: SubSectionI = {
                ...subSectionPartial,
                component: 'CARD_ICON',
                title: subSectionEl.querySelector('frmdb-icon span')?.innerHTML,
                body: subSectionEl.querySelector('h4 p')?.innerHTML,
                mediaUrl: subSectionEl.querySelector('frmdb-icon').getAttribute('name'),
                mediaType: "ICON",
            }
            subSections.push(subSection);
        }
    }
    console.log(subSections.length)

    return subSections;
}