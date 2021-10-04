import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({name: "prw_users"})
export class PrwUser {

    @PrimaryGeneratedColumn()
    id!: string;

    /**@TJS-format tbd-prw */
    @Column({ nullable: false })
    username!: string;

    @Column()
    pass!: string;

    @Column()
    role!: string;

}

export interface FrmdbUserI extends PrwUser {

}
