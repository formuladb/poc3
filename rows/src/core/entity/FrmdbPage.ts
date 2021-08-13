import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class FrmdbPage {
    @PrimaryColumn() id: string;
    @Column() icon: string;
    @Column() content: string;
};
