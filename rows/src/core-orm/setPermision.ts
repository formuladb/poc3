import { Connection, getConnection, getManager, ObjectType } from "typeorm";

export async function setPermission<ENTITY>(
    role: string,
    entity: 'ALL-TABLES' | ObjectType<ENTITY>,
    selectPerm: boolean | 'IS-OWNER',
    insertPerm: boolean | 'IS-OWNER',
    updatePerm: boolean | 'IS-OWNER',
    deletePerm: boolean | 'IS-OWNER',
): Promise<void> {
    
    const conn = getConnection();
    const m = conn.getMetadata(entity);
    const mng = getManager();

    await mng.query(`SELECT ${"ALL-TABLES" === entity ? 'frmdb_set_permission_on_all_tables' : 'frmdb_set_permission'}(
        '${role}',
        ${"ALL-TABLES" === entity ? `'${m.tableName}',` : ''}
        '${selectPerm === "IS-OWNER" ? `frmdb_is_owner(username)` : selectPerm + ''}',
        '${insertPerm === "IS-OWNER" ? `frmdb_is_owner(username)` : insertPerm + ''}',
        '${updatePerm === "IS-OWNER" ? `frmdb_is_owner(username)` : updatePerm + ''}',
        '${deletePerm === "IS-OWNER" ? `frmdb_is_owner(username)` : deletePerm + ''}'
    );`)    
}
