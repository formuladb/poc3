import { Entity, Column, PrimaryColumn, ManyToOne } from "typeorm";
import { PageNode } from "./page";
import { PrwTable } from "./PrwTable";

@Entity({name: "prw_pages"})
export class PrwPage {
    @PrimaryColumn({type: "text"}) id!: string;
    @Column({type: "json"}) content!: PageNode;
    @ManyToOne(() => PrwTable, resource => resource.pages, )
    prwTable!: PrwTable;    
};
export interface PrwPageI extends PrwPage {}

export const STATIC_PAGES_TABLE = "static_page";