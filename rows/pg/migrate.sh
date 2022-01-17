set -ex

SCHEMA=$1
shift

_findLatestFile() {
    if [ ! -d "$1" -a ! -f "$1" ]; then fctErr "$1 not found!"; fi
    find "$1" -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -f2- -d" "
}
_isNewer() {
    file1=`_findLatestFile $1`
    file2=`_findLatestFile $2`
    if [ ! -f "$file1" ]; then fctErr "file1 $file1 not found"; fi
    if [ ! -f "$file2" ]; then fctErr "file1 $file2 not found"; fi
    [[ "$file1" -nt "$file2" ]]
}

clean() {
	if [ -z "${SCHEMA}" ]; then echo "SCHEMA not defined"; exit 1; fi
	rm -rf ${SCHEMA}.log /tenants/logs/${SCHEMA}
}


schema() {
	if [ -z "${SCHEMA}" ]; then echo "SCHEMA not defined"; exit 1; fi
	if [ ! -f "${SCHEMA}.log" ] || _isNewer "dependencies/cnf" "$chartTgz"; then
		mkdir -p /tenants/logs/${SCHEMA}
		psql -P pager=off -v ON_ERROR_STOP=1 -e -h db -U postgres -d "postgres" \
			-c "CREATE SCHEMA IF NOT EXISTS exts; CREATE SCHEMA IF NOT EXISTS ${SCHEMA}; GRANT ALL ON SCHEMA ${SCHEMA} TO postgres;" > ${SCHEMA}.log 2>&1
    fi
}

runFile() {
	sqlFile=$1
	if [ ! -f "$sqlFile" ]; then echo "$sqlFile not found"; exit 1; fi
	logFile=/tenants/logs/${SCHEMA}/$1.log
	if [ ! -f "$logFile" ] || _isNewer "$sqlFile" "$logFile"; then
        psql -P pager=off -v ON_ERROR_STOP=1 -e -h db -U postgres -d "postgres" \
		-c "SET search_path TO ${SCHEMA},exts;" \
		-f "$sqlFile" > "$logFile" 2>&1
    fi
}

files() {
	for i in *sql; do
		runFile "$i"
	done
}

schema
files
