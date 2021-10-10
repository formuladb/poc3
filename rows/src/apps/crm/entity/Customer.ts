import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Meta } from "@core/entity/Meta";
import { PrwUser } from "@core/entity/PrwUser";

const States = {ACTIVE:0, INACTIVE:0};

@Entity()
export class Customer {
    @PrimaryColumn() id: string;

    @Column() group?: string;
    @Column() tag?: string;
    @Column() details?: string;

    @ManyToOne(() => PrwUser)
    user?: PrwUser;    

    @Column(() => Meta) meta: Meta;
}
