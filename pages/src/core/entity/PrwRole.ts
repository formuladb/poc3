import {Entity, Column, PrimaryColumn, OneToMany} from "typeorm";
import { PrwPermission } from "./PrwPermission";

@Entity({name: "prw_roles"})
export class PrwRole {
    @PrimaryColumn()
    id!: string;

    @OneToMany(() => PrwPermission, perm => perm.prwTable)
    permissions?: PrwPermission[];
}

export interface PrwRoleI extends PrwRole {}
