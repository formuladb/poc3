import { FieldType, ResourceFieldDef } from "./fields";

export declare type Identifier = string | number;
export interface Record {
    id: Identifier;
    [key: string]: any;
}

export interface FrmdbResource {
    id: string;
    parent?: string;
    icon: string;
    resource_type: 'PAGE' | 'RESOURCE';
    menu_order: number;
}

export interface FrmdbResourceWithFields {
    id: string;
    field_defs: ResourceFieldDef[];
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