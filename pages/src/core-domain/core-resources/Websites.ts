export interface Page {
    id: string;
    title: string;    
}

interface SectionBase {
    id: string;
    component: 'COVER' | 'HEADER' | 'MEDIA' | 'CARDS_IMG' | 'CARDS_ICO';
    name?: string;
    title?: string;
    subtitle?: string;
    text?: string;
    mediaUrl?: string;
    mediaType?: 'IMAGE' | 'ICON';
}

export interface Section extends SectionBase {
    pageId: string;
}
export interface SubSection extends SectionBase {
    sectionId: string;
}
