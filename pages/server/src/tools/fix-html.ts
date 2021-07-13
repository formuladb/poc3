const { JSDOM } = require('jsdom');
import { HTMLTools, isHTMLElement } from "./html-tools";
import * as fs from 'fs';
import { cleanupDocumentDOM } from "./page-utils";

export function fixHtml(fileNames: string[]) {
    for (let filePath of fileNames) {
        if (!filePath.match(/.*\.html$/)) { console.warn(filePath, "is not html"); continue }
        // replaceIconsCardDeck(filePath);
        replaceTags(filePath);
    }
}

function replaceNavUl(filePath: string) {
    let html = fs.readFileSync(filePath).toString();
    const jsdom = new JSDOM(html, {}, {
        features: {
            'FetchExternalResources': false,
            'ProcessExternalResources': false
        }
    });
    const htmlTools = new HTMLTools(jsdom.window.document, new jsdom.window.DOMParser());
    let cleanedUpDOM = cleanupDocumentDOM(htmlTools.doc);

    for (let el of Array.from(cleanedUpDOM.querySelectorAll(`.navbar .collapse.navbar-collapse ul.nav.navbar-nav`))) {
        let divEl = replaceEl(htmlTools, el, 'div');
        for (let liEl of Array.from(divEl.querySelectorAll('li.nav-item.dropdown'))) {
            replaceEl(htmlTools, liEl, 'div');
        }
        for (let liEl of Array.from(divEl.querySelectorAll('li.nav-item'))) {
            for (let navLink of Array.from(liEl.querySelectorAll('a.nav-link'))) {
                liEl.parentElement?.replaceChild(navLink, liEl);
            }
        }
    }

    let newHtml = htmlTools.document2html(cleanedUpDOM);
    fs.writeFileSync(filePath, newHtml);
}

function replaceEl(htmlTools: HTMLTools, el: Element, tagName: string): Element {
    let newEl = htmlTools.doc.createElement(tagName) as Element;
    newEl.innerHTML = el.innerHTML;
    for (let attr of Array.from(el.attributes)) {
        newEl.setAttribute(attr.name, attr.value);
    }
    el.parentElement!.replaceChild(newEl, el);

    return newEl;
}

function replaceCssClassWithTag(filePath: string, name: string) {
    let html = fs.readFileSync(filePath).toString();
    const jsdom = new JSDOM(html, {}, {
        features: {
            'FetchExternalResources': false,
            'ProcessExternalResources': false
        }
    });
    const htmlTools = new HTMLTools(jsdom.window.document, new jsdom.window.DOMParser());
    let cleanedUpDOM = cleanupDocumentDOM(htmlTools.doc);

    for (let el of Array.from(cleanedUpDOM.querySelectorAll(`.${name}`))) {
        let newEl = htmlTools.doc.createElement(name);
        newEl.innerHTML = el.innerHTML;
        for (let attr of Array.from(el.attributes)) {
            newEl.setAttribute(attr.name, attr.value);
        }
        newEl.classList.remove(name);
        el.parentElement!.replaceChild(newEl, el);
    }

    for (let el of Array.from(cleanedUpDOM.querySelectorAll(`frmdb-t-img > img`))) {
        el.parentElement!.setAttribute("style", `--frmdb-bg-img: url('${el.getAttribute("src")}')`);
        el.parentElement!.removeChild(el);
    }

    for (let el of Array.from(cleanedUpDOM.querySelectorAll(`section.my-5.py-5.frmdb-bg.frmdb-bg-parallax`))) {
        let newEl = htmlTools.doc.createElement('frmdb-t-media-section-main');
        newEl.innerHTML = el.innerHTML;
        for (let attr of Array.from(el.attributes)) {
            newEl.setAttribute(attr.name, attr.value);
        }
        newEl.removeAttribute("class");
        newEl.prepend(htmlTools.doc.createElement('frmdb-t-section-divider'));
        newEl.append(htmlTools.doc.createElement('frmdb-t-section-divider'));
        el.parentElement!.replaceChild(newEl, el);
    }

    for (let el of Array.from(cleanedUpDOM.querySelectorAll(`section.my-5.py-5.frmdb-section-dark.frmdb-bg-tint-parallax.frmdb-bg-tint-secondary-75`))) {
        let newEl = htmlTools.doc.createElement('frmdb-t-section-cards-icon');
        newEl.innerHTML = el.innerHTML;
        for (let attr of Array.from(el.attributes)) {
            newEl.setAttribute(attr.name, attr.value);
        }
        newEl.removeAttribute("class");
        newEl.prepend(htmlTools.doc.createElement('frmdb-t-section-divider'));
        newEl.append(htmlTools.doc.createElement('frmdb-t-section-divider'));
        el.parentElement!.replaceChild(newEl, el);
    }

    for (let el of Array.from(cleanedUpDOM.querySelectorAll(`frmdb-t-main[style*="--frmdb-bg-img"]`))) {
        let imgVar = el.getAttribute("style");
        if (imgVar && (el.parentElement!.getAttribute("style") || '').indexOf('--frmdb-bg-img') < 0) {
            el.parentElement!.setAttribute("style", imgVar);
        }
        el.removeAttribute('style');
    }

    let newHtml = htmlTools.document2html(cleanedUpDOM);
    fs.writeFileSync(filePath, newHtml);
}

function replaceTags(filePath: string) {
    console.log("processing file", filePath);
    replaceCssClassWithTag(filePath, 'frmdb-t-card-media-main');
    replaceCssClassWithTag(filePath, 'frmdb-t-aside');
    replaceCssClassWithTag(filePath, 'frmdb-t-card-action');
    replaceCssClassWithTag(filePath, 'frmdb-t-card-deck');
    replaceCssClassWithTag(filePath, 'frmdb-t-card-icon-main');
    replaceCssClassWithTag(filePath, 'frmdb-t-card-note');
    replaceCssClassWithTag(filePath, 'frmdb-t-cover');
    replaceCssClassWithTag(filePath, 'frmdb-t-footer');
    replaceCssClassWithTag(filePath, 'frmdb-t-header');
    replaceCssClassWithTag(filePath, 'frmdb-t-img');
    replaceCssClassWithTag(filePath, 'frmdb-t-main');
    replaceCssClassWithTag(filePath, 'frmdb-t-main-nav');
    replaceCssClassWithTag(filePath, 'frmdb-t-media-section-main');
    replaceCssClassWithTag(filePath, 'frmdb-t-section-cards-icon');
    replaceCssClassWithTag(filePath, 'frmdb-t-section-divider')
}


function replaceIconsCardDeck(filePath: string) {
    let html = fs.readFileSync(filePath).toString();
    const jsdom = new JSDOM(html, {}, {
        features: {
            'FetchExternalResources': false,
            'ProcessExternalResources': false
        }
    });
    const htmlTools = new HTMLTools(jsdom.window.document, new jsdom.window.DOMParser());
    let cleanedUpDOM = cleanupDocumentDOM(htmlTools.doc);

    for (let el of Array.from(cleanedUpDOM.querySelectorAll(`div.card-deck.frmdb-cards-3`))) {
        let cardDeckEl = replaceEl(htmlTools, el, 'frmdb-t-card-deck');
        cardDeckEl.classList.remove('card-deck');
    }

    let newHtml = htmlTools.document2html(cleanedUpDOM);
    fs.writeFileSync(filePath, newHtml);
}
