import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class FrmdbDictionary {
    @PrimaryColumn() id!: string;
    @Column() en?: string;
    @Column() fr?: string;
    @Column() de?: string;
    @Column() it?: string;
    @Column() es?: string;
    @Column() pl?: string;
    @Column() el?: string;
    @Column() ro?: string;
    @Column() bg?: string;
    @Column() da?: string;
    @Column() sv?: string;
    @Column() no?: string;
    @Column() nl?: string;
}
