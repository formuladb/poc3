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
    const mng = getManager();

    let tableArg = '';
    let funcName = 'frmdb_set_permission_on_all_tables';
    if ("ALL-TABLES" !== entity) {
        const m = conn.getMetadata(entity);
        tableArg = `'${m.tableName}',`;
        funcName = 'frmdb_set_permission';
    }

    await mng.query(`SELECT ${funcName}(
        '${role}',
        ${tableArg}
        '${selectPerm === "IS-OWNER" ? `frmdb_is_owner(username)` : selectPerm + ''}',
        '${insertPerm === "IS-OWNER" ? `frmdb_is_owner(username)` : insertPerm + ''}',
        '${updatePerm === "IS-OWNER" ? `frmdb_is_owner(username)` : updatePerm + ''}',
        '${deletePerm === "IS-OWNER" ? `frmdb_is_owner(username)` : deletePerm + ''}'
    );`)    
}
