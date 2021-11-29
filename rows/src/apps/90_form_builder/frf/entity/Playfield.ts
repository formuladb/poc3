import { ManyToOne, PrimaryColumn } from "typeorm";
import { Column, Entity } from "typeorm";
import { Meta } from "@core/entity/Meta";
import { Isf } from "./Isf";

@Entity()
export class Playfield {
    @PrimaryColumn() id: number;

    @ManyToOne(() => Isf, f => f.playfields, )
    isf: Isf;

    @Column() nume: string;
    @Column() localitate: string;
    @Column() strada: string;
    @Column() nr_teren: number;
    @Column() cod_postal: string;

    @Column(() => Meta) meta: Meta;

}
