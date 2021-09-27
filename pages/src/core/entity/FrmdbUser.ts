import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({name: "frmdb_users"})
export class FrmdbUser {

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

export interface FrmdbUserI extends FrmdbUser {

}
