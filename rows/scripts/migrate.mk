CORE_SQL_DEPS = $(shell sh -c "echo /core/*/*.sql | sed -e 's!.sql!.sql!; s!^!/tmp/prwmk-!; s!/!--!'")

all: core test bak dev live
	@echo "== all done =="

clean:
	rm /tmp/prwmk-*

core: /tmp/prwmk-core
/tmp/prwmk-core: $(shell sh -c "echo /core/*/*.sql")
	bash /scripts/migrate_frmdb_db.sh | tee /tmp/prwmk-core

bak: /tmp/prwmk-bak
/tmp/prwmk-bak: $(wildcard /bak-db/pg_dump.sql.gz)
	bash /scripts/migrate_bak_db.sh | tee /tmp/prwmk-bak

test: core /tmp/prwmk-test
/tmp/prwmk-test: $(SQL_FILES)
	bash /scripts/migrate_test_db.sh | tee /tmp/prwmk-test

dev: core bak $(shell sh -c "find /tenants/default -maxdepth 1 -mindepth 1 -type d  | sed -e 's#/#--#g; s#^#/tmp/prwmk-dev#'")
/tmp/prwmk-dev--tenants--default--%: /tenants/default/% $(shell sh -c "echo /tenants/default/%/*")
	bash /scripts/migrate_dev_db.sh default $* | tee $@

live: core $(shell sh -c "find /tenants/default -maxdepth 1 -mindepth 1 -type d  | sed -e 's#/#--#g; s#^#/tmp/prwmk-live#'")
/tmp/prwmk-live--tenants--default--%: /tenants/default/% $(shell sh -c "echo /tenants/default/%/*")
	bash /scripts/migrate_postgres_db.sh default $* | tee $@
