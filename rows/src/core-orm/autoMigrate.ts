import { PrwTable } from "@core/entity/PrwTable";
import { PrwTableColumn } from "@core/entity/PrwTableColumn";
import { Connection, getConnection, getManager, ObjectType } from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";
import { putRow } from "./putRow";

function getColType(type: ColumnMetadata['type']): string {
    if (type === String) return 'text';
    if (type === Number) return 'integer';//TODO precision/length/etc
    if (type === Boolean) return 'boolean';
    if (type === Date) return 'timestamp';
    if (type === 'enum') return 'text';
    return type as string;
}

export async function autoMigrate<ENTITY>(
    entity: ObjectType<ENTITY>
): Promise<ObjectType<ENTITY>> {
    
    const conn = getConnection();
    const m = conn.getMetadata(entity);

    const mng = getManager();
    await mng.query(`set log_min_messages = notice`);

    const idM = m.columns.find(c => c.databaseName === 'id');
    if (!idM) throw new Error(`Cannot find id column for table ${m.tableName}`);

    const defVal = idM.default ? 'DEFAULT ' + idM.default : '';
    let tbl = new PrwTable();
    tbl.id = m.tableName;
    tbl.idType = `${getColType(idM.type)} NOT NULL ${defVal}`;
    await putRow(PrwTable, tbl);

    for (let colM of m.columns) {
        if (colM.databaseName === 'id' || colM.databaseName.startsWith('meta_')) continue;

        const constraintsList: string[] = [];
        if (!colM.isNullable) {
            constraintsList.push(`is_not_null(${colM.databaseName})`);
        }
        if (colM.type === "enum") {
            constraintsList.push(`is_enum(${colM.databaseName}, ${colM.enum.map(e => "''"+e+"''").join(', ')})`);
        }
        const check = m.checks.find(c => c.name === colM.propertyName);
        if (check) {
            constraintsList.push(check.expression);
        }
        const constraints = constraintsList.length === 1 ? constraintsList[0] : (
            constraintsList.length > 1 ? `_and(${constraintsList.join(', ')})` : 'null'
        );
            
        let col = new PrwTableColumn();
        col.prwTable = tbl;
        col.c_column_name = colM.databaseName;
        col.c_data_type = getColType(colM.type);
        col.c_check = constraints;
        if (colM.default) col.c_default = `${colM.default}`;
        if (colM.asExpression) col.c_formula = `${colM.asExpression}`;
        await putRow(PrwTableColumn, col);
    }
    
    return entity;
}
