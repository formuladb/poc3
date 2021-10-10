import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Meta } from "@core/entity/Meta";

const States = {ACTIVE:0, INACTIVE:0};

@Entity()
export class EquipmentType {
    @PrimaryColumn() id: number;

    @Column({default: "ALTELE"}) category: string;
    @Column({default: "MODEL-INEXISTENT"}) model: string;
    @Column() product_group: string;
    @Column({type: "enum", enum: Object.keys(States)}) 
    state!: keyof typeof States;

    @Column(() => Meta) meta: Meta;
}
