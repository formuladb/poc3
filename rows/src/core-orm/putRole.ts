import { Connection, getConnection, getManager, ObjectType } from "typeorm";

export async function putRole<ENTITY>(
    role: string
): Promise<void> {
    
    const conn = getConnection();
    const mng = getManager();

    await mng.query(`SELECT frmdb_create_role('${role}')`);
}
