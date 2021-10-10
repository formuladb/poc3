import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Meta } from "@core/entity/Meta";
import { EquipmentType } from "./EquipmentType";
import { Customer } from "src/apps/crm/Customer";

const States = {ACTIVE:0, INACTIVE:0};


@Entity()
export class Equipment {
    @PrimaryColumn() id: string;
    
    @ManyToOne(() => EquipmentType)
    equipmentType: EquipmentType;
    @ManyToOne(() => Customer)
    customer: Customer;

    @Column() serial1?: string;
    @Column() serial2?: string;
    @Column() serial3?: string;
    @Column() install_date: Date;
    @Column() options: string;
    @Column() nb_piston_cycles?: number;
    @Column() brita_counter?: number;
    @Column() washing_cycles?: number;

    @Column({type: "enum", enum: Object.keys(States)}) 
    state!: keyof typeof States;

    @Column({asExpression: /*sql*/`HLOOKUP('product__id', 'model')`}) 
    product_model!: string;
    @Column({asExpression: /*sql*/`HLOOKUP('product__id', 'product_group')`}) 
    product_group!: string;
    @Column({asExpression: /*sql*/`HLOOKUP('product__id', 'category')`}) 
    product_category!: string;

    @Column(() => Meta) meta: Meta;
}
