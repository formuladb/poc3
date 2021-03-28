import { ResourceFieldDef, FieldType } from "../core-domain/fields";

interface SpOut {
    c_table_schema: any; // varchar,                --1
    c_table_name: any; // regclass,                 --2
    c_column_name: any; // varchar,                 --3
    c_data_type: any; // varchar,                   --4
    c_check: any; // varchar,                       --5
    c_default: any; // varchar,                     --6
    c_column_description: any; // varchar,          --7
    c_is_updatable: any; // boolean,                --8
    c_reference_to: any; // varchar,                --9
    c_formula: any; // varchar,                     --10
    c_idx: any; // integer                          --11
}

function getDataType(colName: string, colType: string): FieldType {
    if (colType.match(/(char|text)/i)) {
        if (colName.indexOf("image") >= 0) {
            return "ImageField";
        } else return "TextField";
    }
    if (colType.match(/(integer|numeric|bigint|double precision)/)) return "NumberField";
    if (colType.match(/(date|timestamp)/)) return "DateTimeField";
    if (colType.match(/(interval)/)) return "IntervalField";
    if (colType.match(/(boolean)/)) return "BooleanField";
    if (colType.match(/(USER-DEFINE|regrole|regclass)/)) return "TextField";
    if (colType.match(/(json)/)) return "Json";
    throw new Error(`Found table column with unknown type: ${colType}`);
}

// const Cache = {} as {[p_table_name: string]: ResourceFieldDef[]};
export async function frmdb_sp_table_columns(p_table_name: string): Promise<ResourceFieldDef[]> {
    let res = await fetch(`/fdb-resources/rpc/frmdb_sp_table_columns?p_table_name=${p_table_name}`)
        .then(response => response.json());
    return res.map((col: SpOut) => {
        let retCol: ResourceFieldDef = {
            name: col.c_column_name,
            type: getDataType(col.c_column_name, col.c_data_type),
            c_table_schema: col.c_table_schema,
            c_table_name: col.c_table_name,
            c_check: col.c_check,
            c_default: col.c_default,
            c_column_description: col.c_column_description,
            c_is_computed: (!col.c_is_updatable)
                || (col.c_formula && col.c_formula.indexOf('EXECUTE FUNCTION ') < 0)
                || (col.c_formula && col.c_formula.indexOf('EXECUTE FUNCTION ') >= 0
                    && col.c_formula.match(/hlookup|rollup/i))
            ,
            c_formula: col.c_formula,
            c_reference_to: col.c_reference_to,
        }

        return retCol;
    });
}
