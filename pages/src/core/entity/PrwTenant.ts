import {Entity, Column, PrimaryColumn, OneToMany} from "typeorm";

@Entity({name: "prw_tenants"})
export class PrwTenant {
    @PrimaryColumn() id!: string;
    @PrimaryColumn() domainName!: string;
}

export interface PrwTenantI extends PrwTenant {}
