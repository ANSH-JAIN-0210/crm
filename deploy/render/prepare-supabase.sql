-- Run only against a dedicated crm Supabase project before the first deploy.
CREATE EXTENSION IF NOT EXISTS "unaccent" WITH SCHEMA public;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_extension extension
    JOIN pg_namespace namespace ON namespace.oid = extension.extnamespace
    WHERE extension.extname = 'unaccent' AND namespace.nspname <> 'public'
  ) THEN
    RAISE EXCEPTION 'crm requires unaccent in the public schema. Move this extension to public in the dedicated project before deploying.';
  END IF;
END;
$$;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

DO $$
DECLARE
  extension_schema text;
BEGIN
  SELECT namespace.nspname INTO extension_schema
  FROM pg_extension extension
  JOIN pg_namespace namespace ON namespace.oid = extension.extnamespace
  WHERE extension.extname = 'uuid-ossp';

  IF extension_schema <> 'public' THEN
    EXECUTE format(
      'CREATE OR REPLACE FUNCTION public.uuid_generate_v4() RETURNS uuid LANGUAGE sql VOLATILE AS $function$ SELECT %I.uuid_generate_v4() $function$',
      extension_schema
    );
  END IF;
END;
$$;
