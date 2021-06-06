
fctMigrate_pages() {
    dbname=$1
    fctH1 "Loading pages on ${dbname} "
    for tenant in /tenants/*; do
        fctH2 "Loading pages for tentant ${tenant} on ${dbname}"
        shopt -s nullglob
        for i in $tenant/*/*.json; do 
            id=`basename $i | sed -e 's/.json$//'`
            content=`cat $i | sed -e "s/\n/ /g; s/'/''/g;"`
            psql -v ON_ERROR_STOP=1 -e -h db -U postgres -d $dbname -c \
                "INSERT INTO frmdb_pages (id, content) VALUES ('${id}', '${content}') 
                    ON CONFLICT(id) DO UPDATE SET content = EXCLUDED.content"
        done
        fctH2 "Succesfully loaded pages for tentant ${tenant} on ${dbname} "
    done
    fctH1 "Succesfully loaded pages on ${dbname} "
}