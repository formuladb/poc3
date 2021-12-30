set -ex 

fctGenJsonSchema() {
    set +x
    tsFile=$1
    typeName=$2
    destFolder=$3
    time npx typescript-json-schema --validationKeywords=default --required --strictNullChecks --noExtraProps "$tsFile" "$typeName"
}

for i in CInputProps CPageProps CListProps CFormProps CLayoutProps CBlockProps CElementProps PageNode
do 
    time npx typescript-json-schema --validationKeywords=default --required --strictNullChecks --noExtraProps src/core/entity/page.ts $i > src/core-domain/json-schemas/$i.json &
done
wait

time npx typescript-json-schema --validationKeywords=default --required --strictNullChecks --noExtraProps src/core/entity/PrwPermission.ts PrwPermissionI > public/schemas/prw_permission.json &
time npx typescript-json-schema --validationKeywords=default --required --strictNullChecks --noExtraProps src/core/entity/PrwDictionary.ts PrwDictionaryI > public/schemas/prw_dictionary.json &
time npx typescript-json-schema --validationKeywords=default --required --strictNullChecks --noExtraProps src/core/entity/PrwPage.ts PrwPageI > public/schemas/prw_page.json &
time npx typescript-json-schema --validationKeywords=default --required --strictNullChecks --noExtraProps src/core/entity/PrwRole.ts PrwRoleI > public/schemas/prw_role.json &
time npx typescript-json-schema --validationKeywords=default --required --strictNullChecks --noExtraProps src/core/entity/FrmdbSystemParam.ts FrmdbSystemParamI > public/schemas/frmdb_system_param.json &
time npx typescript-json-schema --validationKeywords=default --required --strictNullChecks --noExtraProps src/core/entity/PrwTable.ts PrwTableI > public/schemas/prw_table.json &
time npx typescript-json-schema --validationKeywords=default --required --strictNullChecks --noExtraProps src/core/entity/PrwTableColumn.ts PrwTableColumnI > public/schemas/prw_table_column.json &
time npx typescript-json-schema --validationKeywords=default --required --strictNullChecks --noExtraProps src/core/entity/PrwUser.ts PrwUserI > public/schemas/prw_user.json &
wait
