import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class FrmdbUser {

    @PrimaryGeneratedColumn()
    id!: string;

    /**@TJS-format tbd-prw */
    @Column({ nullable: false })
    username!: string;

    @Column()
    pass!: string;

    @Column()
    role!: number;

}

export interface FrmdbUserI extends FrmdbUser {

}
