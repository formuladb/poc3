import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    /**@TJS-format tbd-prw */
    @Column({ nullable: false })
    firstName: string;

    @Column()
    lastName?: string;

    @Column()
    age?: number;

}

export interface UserI extends User {

}
