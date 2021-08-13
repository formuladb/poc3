import { Connection, getManager, ObjectType } from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";

function getColType(type: ColumnMetadata['type']): string {
    if (type === String) return 'text';
    if (type === Number) return 'integer';//TODO precision/length/etc
    if (type === Boolean) return 'boolean';//TODO precision/length/etc
    return type as string;
}

export async function autoMigrate<ENTITY>(
    conn: Connection,
    entity: ObjectType<ENTITY>
): Promise<ObjectType<ENTITY>> {
    
    const m = conn.getMetadata(entity);

    const mng = getManager();

    const idM = m.columns.find(c => c.databaseName === 'id');
    if (!idM) throw new Error(`Cannot find id column for table ${m.tableName}`);

    mng.query(`SELECT frmdb_put_table('${m.tableName}', '${getColType(idM.type)}')`);
    for (let colM of m.columns) {
        if (colM.databaseName === 'id') continue;

        mng.query(`SELECT frmdb_put_column(
            '${m.tableName}', 
            '${colM.databaseName}', 
            '${getColType(colM.type)}', 
            ${colM.isNullable ? `'is_not_null(${colM.databaseName})'` : 'null' }, 
            null
        );`)
    }
    
    return entity;
}
