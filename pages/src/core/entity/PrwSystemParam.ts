import {Entity, Column, PrimaryColumn} from "typeorm";

@Entity({name: "prw_system_params"})
export class FrmdbSystemParam {
    @PrimaryColumn() id!: string;
    @Column() val!: string;
}

export  interface FrmdbSystemParamI extends FrmdbSystemParam {
    
}
export const LOCALE = 'LOCALE';
