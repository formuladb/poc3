import {Entity, Column, PrimaryColumn, OneToMany} from "typeorm";
import { ResourceFieldDef } from "./fields";
import { PrwPage } from "./PrwPage";
import { PrwPermission } from "./PrwPermission";
import { PrwTableColumn } from "./PrwTableColumn";

const FrmdbResourceTypes = {GROUP:0, PAGE:0, RESOURCE:0};

@Entity({name: "prw_tables"})
export class PrwTable {
    @PrimaryColumn() id!: string;
    @Column() idType!: string;
    @Column() parent?: string;
    @Column() icon?: string;
    @Column({type: "enum", enum: Object.keys(FrmdbResourceTypes)}) 
    resource_type!: keyof typeof FrmdbResourceTypes;
    @Column() menu_order!: number;
    @Column({type: "json"}) options?: {
        [role: string]: {
            layoutType: "ONE_PAGE" | "ADMIN";//TODO: | "LANDING_PAGE" | "ARTICLE_PAGE";
        }
    };
    @OneToMany(() => PrwPage, page => page.prwTable)
    pages?: PrwPage[];
    @OneToMany(() => PrwTableColumn, field => field.prwTable)
    columns?: PrwTableColumn[];
    @OneToMany(() => PrwPermission, perm => perm.prwTable)
    permissions?: PrwPermission[];
}

export interface FrmdbResourceI extends PrwTable {
}

export interface FrmdbResourceWithFields {
    id: string;
    field_defs: ResourceFieldDef[];
    refedResWithFields?: {[resource: string]: FrmdbResourceWithFields};
}
