import { ManyToOne, PrimaryColumn } from "typeorm";
import { Column, Entity } from "typeorm";
import { Meta } from "@core/entity/Meta";
import { Isf } from "./Isf";

@Entity()
export class Playfield {
    @PrimaryColumn() id: number;

    @ManyToOne(() => Isf, f => f.playfields, )
    isf: Isf;

    @Column() denumirea_actului: string;
    @Column() nr_file: number;

    @Column(() => Meta) meta: Meta;

}
