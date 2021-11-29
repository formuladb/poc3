import { Entity, Column, PrimaryColumn, ManyToOne } from "typeorm";
import { PrwTable } from "./PrwTable";

@Entity({name: "prw_pages"})
export class PrwPage {
    @PrimaryColumn() id!: string;
    @Column({type: "json"}) content!: object;
    @ManyToOne(() => PrwTable, resource => resource.pages, )
    prwTable!: PrwTable;    
};
