import { Column } from "typeorm";
export class Meta {
    @Column() tenant!: string;
    @Column() metaCreatedAt?: Date;
    @Column() metaCreatedBy?: string;
    @Column() metaCpdatedAt?: Date;
    @Column() metaCpdatedBy?: string;
}
