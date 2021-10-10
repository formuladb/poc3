import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";

const Operations = {EXIT:0, ENTRY:0, TRANSFER:0};

@Entity()
export class InventoryLevel {
    @PrimaryColumn({asExpression: `GENERATED(product_type)`}) id: string;

    @Column({asExpression: `ROLLUP('inventory_transaction_product', 'quantity', 'SUM', 'product_type_id, $$ EQ(operation, 'ENTRY') $$)`})
    entryStock: number;
    @Column({asExpression: `ROLLUP('inventory_transaction_product', 'quantity', 'SUM', 'product_type_id, $$ EQ(operation, 'EXIT') $$)`})
    exitStock: number;    
    @Column({asExpression: `entry_stock - exit_stock`})
    availableStock: number;
}
