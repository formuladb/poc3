import { AfterInsert, AfterUpdate, EntitySubscriberInterface, EventSubscriber, InsertEvent, ManyToOne, OneToMany, PrimaryColumn, UpdateEvent } from "typeorm";
import { Column, Entity } from "typeorm";
import { Meta } from "@core/entity/Meta";

@Entity()
export class Currency {
    @PrimaryColumn() id: string;

    @Column(() => Meta) meta?: Meta;
}
