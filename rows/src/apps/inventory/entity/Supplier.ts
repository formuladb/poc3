import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Meta } from "@core/entity/Meta";
import { PrwUser } from "@core/entity/PrwUser";

const States = {ACTIVE:0, INACTIVE:0};

@Entity()
export class Supplier {
    @PrimaryColumn() id: string;

    @ManyToOne(() => PrwUser)
    user?: PrwUser;    

    @Column(() => Meta) meta: Meta;
}
