# Figma — Export Page Links

A throwaway dev plugin that lists every **page** in the Figma file with its
name, node-id, and a ready-to-use share URL. Used to wire Figma frames into
Storybook stories via `@storybook/addon-designs` (each component lives on its
own page in `crealiev-ds`).

## Run it

1. In the **Figma desktop app**, open the `crealiev-ds` file.
2. Menu → **Plugins → Development → Import plugin from manifest…**
3. Select `tools/figma-page-links/manifest.json` (this folder).
4. Run it: **Plugins → Development → Crealiev — Export Page Links**.
5. Click **Copy all** and paste the result back to Claude.

The plugin only **reads** the document (page names + ids). It writes nothing.

> Safe to delete this folder afterwards — it is not part of the published
> package (`package.json` ships only `dist/`).
