import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { PrwRole } from "./PrwRole";

@Entity({name: "prw_users"})
export class PrwUser {

    @PrimaryGeneratedColumn()
    id!: string;

    /**@TJS-format tbd-prw */
    @Column({ nullable: false })
    username!: string;

    @Column()
    pass!: string;

    @ManyToOne(() => PrwRole )
    prwRole!: PrwRole; 
}

export interface FrmdbUserI extends PrwUser {

}
