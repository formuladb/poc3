import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({name: "frmdb_pages"})
export class FrmdbPage {
    @PrimaryColumn() id!: string;
    @Column() icon!: string;
    @Column({type: "json"}) content!: object;
};
