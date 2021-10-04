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

    @Column() selectPerm!: boolean | 'IS-OWNER';
    @Column() insertPerm!: boolean | 'IS-OWNER';
    @Column() updatePerm!: boolean | 'IS-OWNER';
    @Column() deletePerm!: boolean | 'IS-OWNER';

}

export interface PrwPermissionI extends PrwPermission {

}
