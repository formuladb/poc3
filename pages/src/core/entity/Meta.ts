import { Column, PrimaryColumn } from "typeorm";
export class Meta {
    @Column() createdAt?: Date;
    @Column() createdBy?: string;
    @Column() updatedAt?: Date;
    @Column() updatedBy?: string;
}
