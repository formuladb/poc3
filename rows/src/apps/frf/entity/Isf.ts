import { AfterInsert, AfterUpdate, EntitySubscriberInterface, EventSubscriber, InsertEvent, ManyToOne, OneToMany, PrimaryColumn, UpdateEvent } from "typeorm";
import { Column, Entity } from "typeorm";
import { Meta } from "@core/entity/Meta";
import { Playfield } from "./Playfield";

@Entity()
export class Isf {
    @PrimaryColumn({default: `frmdb_short_uuid()`}) id: string;
    
    @Column() nume: string;
    @Column() prenume: string;
    @Column() telefon: string;
    @Column() email: string;

    @Column() judet_club: string;
    @Column() localitate_club: string;
    @Column() denumire_club: string;
    @Column() nr_identificare_club: string;

    @Column({nullable: true}) logo?: string;
    @Column({nullable: true}) imagine1?: string;
    @Column({nullable: true}) imagine2?: string;
    @Column({nullable: true}) imagine3?: string;
    @Column({nullable: true}) imagine4?: string;
    @Column({nullable: true}) imagine5?: string;

    @OneToMany(() => Playfield, d => d.isf)
    playfields?: Playfield[];

    @Column(() => Meta) meta: Meta;
}
