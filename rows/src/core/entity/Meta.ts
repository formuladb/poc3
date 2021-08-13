import { Column } from "typeorm";

export class Meta {
    @Column() tenant: string;
    @Column() createdAt?: Date;
    @Column() createdBy?: string;
    @Column() updatedAt?: Date;
    @Column() updatedBy?: string;
}
