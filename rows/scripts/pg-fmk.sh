set -ex

dbname=postgres
for i in /pg/*/*.sql; do 
    echo "## running $i on $dbname ##################################"
    psql -v ON_ERROR_STOP=1 -e -h db -U postgres -d "$dbname" -f $i
done
