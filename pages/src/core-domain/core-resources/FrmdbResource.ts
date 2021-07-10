import { ResourceFieldDef } from "../fields";

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

