
fctMigrate_pages() {
    dbname=$1
    tenant=$2
    app=$3

    fctH1 "Loading pages on ${dbname}/${tenant}/${app}"
    shopt -s nullglob
    for i in $tenant/*/*.json; do 
        id=`basename $i | sed -e 's/.json$//'`
        content=`cat $i | sed -e "s/\n/ /g; s/'/''/g;"`
        psql -v ON_ERROR_STOP=1 -e -h db -U postgres -d $dbname -c \
            "INSERT INTO prw_pages (id, content) VALUES ('${id}', '${content}') 
                ON CONFLICT(id) DO UPDATE SET content = EXCLUDED.content"
    done
    fctH1 "Succesfully loaded pages on ${dbname}/${tenant}/${app} "
}
