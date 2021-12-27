import { Connection, ObjectType } from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";

function getColType(type: ColumnMetadata['type']): string {
    if (type === String) return 'text';
    if (type === Number) return 'integer';//TODO precision/length/etc
    if (type === Boolean) return 'boolean';
    if (type === 'enum') return 'text';
    return type as string;
}

export function columnMetadata<ENTITY>(
    conn: Connection,
    entity: ObjectType<ENTITY>,
    colName: keyof ENTITY
): ColumnMetadata {
    const m = conn.getMetadata(entity);

    return m.columns.find(c => c.databaseName === colName);
}
