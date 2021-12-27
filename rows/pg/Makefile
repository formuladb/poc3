all: $(shell ls *sql|sed -e 's/.sql/.log/g')

schema.log:
	psql -P pager=off -v ON_ERROR_STOP=1 -e -h db -U postgres -d "postgres" \
		-c "CREATE SCHEMA IF NOT EXISTS $$PG_SCHEMA; GRANT ALL ON SCHEMA $$PG_SCHEMA TO postgres;"

%.log: %.sql $(shell ls -F *.sql | grep -B1000 $< | grep -v $<) schema.log
	@(psql -P pager=off -v ON_ERROR_STOP=1 -e -h db -U postgres -d "postgres" \
		-c "SET search_path TO $$PG_SCHEMA;" \
		-f $< >$@ 2>&1) || (cat $@; exit 1)
