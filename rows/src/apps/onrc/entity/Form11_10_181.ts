import { AfterInsert, AfterUpdate, EntitySubscriberInterface, EventSubscriber, InsertEvent, ManyToOne, OneToMany, PrimaryColumn, UpdateEvent } from "typeorm";
import { Column, Entity } from "typeorm";
import { Meta } from "@core/entity/Meta";

@Entity()
export class Form11_10_181 {
    @PrimaryColumn() id: string;
    @Column() tribunal: string;
    @Column() name: string;
    @Column(() => Meta) meta: Meta;
}

export interface Form11_10_181I extends Form11_10_181 {}
