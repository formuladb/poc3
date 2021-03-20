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
fctH1 "Creating frmdb db"
###################################################################################
###################################################################################


psql -h db -U postgres -c 'DROP DATABASE frmdb' || true
psql -v ON_ERROR_STOP=1 -h db -U postgres -c 'CREATE DATABASE frmdb'

for i in /frmdb/*/*.sql; do 
    fctH2 "running $i on frmdb"
    psql -v ON_ERROR_STOP=1 -e -h db -U postgres -d frmdb -f $i
done
psql -v ON_ERROR_STOP=1 -e -h db -U postgres -d frmdb -c "INSERT INTO frmdb_done VALUES ('frmdb', NOW()) ON CONFLICT (id) DO SET last_run = now()"
fctH2 "frmdb done on frmdb db"

for i in /frmdb/*/*.sql; do 
    fctH2 "running $i on postgres"
    psql -v ON_ERROR_STOP=1 -e -h db -U postgres -d postgres -f $i
done
fctH2 "frmdb done on postgres db"

until psql -U postgres -h db -d frmdb -P pager=off  -c "select * from frmdb_done limit 0"; do echo "waiting for frmdb db"; sleep 2; done

until psql -h db -U postgres -lqt | cut -d \| -f 1 | grep -qw bak; do 
    psql -h db -U postgres -c 'DROP DATABASE bak' || true
    psql -v ON_ERROR_STOP=1 -h db -U postgres -c 'CREATE DATABASE bak WITH TEMPLATE frmdb'
    sleep 2; 
done

if [ -d "/00_pg_dump.dir" ]; then
    time pg_restore -j3 -h db -U postgres -d bak --clean -Fd /00_pg_dump.dir || true
elif [ -f "/00_pg_dump.sql.gz" ]; then
    zcat /00_pg_dump.sql.gz | time psql -h db -U postgres -d bak
fi

###################################################################################
###################################################################################
fctH1 "Creating bak db"
###################################################################################
###################################################################################

until psql -h db -U postgres -lqt | cut -d \| -f 1 | grep -qw bak; do 
    psql -h db -U postgres -c 'DROP DATABASE bak' || true
    psql -v ON_ERROR_STOP=1 -h db -U postgres -c 'CREATE DATABASE bak WITH TEMPLATE frmdb'
    sleep 2; 
done

if [ -d "/00_pg_dump.dir" ]; then
    time pg_restore -j3 -h db -U postgres -d bak --clean -Fd /00_pg_dump.dir || true
elif [ -f "/00_pg_dump.sql.gz" ]; then
    zcat /00_pg_dump.sql.gz | time psql -h db -U postgres -d bak
fi

psql -v ON_ERROR_STOP=1 -h db -U postgres -d bak -c 'CREATE TABLE IF NOT EXISTS frmdb_bak_done()'

###################################################################################
###################################################################################
fctH1 "deploy resources"
###################################################################################
###################################################################################



fctRunMigrations() {
    dbname=$1

    fctH1 "Migrating resources on ${dbname} "
    
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

    fctH1 "SUCCESS migration on ${dbname} "
}

psql -h db -U postgres -c 'DROP DATABASE test' || true
psql -v ON_ERROR_STOP=1 -h db -U postgres -c 'CREATE DATABASE test WITH TEMPLATE frmdb'
fctRunMigrations test

psql -h db -U postgres -c 'DROP DATABASE dev' || true
psql -v ON_ERROR_STOP=1 -h db -U postgres -c 'CREATE DATABASE dev WITH TEMPLATE bak'
fctRunMigrations dev

fctRunMigrations postgres


###################################################################################
###################################################################################
fctH1 "deploy pages"
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

fctH1 "Loading pages on postgres"
fctLoadPages postgres
