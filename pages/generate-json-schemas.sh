for i in CInputProps CPageProps CListProps CFormProps CPaperProps CRowProps CTextProps PageNode
do 
    echo "Generating $i.json"
    time npx typescript-json-schema --required --strictNullChecks --noExtraProps src/core-domain/page.ts $i > src/core-domain/json-schemas/$i.json &
done
wait
