import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Meta } from "@core/entity/Meta";
import { Currency } from "../../00_base/entity/Currency";

const States = {ACTIVE:0, INACTIVE:0};

@Entity()
export class ProductType {
    @PrimaryColumn() id: number;

    @Column() name: string;
    @Column() price: number;

    @ManyToOne(() => Currency)
    currency: Currency;

    @Column({default: "ALTELE"}) category: string;
    @Column() barcode: string;
    @Column() external_code: string;
    @Column() description: string;
    @Column() supplier_code: string;
    @Column() image: string;
    @Column() user_manual: string;
    @Column() techical_manual: string;
    
    @Column({type: "enum", enum: Object.keys(States)}) 
    state!: keyof typeof States;

    @Column({default: "MODEL-INEXISTENT"}) model: string;
    @Column() external_name: string;
    @Column() external_description: string;
    @Column() inventory_location: string;
    @Column() product_group: string;

    @Column(() => Meta) meta: Meta;
}
