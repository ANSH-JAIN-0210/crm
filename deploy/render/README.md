# Render + Supabase

This Blueprint builds the branded source in this repository. It does not use the upstream prebuilt image, which would omit crm branding.

## Resources

- `crm-web`: web application and background worker together on free compute.
- `crm-redis`: private Render Key Value with `noeviction`, free initially.
- External Supabase PostgreSQL and a private Supabase Storage bucket named `crm-files`.

This free-only configuration is experimental: the app and worker share 512 MB RAM, which may be insufficient. No paid resources are configured. Render's free web service sleeps and free Key Value does not provide durable queue storage; upgrade these for reliable continuous operation. The Docker build needs sufficient build memory; the upstream frontend build permits an 8 GB heap.

## Supabase setup

Use a dedicated project with no existing application data, preferably in Singapore to match this Blueprint. Twenty owns its database migrations and authentication; it uses TypeORM, not Prisma ORM or Supabase Auth. Do not replace its schema with a Prisma schema.

In Supabase's Connect dialog, choose the **Session pooler** on port **5432** for an IPv4-compatible persistent application connection. Do not use the transaction pooler on port 6543. Use the postgres account because initialization creates schemas, roles, and extensions. Add `sslmode=verify-full` to enforce certificate verification, and URL-encode special characters in the password. Confirm the selected project's PostgreSQL permissions/extensions support Twenty's migrations before applying them.

Create a private `crm-files` bucket. Generate server-side S3 credentials and use the S3 endpoint and region shown in the project's Storage settings. Do not use an anon/publishable key as the S3 access key.

Before first deployment, run `deploy/render/prepare-supabase.sql` in this dedicated project's SQL editor. Twenty's initialization explicitly uses `public.unaccent`; if this extension already exists in another schema, relocate it to `public` in the dedicated project first. The preflight deliberately stops instead of moving an existing extension automatically.

Keep the database's application schemas out of the Supabase Data API exposed-schema list. This app accesses them directly through PostgreSQL.

## Blueprint inputs

Supply these values in Render's secret input fields, never in Git:

| Variable | Value source |
| --- | --- |
| `PG_DATABASE_URL` | Supabase Session pooler PostgreSQL connection URL, with TLS verification |
| `STORAGE_S3_REGION` | Region shown in Supabase S3 settings |
| `STORAGE_S3_ENDPOINT` | S3 endpoint shown in Supabase Storage settings |
| `STORAGE_S3_ACCESS_KEY_ID` | Supabase server-side S3 access key |
| `STORAGE_S3_SECRET_ACCESS_KEY` | Matching S3 secret |

Render generates the app/encryption secrets; both processes inherit them. Keep the encryption key stable and backed up. Uploaded files use the shared S3 bucket rather than container storage.

The startup entrypoint initializes/upgrades the database. A supervisor starts the web process, waits for its local health endpoint, then starts the worker. It forwards shutdown signals and stops both if either exits. The Render-provided web URL becomes `SERVER_URL` automatically. Automatic deployments are off until the first deployment has been verified.

## Apply and verify

1. Open the [Render Blueprint setup](https://dashboard.render.com/blueprint/new?repo=https://github.com/ANSH-JAIN-0210/crm).
2. Select the intended workspace, review the compute costs, and provide the inputs above.
3. Apply the Blueprint; wait for the build and the web database initialization to finish.
4. Confirm `/healthz` returns success, create the first account/workspace, and verify a contact can be saved.
5. Upload a file and verify the worker starts and processes a background job.
6. Configure SMTP and provider OAuth separately if required. No email-provider or OAuth credentials are included.

The Blueprint has been validated against Render's public JSON schema. Account-aware CLI validation and live health/migration tests remain required before reporting a successful deployment.

## Docker maintenance

`deploy/render/Dockerfile` copies the upstream build stages through the combined web/server target, then adds the Render startup wrapper. When updating upstream, refresh these build stages from `packages/twenty-docker/twenty/Dockerfile` while keeping the final `crm-render` stage.
