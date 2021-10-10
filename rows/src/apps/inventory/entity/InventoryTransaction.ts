import { Check, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { ProductType } from "./ProductType";

const Operations = {EXIT:0, ENTRY:0, TRANSFER:0};

@Entity()
export class InventoryTransaction {
    @PrimaryColumn() id: string;

    @Column({type: "enum", enum: Object.keys(Operations)}) 
    operation!: keyof typeof Operations;

}


@Entity()
export class InventoryTransactionProduct {
    @PrimaryColumn({asExpression: `PKEY(inventory_transaction_id, product_type_id)`}) 
    id: string;

    @ManyToOne(() => InventoryTransaction)
    inventoryTransaction: InventoryTransaction;

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
