import { ManyToOne, OneToMany } from "typeorm";
import { Column, Entity } from "typeorm";
import { Meta } from "./Meta";

@Entity()
export class Page {
    @Column() id: string;
    @Column() title: string;
    @Column(() => Meta) meta: Meta;
    @OneToMany(() => Section, section => section.page)
    sections: Section[];
}

const MediaTypes = {IMAGE:0, ICON:0 };
class SectionBase {
    @Column() id: string;
    @Column() name?: string;
    @Column() title?: string;
    @Column() subtitle?: string;
    @Column() body?: string;
    @Column() mediaUrl?: string;
    @Column({type: "enum", enum: Object.keys(MediaTypes)}) 
    @Column() mediaType?: keyof typeof MediaTypes;
    @Column(() => Meta) meta: Meta;
}

const SectionComponentTypes = {COVER:0, HEADER:0, MEDIA:0, CARDS_IMG:0, CARDS_ICO:0};
@Entity()
export class Section extends SectionBase {
    @ManyToOne(() => Page, page => page.sections)
    page: Page;

    @Column({type: "enum", enum: Object.keys(SectionComponentTypes)}) 
    component: keyof typeof SectionComponentTypes;

    @OneToMany(() => SubSection, subSection => subSection.section)
    subSections: SubSection[];

}

const SubSectionComponentTypes = {CARD:0};
@Entity()
export class SubSection extends SectionBase {
    @ManyToOne(() => Section, section => section.subSections)
    section: Section;

    @Column({type: "enum", enum: Object.keys(SubSectionComponentTypes)}) 
    component: keyof typeof SubSectionComponentTypes;
}
