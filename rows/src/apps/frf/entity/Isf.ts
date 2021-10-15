import { AfterInsert, AfterUpdate, EntitySubscriberInterface, EventSubscriber, InsertEvent, ManyToOne, OneToMany, PrimaryColumn, UpdateEvent } from "typeorm";
import { Column, Entity } from "typeorm";
import { Meta } from "@core/entity/Meta";

@Entity()
export class Isf {
    @PrimaryColumn() id: string;
    @Column() tribunal: string;
    
    @Column() subsemnat_nume: string;
    @Column() subsemnat_domiciliat_in: string;
    @Column() subsemnat_str: string;
    @Column() subsemnat_nr: string;
    @Column() subsemnat_bloc: string;
    @Column() subsemnat_scara: string;
    @Column() subsemnat_etaj: string;
    @Column() subsemnat_apartament: string;

    @Column() autorizare: boolean;
    @Column() prelungire: boolean;
    @Column() schimbare_denumire: boolean;
    @Column() schimbare_sediu: boolean;
    @Column() renuntare: boolean;

    @Column() denumire_1: string;
    @Column() denumire_2: string;
    @Column() denumire_3: string;

    @Column() data: string;

    @Column() acord_pers_nume: string;
    @Column() acord_pers_data: string;


    @Column(() => Meta) meta: Meta;
}
