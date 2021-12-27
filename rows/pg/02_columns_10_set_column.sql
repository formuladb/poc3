--####################################################################################
DO $migration$
BEGIN
    -- BEGIN
    -- 	EXECUTE $$ DROP FUNCTION frmdb_put_table $$;
    -- EXCEPTION WHEN OTHERS THEN raise notice '% %', SQLERRM, SQLSTATE; END;
    
    CREATE OR REPLACE FUNCTION frmdb_set_column(
        p_table_name regclass, 
        p_col_name varchar,
        p_col_type varchar,
        p_col_scalar_formula varchar DEFAULT NULL
    ) RETURNS boolean AS $fun$ 
    DECLARE
        v_stm varchar;
        v_schema_name varchar;
        v_existing_col_type varchar;
        v_existing_formula varchar;
        v_new_formula varchar := '';
        v_new_col_type varchar;
        v_to_add boolean := false;
    BEGIN
        SELECT current_schema() INTO v_schema_name;
        RAISE NOTICE 'frmdb_set_column: v_schema_name=%, p_table_name=%, p_col_name=%, p_col_type=%, p_col_scalar_formula=%', v_schema_name, p_table_name, p_col_name, p_col_type, p_col_scalar_formula;
        v_new_col_type := trim(p_col_type);
        SELECT data_type::varchar, generation_expression::varchar 
        INTO v_existing_col_type, v_existing_formula 
        FROM information_schema.columns
            WHERE table_schema = v_schema_name AND table_name = p_table_name::name
            AND column_name = p_col_name;
        RAISE NOTICE 'frmdb_set_column: p_col_type=%, v_existing_col_type=%, p_col_scalar_formula=%, v_existing_formula=%.', p_col_type, v_existing_col_type, p_col_scalar_formula, v_existing_formula;

        IF v_existing_col_type IS NOT NULL
        THEN
            IF COALESCE(v_existing_formula, '') <> p_col_scalar_formula THEN
                v_stm := format($$ ALTER TABLE %I DROP COLUMN %I
                $$, p_table_name, p_col_name);
                EXECUTE v_stm;
                RAISE NOTICE 'frmdb_set_column: dropped % for table %.', p_col_name, p_table_name;

                v_stm := format($$ ALTER TABLE %I ADD COLUMN %I %s GENERATED ALWAYS AS (%s) STORED
                $$, p_table_name, p_col_name, v_new_col_type, p_col_scalar_formula);
                EXECUTE v_stm;
                v_to_add := true;
                RAISE NOTICE 'frmdb_set_column: v_to_add=%, column % added to table %.', v_to_add, p_col_name, p_table_name;

            ELSIF v_existing_col_type <> v_new_col_type THEN
                v_stm := format($$ ALTER TABLE %I ALTER COLUMN %I TYPE %s USING %I::%s
                $$, p_table_name, p_col_name, v_new_col_type, p_col_name, v_new_col_type);
                EXECUTE v_stm;
                RAISE NOTICE 'frmdb_set_column: column % replaced type % for table % [old type %].', p_col_name, v_new_col_type, p_table_name, v_existing_col_type;
                v_to_add := true;
            ELSE
                RAISE NOTICE 'frmdb_set_column: column % unchanged for table % [old type %].', p_col_name, p_table_name, v_existing_col_type;
            END IF;
        ELSE 
            IF p_col_scalar_formula IS NOT NULL THEN
                v_new_formula := format($$ GENERATED ALWAYS AS (%s) STORED $$, p_col_scalar_formula);
            ELSE 
                v_new_formula := '';
            END IF;
            v_stm := format($$ ALTER TABLE %I ADD COLUMN %I %s %s
            $$, p_table_name, p_col_name, v_new_col_type, v_new_formula);
            RAISE NOTICE 'frmdb_set_column: %.', v_stm;
            EXECUTE v_stm;
            v_to_add := true;
        END IF;

        RETURN v_to_add;
    END; $fun$ language 'plpgsql';
END;
$migration$;
