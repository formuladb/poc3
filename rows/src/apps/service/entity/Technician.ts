import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Meta } from "@core/entity/Meta";
import { PrwUser } from "@core/entity/PrwUser";

@Entity()
export class Technician {
    @PrimaryColumn() id: string;

    @ManyToOne(() => PrwUser)
    user?: PrwUser;    

    @Column(() => Meta) meta: Meta;
}
