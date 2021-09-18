-- Migration script in pure SQL.
-- This script is ran at server boot-up.
--

\set on_error_stop true

-- Migration temporary sequence.
--
create temporary sequence migration_steps;

-- Migrations table.
--
create table if not exists migrations (
	id integer primary key,
	meta_created_at timestamptz not null default now()
);

-- Migration procedure.
--
drop procedure migrate;

create procedure migrate(migration text) as $$
	declare
		step numeric := nextval('migration_steps');
	begin
		if exists(select 1 from migrations where id = step) then
			raise notice 'migrations: skipping step %', step;
		else
			raise notice 'migrations: running step %', step;
			execute migration;
			insert into migrations (id) values (step);
		end if;
	end;
$$ language plpgsql;

-- Migration steps.
--

-- 1
call migrate($$
	create table sample (
		id serial primary key,
		meta_created_at timestamptz not null default now(),
		name text
	);
$$);

-- 2
call migrate($$
	alter table sample rename column name to title;
$$);

-- 3
-- ...