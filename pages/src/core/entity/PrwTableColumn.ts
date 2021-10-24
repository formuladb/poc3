import { Entity, Column, PrimaryColumn, ManyToOne } from "typeorm";
import { PrwTable } from "./PrwTable";

@Entity({name: "prw_table_columns"})
export class PrwTableColumn {
    @PrimaryColumn() id!: string;

    @Column() c_table_schema!: string;
    @Column() c_column_name!: string;
    @Column() c_data_type!: string;
    @Column() c_check!: string;
    @Column() c_default!: string;
    @Column() c_column_description!: string;
    @Column() c_is_updatable!: string;
    @Column() c_formula!: string;
    @Column() c_idx!: string;

    @ManyToOne(() => PrwTable, resource => resource.columns, )
    prwTable!: PrwTable;    
};

export interface PrwTableColumnI extends PrwTableColumn {} 