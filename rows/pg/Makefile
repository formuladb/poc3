all: $(shell ls *sql|sed -e 's/.sql/.log/g')

%.log: %.sql $(shell ls -F *.sql | grep -B1000 $< | grep -v $<)
	@(psql -P pager=off -v ON_ERROR_STOP=1 -e -h db -U postgres -d "postgres" -f $< >$@ 2>&1) || (cat $@; exit 1)
