import { Entity, Column } from "typeorm";

@Entity()
export class FrmdbPage {
    @Column() id: string;
    @Column() icon: string;
    @Column() content: object;
};
