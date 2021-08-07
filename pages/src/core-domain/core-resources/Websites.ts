export interface Page {
    id: string;
    title: string;    
}

interface PageElement {
    id: string;
    name?: string;
    title?: string;
    subtitle?: string;
    body?: string;
    mediaUrl?: string;
    mediaType?: 'IMAGE' | 'ICON';
}

interface SectionBase extends PageElement {
    component: 'COVER' | 'HEADER' | 'MEDIA' | 'CARDS_IMG' | 'CARDS_ICO';
}

export interface Section extends SectionBase {
    pageId: string;
}
export interface SubSection extends SectionBase {
    sectionId: string;
}
