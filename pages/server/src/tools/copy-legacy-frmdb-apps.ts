import { JSDOM } from 'jsdom';
import { HTMLTools, isHTMLElement } from "./html-tools";
import * as fs from 'fs';
import { cleanupDocumentDOM } from "./page-utils";
import { Page, Section, SubSection } from "../../../src/core-domain/core-resources/Websites";

const BASEDIR = '/home/acr/code/frmdb/formuladb-env/frmdb-apps/';
const APPS = [
    'base-app'
]

for (let app of APPS) {
    const sql = landingPage2sql(app, `${BASEDIR}/${app}/landing-page.html`);
    fs.writeFileSync(`../../rows/apps/60_website/50_data.${app}.sql`, sql.join("\n"));
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

    const page: Page = {
        id: `landing-page`,
        title: cleanedUpDOM.querySelector(`title`)?.innerHTML || 'title-not-found',
    };
    const sections: Section[] = [];
    const subSections: SubSection[] = [];

    let sectionIdx = 0;
    for (let sectionEl of Array.from(cleanedUpDOM.querySelectorAll(`body > *`))) {
        sectionIdx++;
        const sectionPartial = {
            pageId: page.id,
            id: 'section' + sectionIdx,
        };

        if (sectionEl.tagName.toLowerCase() === "frmdb-t-cover") {
            const section: Section = {
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
            const section: Section = {
                ...sectionPartial,
                component: 'HEADER'
            }
            sections.push(section);
        } else if ("frmdb-t-media-section-main" === sectionEl.tagName.toLowerCase() ||
            (sectionEl.tagName.toLowerCase() === "section" && sectionEl.querySelector('.row .text-center .jumbotron'))
        ) {
            const section: Section = {
                ...sectionPartial,
                component: 'MEDIA'
            }
            sections.push(section);
        } else if (sectionEl.tagName.toLowerCase() === "section" && sectionEl.querySelector('frmdb-t-card-deck frmdb-t-card-media-main')) {
            const section: Section = {
                ...sectionPartial,
                component: 'CARDS_IMG',
                title: sectionEl.querySelector('h2')?.innerHTML,
            }
            sections.push(section);
        } else if (sectionEl.tagName.toLowerCase() === "frmdb-t-section-cards-icon") {
            const section: Section = {
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

    let sql = [];
    sql.push(`
INSERT INTO pages (tenant, id, title)
VALUES ('${tenant}', '${page.id}', '${page.title}');
    `);
    for (let section of sections) {
        sql.push(`
INSERT INTO sections (tenant, id, page_id, name, component, title, subtitle, body, media_url, media_type)
VALUES ('${tenant}', '${section.id}', '${page.id}', '${section.name}', '${section.component}', '${section.title}', '${section.subtitle}', 
'${section.body?.replace(/'/g, "''")}', 
'${section.mediaUrl}', '${section.mediaType}');
        `);
    }

    return sql;
}
