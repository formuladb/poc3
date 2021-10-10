import { Check, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { ProductType } from "../../inventory/entity/ProductType";
import { Technician } from "./Technician";

const Operations = {EXIT:0, ENTRY:0};

@Entity()
export class TravelForm {
    @PrimaryColumn() id: string;

    @Column({type: "enum", enum: Object.keys(Operations)}) 
    operation!: keyof typeof Operations;

    @ManyToOne(() => Technician)
    technician: Technician;
}


@Entity()
export class TravelFormProduct {
    @PrimaryColumn({asExpression: `PKEY(inventory_transaction_id, product_type_id)`}) 
    id: string;

    @ManyToOne(() => TravelForm)
    TravelForm: TravelForm;

    @ManyToOne(() => ProductType)
    productType: ProductType;

    @Check('quantity', `_and(is_not_null(quantity), gte(quantity,0))`)
    @Column() quantity: number;
    @Column() quantity_error: number;
    @Column() client_stock: number;

    @Column() name: string;
    @Column() price: number;
    @Column() currency_code: string;
    @Column() entry_stock: number;
    @Column() output_stock: number;
    @Column() imported_stock: number;
}

@Entity()
export class TravelFormLevels {
    @PrimaryColumn({asExpression: `GENERATED('travel_form_product', 'technician_id', 'product_type_id')`}) id: string;

    @Column({asExpression: `ROLLUP('travel_form_product', 'quantity', 'SUM', 'product_type_id, $$ EQ(operation, 'ENTRY') $$)`})
    entryStock: number;
    @Column({asExpression: `ROLLUP('travel_form_product', 'quantity', 'SUM', 'product_type_id, $$ EQ(operation, 'EXIT') $$)`})
    exitStock: number;    
    @Column({asExpression: `exit_stock - entry_stock`})
    stockInTravel: number;
}
