import { Column, Entity, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { Meta } from "@core/entity/Meta";
import { PrwUser } from "@core/entity/PrwUser";
import { InventoryTransaction } from "./InventoryTransaction";

const States = {ACTIVE:0, INACTIVE:0};

@Entity()
export class Supplier {
    @PrimaryColumn() id: string;

    @ManyToOne(() => PrwUser)
    user?: PrwUser;    

    @Column(() => Meta) meta: Meta;
}

@Entity()
export class SupplierBill {
    @PrimaryColumn() id: string;

    @ManyToOne(() => Supplier)
    supplier?: Supplier;    

    //TODO set operation to ENTRY
    @OneToOne(() => InventoryTransaction)
    inventoryTransaction: InventoryTransaction;

    @Column(() => Meta) meta: Meta;
}
