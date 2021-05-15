import { FieldType, ResourceFieldDef } from "./fields";

export interface FrmdbResource {
    id: string;
    parent?: string;
    icon: string;
    resource_type: 'GROUP' | 'PAGE' | 'RESOURCE';
    menu_order: number;
    options?: {
        [role: string]: {
            layoutType: "ONE_PAGE" | "ADMIN";//TODO: | "LANDING_PAGE" | "ARTICLE_PAGE";
        }
    }
}

export interface FrmdbResourceWithFields {
    id: string;
    field_defs: ResourceFieldDef[];
    refedResWithFields?: {[resource: string]: FrmdbResourceWithFields};
}

export interface FrmdbPage {
    id: string;
    icon: string;
    content: object;
};

export interface FrmdbSystemParams {
    id: string;
    value: string;
}

export interface FrmdbDictionary {
    id: string;
    en: string;
    fr: string;
    de: string;
    it: string;
    es: string;
    pl: string;
    el: string;
    ro: string;
    bg: string;
    da: string;
    sv: string;
    no: string;
    nl: string;
}