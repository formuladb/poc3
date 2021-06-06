CREATE TABLE IF NOT EXISTS talerts (
    _id SERIAL PRIMARY KEY,
    updated_at timestamptz,
    created_at timestamptz,
    title varchar,
    msg varchar,
    email varchar,
    phone varchar
);
CREATE OR REPLACE FUNCTION sp_notify_alerts()
     RETURNS trigger
     LANGUAGE 'plpgsql'
     COST 100.0
     VOLATILE NOT LEAKPROOF 
 AS $BODY$

 BEGIN
     raise notice 'Executing %, %, %', TG_OP, NEW.email, NEW.phone;

     IF NEW.email IS NOT NULL THEN
         PERFORM pg_notify('email_notification', '' || row_to_json(NEW));
	 END IF;

     IF NEW.phone ~* '^[+0-9]+$' THEN
         PERFORM pg_notify('sms_notification', '' || row_to_json(NEW));
	 END IF;

     RETURN NEW;
 END;
 $BODY$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT * 
                     FROM information_schema.triggers
                     WHERE event_object_table = 'talerts'
                     AND trigger_name = 'trg_notify_talerts'
                     ) 
    THEN
        CREATE TRIGGER trg_notify_talerts
        AFTER INSERT ON talerts
        FOR EACH ROW
        EXECUTE PROCEDURE sp_notify_alerts();
    END IF ;
END;
$$
