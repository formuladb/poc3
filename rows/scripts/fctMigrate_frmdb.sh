fctMigrate_frmdb() {
    dbname=$1
    fctH2 "Migrating frmdb on ${dbname} "

    dbname=$1
    for i in /core/*/*.sql; do 
        fctH2 "running $i on $dbname"
        psql -v ON_ERROR_STOP=1 -e -h db -U postgres -d "$dbname" -f $i
    done
    fctH2 "SUCCESS migrate frmdb on ${dbname} "
}
