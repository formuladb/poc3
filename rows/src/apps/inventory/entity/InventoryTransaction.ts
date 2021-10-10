import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";

const Operations = {EXIT:0, ENTRY:0, TRANSFER:0};

@Entity()
export class InventoryTransaction {
    @PrimaryColumn() id: string;

    @Column({type: "enum", enum: Object.keys(Operations)}) 
    operation!: keyof typeof Operations;

}
