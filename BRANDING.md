# crm branding

- Product and repository name: crm
- Brand color: #172554
- Icon: white C on a navy background
- Upstream: https://github.com/twentyhq/twenty

Web metadata is in `packages/twenty-front/index.html` and `public/manifest.json`. Install icons retain upstream filenames to preserve existing references. The welcome screen, fallback page title, not-found page, onboarding copy, and sign-in footer use the personal brand.

Do not globally replace `twenty`: package names, routes, GraphQL types, migrations, license text, integrations, and upstream attribution rely on those identifiers.

Translation catalogs are maintained by the upstream Lingui pipeline and have not been regenerated. The new source messages use English fallback until translated. Review translated and ancillary surfaces before publishing a fully branded service.