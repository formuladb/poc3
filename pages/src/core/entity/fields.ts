export const FieldTypes = {
    TextField: 'TextField',
    BooleanField: 'BooleanField',
    ChipField: 'ChipField',
    DateField: 'DateField',
    DateTimeField: 'DateTimeField',
    EmailField: 'EmailField',
    ImageField: 'ImageField',
    FileField: 'FileField',
    NumberField: 'NumberField',
    RichTextField: 'RichTextField',
    UrlField: 'UrlField',
    IntervalField: 'IntervalField',
    Json: 'Json',
}
type tFieldTypes = typeof FieldTypes;
export type FieldType = keyof tFieldTypes;

export interface ResourceFieldDef {
    c_table_schema?: string, //1
    c_table_name: string, //2
    name: string, //3
    c_check?: string, //5
    c_default?: string, //6
    c_column_description?: string, //7
    c_is_computed: boolean, //8
    c_reference_to?: string, //9
    c_formula?: string,//10
    
    type: FieldType,
}

export const DEFAULT_COLS = ['meta_created_at', 'meta_updated_at', 'meta_created_by', 'meta_updated_by'];
export const DEFAULT_FILTER_COLS = ['name', 'description'];
export const DEFAULT_FILTER_TREE_COLS = ['category'];
