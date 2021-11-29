import { ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Column, Entity } from "typeorm";
import { Meta } from "@core/entity/Meta";
import { Section } from "./Section";
import { STATIC_PAGES_TABLE } from "@core/entity/PrwPage";

@Entity({name: STATIC_PAGES_TABLE})
export class StaticPage {
    @PrimaryColumn() id: string;
    @Column() title: string;
    @Column(() => Meta) meta?: Meta;

    @OneToMany(() => Section, section => section.page)
    sections?: Section[];
}

export interface PageI extends StaticPage {}

