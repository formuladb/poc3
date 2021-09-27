import { Entity, Column, PrimaryColumn, ManyToOne } from "typeorm";
import { FrmdbResource } from "./FrmdbResource";

@Entity({name: "frmdb_resources_fields"})
export class FrmdbResourceField {
    @PrimaryColumn() id!: string;

    @Column() c_table_schema!: string;
    @Column() c_column_name!: string;
    @Column() c_data_type!: string;
    @Column() c_check!: string;
    @Column() c_default!: string;
    @Column() c_column_description!: string;
    @Column() c_is_updatable!: string;
    @Column() c_reference_to!: string;
    @Column() c_formula!: string;
    @Column() c_idx!: string;

    @ManyToOne(() => FrmdbResource, resource => resource.fields, )
    resource!: FrmdbResource;    
};
