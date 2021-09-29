for i in CInputProps CPageProps CListProps CFormProps CLayoutProps CDesignBlock PageNode
do 
    echo "Generating $i.json"
    time npx typescript-json-schema --validationKeywords=default --required --strictNullChecks --noExtraProps src/core/entity/page.ts $i > src/core-domain/json-schemas/$i.json &
done
wait
