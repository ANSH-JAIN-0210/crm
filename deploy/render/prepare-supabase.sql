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
