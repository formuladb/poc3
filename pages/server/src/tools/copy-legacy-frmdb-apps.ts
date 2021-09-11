import { JSDOM } from 'jsdom';
import { HTMLTools, isHTMLElement } from "./html-tools";
import * as fs from 'fs';
import { cleanupDocumentDOM } from "./page-utils";
import { PageI } from "../../../../rows/src/apps/websites/entity/Page";
import { SectionI, SubSectionI } from "../../../../rows/src/apps/websites/entity/Section";

const BASEDIR = '/home/acr/code/pagerows/old-frmdb-env/env/frmdb-apps';
const APPS = [
    { app: 'base-app', index: 'landing-page.html' },
    { app: 'apollo-medical-center', index: 'index.html' },
    { app: 'beauty-salon', index: 'index.html' },
    { app: 'blog-add-on-app', index: 'index.html' },
    { app: 'dental-health', index: 'index.html' },
    { app: 'design-therapy', index: 'index.html' },
    { app: 'health-guardians', index: 'index.html' },
    { app: 'it-services', index: 'index.html' },
    { app: 'kids-playground', index: 'index.html' },
    { app: 'law-firm', index: 'index.html' },
    { app: 'photography-services', index: 'index.html' },
    { app: 'restaurant', index: 'vivaldi-restaurant.html', tenant: 'vivaldi-restaurant.html' },
    { app: 'restaurant', index: 'luxurious-restaurant.html', tenant: 'luxurious-restaurant.html' },
    { app: 'restaurant', index: 'local-restaurant.html', tenant: 'local-restaurant.html' },
    { app: 'restaurant', index: 'pizza-time.html', tenant: 'pizza-time.html' },
    { app: 'restaurant', index: 'proper-stack-house.html', tenant: 'proper-stack-house.html' },
    { app: 'restaurant', index: 'raw-baking.html', tenant: 'raw-baking.html' },
    { app: 'restaurant', index: 'restaurat-good-food.html', tenant: 'restaurat-good-food.html' },
    { app: 'sports', index: 'index.html' },
    { app: 'users', index: 'index.html' },
    { app: 'wellness-services', index: 'index.html' },
]

for (let aP of APPS) {
    console.log("#########################################################################")
    console.log(`# ${aP.app}, ${aP.tenant}`)
    console.log("#########################################################################")
    const ts = landingPage2sql(aP.app, `${BASEDIR}/${aP.app}/${aP.index}`, aP.tenant || aP.app, 'index');
    fs.writeFileSync(`../../rows/src/apps/websites/data/${aP.app}.ts`, ts.join("\n"));
}

function landingPage2sql(app: string, filePath: string, tenant: string, pageId: string) {

    let dataTsFile = [`
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
        id: pageId,
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
            id: page.id + 'S' + sectionIdx,
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
                    .replace(/url\(['"]/, '').replace(/['"]\)/, ''),
                mediaType: "IMAGE",
                aside: getFragment(app, sectionEl.querySelector('frmdb-t-aside'), htmlTools),
            }
        } else if (sectionEl.tagName.toLowerCase() === "frmdb-t-header") {
            section = {
                ...sectionPartial,
                component: 'HEADER'
            }
        } else if ("frmdb-t-media-section-main" === sectionEl.tagName.toLowerCase() ||
            (sectionEl.tagName.toLowerCase() === "section" &&
                sectionEl.querySelector('.row .col img') &&
                sectionEl.querySelector('.row .col.text-center h2') &&
                sectionEl.querySelector('.row .col.text-center p') &&
                sectionEl.querySelector('.row .col.text-center a'))
        ) {//
            section = {
                ...sectionPartial,
                component: 'MEDIA',
                title: sectionEl.querySelector('.col.text-center h2')?.innerHTML,
                body: sectionEl.querySelector('.col.text-center p')?.innerHTML,
                mediaUrl: sectionEl.querySelector('.row .col img')?.getAttribute('src'),
                mediaType: "IMAGE",
                action: sectionEl.querySelector('.col.text-center a')?.innerHTML,
            }
        } else if (sectionEl.tagName.toLowerCase() === "section" && sectionEl.querySelector('frmdb-t-card-media-main')) {
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
            "frmdb-fe",
            "style",
            "header",
            "section#app-list"
        ].includes(sectionEl.tagName.toLowerCase())
            || sectionEl.matches('[data-frmdb-fragment="_footer.html"]')
            || sectionEl.matches('[data-frmdb-fragment="_scripts.html"]')
        ) {
            //ingnore
        } else if (sectionEl.matches('[data-frmdb-fragment="versions.html"]')) {
            section = {
                ...sectionPartial,
                component: 'HTML',
                body: getFragment(app, sectionEl.parentElement, htmlTools),
            }
        } else if (sectionEl.matches('[data-frmdb-fragment="_form.html"]')) {
            section = {
                ...sectionPartial,
                component: 'FORM',
                body: getFragment(app, sectionEl.parentElement, htmlTools),
            }
        } else throw new Error(`Unknown section: ${htmlTools.normalizeDOM2HTML(sectionEl)}`);

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
            dataTsFile.push(`        }`);
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

    const subSectionSelector = sectionType === "CARDS_IMG" ? 'frmdb-t-card-media-main'
        : 'frmdb-t-card-icon-main';

    let subSectionIdx = 0;
    for (let subSectionEl of Array.from(sectionEl.querySelectorAll(subSectionSelector))) {
        subSectionIdx++;
        const subSectionPartial = {
            meta: { tenant },
            id: section.id + 'sS' + subSectionIdx,
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
                    .replace(/url\(['"]/, '').replace(/['"]\)/, ''),
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
                mediaUrl: subSectionEl.querySelector('frmdb-icon')?.getAttribute('name'),
                mediaType: "ICON",
            }
            subSections.push(subSection);
        }
    }
    console.log(subSections.length)

    return subSections;
}

function getFragment(app: string, el: Element | null, htmlTools) {
    if (!el) return;
    console.log(htmlTools.normalizeDOM2HTML(el));
    let fragmentEl = el.matches('[data-frmdb-fragment]') ? el
        : el.querySelector('[data-frmdb-fragment]');
    let fileName = fragmentEl?.getAttribute('data-frmdb-fragment');
    if (fragmentEl) {
        return fs.readFileSync(`${BASEDIR}/${app}/${fileName}`, 'utf-8');
    }
}