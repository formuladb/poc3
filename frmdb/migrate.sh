set -ex

mkdir /tmp/upgrade.lock
trap 'rm -r /tmp/upgrade.lock' EXIT

until pg_isready -h db -p 5432 -t 1; do echo waiting for database; sleep 2; done;

fctH1() {
    echo "############################################################################"
    echo "## $1 "
    echo "############################################################################"    
}

fctH2() {
    echo "============================================================================"
    echo "== $1 "
    echo "============================================================================"
}

###################################################################################
###################################################################################
# Creating frmdb db
###################################################################################
###################################################################################

fctMigrate_frmdb() {
    fctH2 "Migrating frmdb on ${dbname} "

    dbname=$1
    for i in /frmdb/*/*.sql; do 
        fctH2 "running $i on $dbname"
        psql -v ON_ERROR_STOP=1 -e -h db -U postgres -d "$dbname" -f $i
    done
    fctH2 "SUCCESS migrate frmdb on ${dbname} "
}

fctCreate_frmdb_db() {
    psql -h db -U postgres -c 'DROP DATABASE frmdb' || true
    psql -v ON_ERROR_STOP=1 -h db -U postgres -c 'CREATE DATABASE frmdb'
    fctMigrate_frmdb frmdb
}

###################################################################################
###################################################################################
# Creating bak db
###################################################################################
###################################################################################

fctCreate_bak_db() {
    until psql -h db -U postgres -lqt | cut -d \| -f 1 | grep -qw bak; do 
        psql -h db -U postgres -c 'DROP DATABASE bak' || true
        psql -v ON_ERROR_STOP=1 -h db -U postgres -c 'CREATE DATABASE bak WITH TEMPLATE frmdb'
        sleep 2; 
    done

    if [ -d "/deploy/00_pg_dump.dir" ]; then
        time pg_restore -j3 -h db -U postgres -d bak --clean -Fd /deploy/00_pg_dump.dir || true
    elif [ -f "/deploy/00_pg_dump.sql.gz" ]; then
        zcat /deploy/00_pg_dump.sql.gz | time psql -h db -U postgres -d bak
    fi
}

###################################################################################
###################################################################################
# deploy resources
###################################################################################
###################################################################################

fctMigrate_resources() {
    dbname=$1

    fctH2 "Migrating resources on ${dbname} "
    
    for i in /deploy/apps-resources/*.sql; do 
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

    fctH2 "SUCCESS migrate resources on ${dbname} "
}

fctCreate_test_db() {
    psql -h db -U postgres -c 'DROP DATABASE test' || true
    psql -v ON_ERROR_STOP=1 -h db -U postgres -c 'CREATE DATABASE test WITH TEMPLATE frmdb'
    fctMigrate_resources test
}

fctCreate_dev_db() {
    psql -h db -U postgres -c 'DROP DATABASE dev' || true
    psql -v ON_ERROR_STOP=1 -h db -U postgres -c 'CREATE DATABASE dev WITH TEMPLATE bak'
    fctMigrate_resources dev
}

fctMigrate_postgres_db() {
    fctMigrate_frmdb postgres
    fctMigrate_resources postgres
}

###################################################################################
###################################################################################
# deploy pages
###################################################################################
###################################################################################

fctLoadPages() {
    dbname=$1
    for i in /deploy/apps-pages/*.json; do 
        id=`basename $i | sed -e 's/.json$//'`
        content=`cat $i | sed -e "s/\n/ /g; s/'/''/g;"`
        psql -v ON_ERROR_STOP=1 -e -h db -U postgres -d $dbname -c \
            "INSERT INTO frmdb_pages (id, content) VALUES ('${id}', '${content}') 
                ON CONFLICT(id) DO UPDATE SET content = EXCLUDED.content"
    done
}

###################################################################################
###################################################################################
# migrate
###################################################################################
###################################################################################


fctLoadPages postgres
