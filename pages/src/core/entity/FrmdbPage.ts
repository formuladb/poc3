import { Entity, Column, PrimaryColumn, ManyToOne } from "typeorm";
import { FrmdbResource } from "./FrmdbResource";

@Entity({name: "frmdb_pages"})
export class FrmdbPage {
    @PrimaryColumn() id!: string;
    @Column() icon!: string;
    @Column({type: "json"}) content!: object;
    @ManyToOne(() => FrmdbResource, resource => resource.pages, )
    resource!: FrmdbResource;    
};
