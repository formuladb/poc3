const { JSDOM } = require('jsdom');
import { HTMLTools, isHTMLElement } from "./html-tools";
import * as fs from 'fs';
import { cleanupDocumentDOM } from "./page-utils";
import { Page, Section, SubSection } from "../core-domain/core-resources/Websites";

for (let filePath of process.argv) {
    if (!filePath.match(/.*\.html$/)) { console.warn(filePath, "is not html"); continue }
    html2sql(filePath);
}

function html2sql(filePath: string) {
    let html = fs.readFileSync(filePath).toString();
    const jsdom = new JSDOM(html, {}, {
        features: {
            'FetchExternalResources': false,
            'ProcessExternalResources': false
        }
    });
    const htmlTools = new HTMLTools(jsdom.window.document, new jsdom.window.DOMParser());
    let cleanedUpDOM = cleanupDocumentDOM(htmlTools.doc);

    const page: Page = {
        id: filePath,
        title: cleanedUpDOM.querySelector(`title`)?.innerHTML || 'title-not-found',
    };
    const sections: Section[] = [];
    const subSections: SubSection[] = [];
    
    let sectionIdx = 0;
    for (let sectionEl of Array.from(cleanedUpDOM.querySelectorAll(`body > *`))) {
        sectionIdx++;
        const sectionPartial = {
            pageId: page.id,
            id: filePath + '-' + sectionIdx,
        };

        if (sectionEl.tagName === "frmdb-t-cover") {
            const section: Section = {
                ...sectionPartial,
                component: 'COVER'
            }
            sections.push(section);
        } else if (sectionEl.tagName === "frmdb-t-header") {
            const section: Section = {
                ...sectionPartial,
                component: 'HEADER'
            }
            sections.push(section);
        } else if (sectionEl.tagName === "section" && sectionEl.querySelector('.row .text-center .jumbotron')) {
            const section: Section = {
                ...sectionPartial,
                component: 'MEDIA'
            }
            sections.push(section);
        } else if (sectionEl.tagName === "section" && sectionEl.querySelector('frmdb-t-card-deck frmdb-t-card-media-main')) {
            const section: Section = {
                ...sectionPartial,
                component: 'CARDS'
            }
            sections.push(section);
        } else if (sectionEl.tagName === "section" && sectionEl.querySelector('frmdb-t-card-deck frmdb-t-card-icon-main')) {
            const section: Section = {
                ...sectionPartial,
                component: 'CARDS'
            }
            sections.push(section);
        } else throw new Error(`Unknown section ${htmlTools.normalizeDOM2HTML(sectionEl)}`);
    }

    console.log(`
        INSERT INTO pages (id, title)
        VALUES ('${page.id}', '${page.title}')
    `);
}
