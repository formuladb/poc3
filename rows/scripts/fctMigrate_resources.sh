
fctMigrate_resources() {
    dbname=$1
    tenant=$2
    app=$3

    fctH2 "Migrating resources on ${dbname}/${tenant}/${app}"    
    shopt -s nullglob
    for i in $tenant/${app}/*.sql; do 
        # export PGOPTIONS=--search_path=
        if [[ $i = *.test.sql ]]; then
            if [ "$dbname" = "test" -o "$dbname" = "dev" ]; then
                fctH2 "$dbname:$i"
                time psql -v ON_ERROR_STOP=1 -e -h db -U postgres -d $dbname -f $i
            else
                echo "Skipping test file $i on $dbname";
            fi
        elif [[ $i = *.data.sql ]]; then
            if [ "$dbname" = "dev" ]; then
                fctH2 "$dbname:$i"
                time psql -v ON_ERROR_STOP=1 -e -h db -U postgres -d $dbname -f $i
            else
                echo "Skipping data file $i on $dbname";
            fi
        else
            fctH2 "$dbname:$i"
            time psql -v ON_ERROR_STOP=1 -e -h db -U postgres -d $dbname -f $i
        fi
    done

    fctH2 "SUCCESS migrate resources on ${dbname}/${tenant}/${app} "
}
