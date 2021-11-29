import { AfterInsert, AfterUpdate, EntitySubscriberInterface, EventSubscriber, InsertEvent, ManyToOne, OneToMany, PrimaryColumn, UpdateEvent } from "typeorm";
import { Column, Entity } from "typeorm";
import { Meta } from "@core/entity/Meta";
import { upsertChildren } from "../../../core-orm/upsertChildren";
import { StaticPage } from "./StaticPage";
import { CBlockProps } from "@core/entity/page";

const MediaTypes = {IMAGE:0, ICON:0 };
class SectionBase {
    @PrimaryColumn() id: string;
    @Column() name?: string;
    @Column() title?: string;
    @Column() subtitle?: string;
    @Column() body?: string;
    @Column() mediaUrl?: string;
    @Column({type: "enum", enum: Object.keys(MediaTypes)}) 
    mediaType?: keyof typeof MediaTypes;
    @Column() info?: string;
    @Column() action?: string;
    @Column() aside?: string;
    @Column(() => Meta) meta?: Meta;
}

const SectionBlockTypes: CBlockProps['cBlockType'][] = ["Heading", "Media", "Cards"];
@Entity()
export class Section extends SectionBase {
    @ManyToOne(() => StaticPage, page => page.sections, )
    page: StaticPage;

    @Column({type: "enum", enum: SectionBlockTypes}) 
    blockType: CBlockProps['cBlockType'];

    @OneToMany(() => SubSection, subSection => subSection.section)
    subSections?: SubSection[];
}
export interface SectionI extends Section {}

@EventSubscriber()
export class SectionSubscriber implements EntitySubscriberInterface<Section> {

    listenTo() {
        return Section;
    }

    afterInsert(event: InsertEvent<Section>) {
        upsertChildren(Section, event.entity);
    }
    afterUpdate(event: UpdateEvent<Section>) {
        upsertChildren(Section, event.entity);
    }
}

@Entity()
export class SubSection extends SectionBase {
    @ManyToOne(() => Section, section => section.subSections)
    section: Section;
}
export interface SubSectionI extends SubSection {}
