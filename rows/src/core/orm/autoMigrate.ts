import { Connection, getManager, ObjectType } from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";

function getColType(type: ColumnMetadata['type']): string {
    if (type === String) return 'text';
    if (type === Number) return 'integer';//TODO precision/length/etc
    if (type === Boolean) return 'boolean';
    if (type === 'enum') return 'text';
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

    await mng.query(`SELECT frmdb_put_table('${m.tableName}', '${getColType(idM.type)}')`);
    for (let colM of m.columns) {
        if (colM.databaseName === 'id') continue;

        const constraintsList: string[] = [];
        if (colM.isNullable) {
            constraintsList.push(`is_not_null(${colM.databaseName})`);
        }
        if (colM.type === "enum") {
            constraintsList.push(`is_enum(${colM.databaseName}, ${colM.enum.map(e => "''"+e+"''").join(', ')})`);
        }
        const constraints = constraintsList.length === 1 ? constraintsList[0] : (
            constraintsList.length > 1 ? `_and(${constraintsList.join(', ')})` : 'null'
        );
            

        await mng.query(`SELECT frmdb_put_column(
            '${m.tableName}', 
            '${colM.databaseName}', 
            '${getColType(colM.type)}', 
            '${constraints}', 
            null
        );`)
    }
    
    return entity;
}
