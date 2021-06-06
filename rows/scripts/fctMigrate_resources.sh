
fctMigrate_resources() {
    dbname=$1

    fctH2 "Migrating resources on ${dbname} "
    
    fctH1 "Loaging pages on ${dbname} "
    for tenant in /tenants/*; do
        fctH2 "Loaging resources for tentant ${tenant} on ${dbname}"
        shopt -s nullglob
        for i in $tenant/*/*.sql; do 
            export PGOPTIONS=--search_path=
            if [[ $i = *.test.sql ]]; then
                if [ "$dbname" = "test" -o "$dbname" = "dev" ]; then
                    fctH2 "$dbname:$i"
                    time psql -v ON_ERROR_STOP=1 -e -h db -U postgres -d $dbname
                else
                    echo "Skipping test file $i on $dbname";
                fi
            elif [[ $i = *.data.sql ]]; then
                if [ "$dbname" = "dev" ]; then
                    fctH2 "$dbname:$i"
                    time psql -v ON_ERROR_STOP=1 -e -h db -U postgres -d $dbname
                else
                    echo "Skipping data file $i on $dbname";
                fi
            else
                fctH2 "$dbname:$i"
                time psql -v ON_ERROR_STOP=1 -e -h db -U postgres -d $dbname
            fi
        done
        fctH2 "SUCCESS migrate resources for tentant ${tenant} on ${dbname} "
    done

    fctH2 "SUCCESS migrate resources on ${dbname} "
}