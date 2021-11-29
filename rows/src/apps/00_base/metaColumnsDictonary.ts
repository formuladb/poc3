export function metaColumnsDictionary(tblName: string) {
    return [
        { id: `resources.${tblName}.fields.meta_created_at`, en: 'Created At', ro: 'Data Creare' },
        { id: `resources.${tblName}.fields.meta_created_by`, en: 'Created By', ro: 'Creat De' },
        { id: `resources.${tblName}.fields.meta_updated_at`, en: 'Updated At', ro: 'Data Modificare' },
        { id: `resources.${tblName}.fields.meta_updated_by`, en: 'Updated By', ro: 'Modificat De' },
    ];
}