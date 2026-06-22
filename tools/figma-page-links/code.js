// Crealiev — Export Page Links
// Reads every page in the file and emits { name, id, nodeParam, url } for each,
// so the links can be pasted into Storybook stories' `design` parameter.

(async () => {
  // dynamic-page access: ensure all pages are available before traversal.
  if (typeof figma.loadAllPagesAsync === 'function') {
    await figma.loadAllPagesAsync();
  }

  const fileKey = figma.fileKey || null; // may be null for unpublished/dev plugins
  const fileName = figma.root.name || 'figma';
  // URL-safe file name slug (Figma is lenient here; this segment is cosmetic).
  const slug = encodeURIComponent(fileName.replace(/\s+/g, '-'));

  const FRAME_LIKE = new Set([
    'FRAME',
    'COMPONENT',
    'COMPONENT_SET',
    'INSTANCE',
    'SECTION',
    'GROUP',
  ]);

  // NOTE: Figma's plugin sandbox does not support object spread (...) in object
  // literals, so all objects below are built with explicit properties.
  const nodeParamOf = (id) => id.replace(':', '-'); // "3:27" -> "3-27"
  const urlOf = (id) =>
    fileKey
      ? `https://www.figma.com/design/${fileKey}/${slug}?node-id=${nodeParamOf(id)}`
      : null;

  const pages = figma.root.children.map((page) => {
    // Direct children that are frame-like, so each component frame can be pinned precisely.
    const frames = (page.children || [])
      .filter((c) => FRAME_LIKE.has(c.type))
      .map((c) => ({
        name: c.name,
        id: c.id,
        type: c.type,
        nodeParam: nodeParamOf(c.id),
        url: urlOf(c.id),
      }));
    return {
      name: page.name,
      id: page.id,
      nodeParam: nodeParamOf(page.id),
      url: urlOf(page.id),
      frames,
    };
  });

  figma.showUI(__html__, { width: 560, height: 680, title: 'Export Page Links' });
  figma.ui.postMessage({ fileKey, fileName, pages });
})();
