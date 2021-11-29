import { Entity, Column, PrimaryColumn, ManyToOne } from "typeorm";
import { PrwTable } from "./PrwTable";

@Entity({name: "prw_pages"})
export class PrwPage {
    @PrimaryColumn({type: "text"}) id!: string;
    @Column({type: "json"}) content!: object;
    @ManyToOne(() => PrwTable, resource => resource.pages, )
    prwTable!: PrwTable;    
};

export const STATIC_PAGES_TABLE = "static_page";