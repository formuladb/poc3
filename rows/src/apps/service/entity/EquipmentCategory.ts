import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";


@Entity()
export class EquipmentCategory {
    @PrimaryColumn({asExpression: /*sql*/`
        CREATE OR REPLACE VIEW equipment_category 
            AS SELECT DISTINCT product_category as id from equipment;
    `})
    id: string;
}
