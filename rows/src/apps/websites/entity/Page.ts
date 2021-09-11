import { AfterInsert, AfterUpdate, EntitySubscriberInterface, EventSubscriber, InsertEvent, ManyToOne, OneToMany, PrimaryColumn, UpdateEvent } from "typeorm";
import { Column, Entity } from "typeorm";
import { Meta } from "../../../../../pages/src/core/entity/Meta";
import { upsertChildren } from "../../../core/orm/upsertChildren";
import { Section } from "./Section";

@Entity()
export class Page {
    @PrimaryColumn() id: string;
    @Column() title: string;
    @Column(() => Meta) meta: Meta;
    @OneToMany(() => Section, section => section.page)
    sections?: Section[];
}

export interface PageI extends Page {}

@EventSubscriber()
export class PageSubscriber implements EntitySubscriberInterface<Page> {

    listenTo() {
        return Page;
    }

    afterInsert(event: InsertEvent<Page>) {
        upsertChildren(Page, event.entity);
    }

    afterUpdate(event: UpdateEvent<Page>) {
        upsertChildren(Page, event.entity);
    }

}