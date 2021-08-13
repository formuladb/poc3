import { ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Column, Entity } from "typeorm";
import { Meta } from "../../../core/entity/Meta";
import { Section } from "./Section";

@Entity()
export class Page {
    @PrimaryColumn() id: string;
    @Column() title: string;
    @Column(() => Meta) meta: Meta;
    @OneToMany(() => Section, section => section.page)
    sections?: Section[];
}
