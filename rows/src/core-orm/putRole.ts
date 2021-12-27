import { Connection, ObjectType } from "typeorm";

export async function putRole<ENTITY>(
    conn: Connection,
    role: string
): Promise<void> {
    await conn.query(`SELECT frmdb_create_role('${role}')`);
}
