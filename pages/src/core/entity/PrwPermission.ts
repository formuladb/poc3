import {Entity, Column, PrimaryColumn, ManyToOne} from "typeorm";
import { PrwRole } from "./PrwRole";
import { PrwTable } from "./PrwTable";

@Entity({name: "prw_permissions"})
export class PrwPermission {
    @PrimaryColumn()
    id!: string;

    @ManyToOne(() => PrwTable, resource => resource.pages, )
    prwTable!: PrwTable;    

    @ManyToOne(() => PrwRole, role => role.permissions, )
    prwRole!: PrwRole;    

    @Column() selectPerm!: "true" | "false" | 'IS-OWNER';
    @Column() insertPerm!: "true" | "false" | 'IS-OWNER';
    @Column() updatePerm!: "true" | "false" | 'IS-OWNER';
    @Column() deletePerm!: "true" | "false" | 'IS-OWNER';

}

export interface PrwPermissionI extends PrwPermission {

}
