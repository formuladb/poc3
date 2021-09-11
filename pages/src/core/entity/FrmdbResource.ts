import {Entity, Column, PrimaryColumn} from "typeorm";
import { ResourceFieldDef } from "./fields";

const FrmdbResourceTypes = {GROUP:0, PAGE:0, RESOURCE:0};

@Entity({name: "frmdb_resources"})
export class FrmdbResource {
    @PrimaryColumn() id!: string;
    @Column() parent?: string;
    @Column() icon?: string;
    @Column({type: "enum", enum: Object.keys(FrmdbResourceTypes)}) 
    resource_type!: keyof typeof FrmdbResourceTypes;
    @Column() menu_order!: number;
    @Column({type: "json"}) options?: {
        [role: string]: {
            layoutType: "ONE_PAGE" | "ADMIN";//TODO: | "LANDING_PAGE" | "ARTICLE_PAGE";
        }
    }
}

export interface FrmdbResourceI extends FrmdbResource {
}

export interface FrmdbResourceWithFields {
    id: string;
    field_defs: ResourceFieldDef[];
    refedResWithFields?: {[resource: string]: FrmdbResourceWithFields};
}
