import { AfterInsert, AfterUpdate, EntitySubscriberInterface, EventSubscriber, InsertEvent, ManyToOne, OneToMany, PrimaryColumn, UpdateEvent } from "typeorm";
import { Column, Entity } from "typeorm";
import { Meta } from "@core/entity/Meta";
import { Form11_10_181 } from "./Form11_10_181";

@Entity()
export class Doc11_10_181 {
    @PrimaryColumn() id: number;

    @ManyToOne(() => Form11_10_181, f => f.documents, )
    form: Form11_10_181;

    @Column() denumirea_actului: string;
    @Column() nr_file: number;

    @Column(() => Meta) meta: Meta;

}
