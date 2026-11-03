# crm

A personal CRM based on [Twenty](https://github.com/twentyhq/twenty), upstream commit `671b0ad6d87c1620a96dafd30823d61e72144a2d`. This repository starts from a complete source snapshot.

Manage contacts, companies, opportunities, tasks, and workflows in a workspace you control.

## Branding

The web app uses the crm name, a navy C mark, matching install icons, browser metadata, and a personal sign-in footer. Workspace names and uploaded workspace logos remain customizable from Settings.

Internal `twenty-*` package names and API identifiers are retained for compatibility. Upstream documentation is in [UPSTREAM_README.md](UPSTREAM_README.md).

## Development

Use the Node version in `.nvmrc` and the Yarn version in `package.json`. A full local environment also requires PostgreSQL and Redis. Follow the upstream [local setup guide](https://docs.twenty.com/developers/local-setup) and `CLAUDE.md` for current commands.

```sh
yarn install
yarn start
```

For self-hosting, see the upstream Docker Compose files under `packages/twenty-docker`. Building your own image is required to include this fork's branding; upstream published images do not contain these changes.

## Scope and attribution

This is a personal web-app branding fork, not a deployment. Core email templates and the default sender name also use crm. Companion apps, developer tools, translations, marketplace integrations, and upstream commercial services can still contain Twenty branding. Configure your own SMTP and OAuth providers before use. No provider credentials or deployed domain are included.

The sign-in footer does not claim that Twenty's hosted-service terms govern this personal instance. Add your own policies before opening registration to others.

Original copyright and license notices are preserved. The repository contains AGPLv3, MIT, and separately licensed Enterprise files; see [LICENSE](LICENSE) and individual package licenses. Rebranding does not grant an Enterprise license or remove source-availability obligations.
## Automation

Render deployment configuration and Supabase setup instructions are available in [deploy/render/README.md](deploy/render/README.md). The Blueprint is in [render.yaml](render.yaml).

Upstream GitHub Actions are archived in .github/upstream-workflows. They are inactive in this personal repository; review and adapt them before enabling CI or publishing.
