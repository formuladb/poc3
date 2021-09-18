set -ex

dbname=postgres
ls -1 /pg/*/*.sql | egrep -v 'EXTENDS|MANY_TO_MANY|GENERATED' | while read i; do 
    echo "## running $i on $dbname ##################################"
    psql -v ON_ERROR_STOP=1 -e -h db -U postgres -d "$dbname" -f $i
done
