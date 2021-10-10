import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";


@Entity()
export class ProductCategory {
    @PrimaryColumn({asExpression: /*sql*/`
        CREATE OR REPLACE VIEW product_category 
            AS SELECT DISTINCT category AS id FROM product_type
    `})
    id: string;
}
