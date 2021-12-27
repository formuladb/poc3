all: $(shell ls *sql|sed -e 's!^!/tenants/logs/$(SCHEMA)/!; s!.sql$$!.log!')

$(SCHEMA).log:
	mkdir -p /tenants/logs/$(SCHEMA)
	psql -P pager=off -v ON_ERROR_STOP=1 -e -h db -U postgres -d "postgres" \
		-c "CREATE SCHEMA IF NOT EXISTS $(SCHEMA); GRANT ALL ON SCHEMA $(SCHEMA) TO postgres;" > $(SCHEMA).log 2>&1

/tenants/logs/$(SCHEMA)/%.log: %.sql $(shell ls -F *.sql | grep -B1000 $< | grep -v $<) $(SCHEMA).log
	@(psql -P pager=off -v ON_ERROR_STOP=1 -e -h db -U postgres -d "postgres" \
		-c "SET search_path TO $(SCHEMA);" \
		-f $< >$@ 2>&1) || (cat $@; exit 1)
