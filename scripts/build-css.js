import { build } from 'vite';
import { resolve } from 'path';
import { copyFileSync, existsSync, mkdirSync } from 'fs';

/**
 * Build CSS bundle separately
 * This creates dist/style.css with all component styles
 */
async function buildCSS() {
  const distDir = resolve(process.cwd(), 'dist');
  
  // Ensure dist directory exists
  if (!existsSync(distDir)) {
    mkdirSync(distDir, { recursive: true });
  }

  // Build CSS bundle: JS entry that only imports CSS so Vite emits one CSS asset
  const jsEntry = resolve(process.cwd(), 'scripts/css-entry.js');
  await build({
    build: {
      lib: {
        entry: jsEntry,
        name: 'styles',
        formats: ['es'],
        fileName: () => 'style-css-bundle',
      },
      cssCodeSplit: false,
      cssMinify: true,
      write: true,
      emptyOutDir: false,
      outDir: distDir,
      rollupOptions: {
        output: {
          assetFileNames: 'style.css',
          entryFileNames: 'style-css-bundle.js',
        },
      },
    },
  });

  // Vite emits CSS as style.css (assetFileNames); remove the unused JS bundle and its map
  const { unlinkSync } = await import('fs');
  for (const name of ['style-css-bundle.js', 'style-css-bundle.js.map']) {
    const p = resolve(distDir, name);
    if (existsSync(p)) unlinkSync(p);
  }

  // Copy tokens.css separately
  const tokensPath = resolve(process.cwd(), 'src/styles/tokens.css');
  const tokensDistPath = resolve(process.cwd(), 'dist/tokens.css');
  if (existsSync(tokensPath)) {
    copyFileSync(tokensPath, tokensDistPath);
    console.log('✓ Copied tokens.css to dist/tokens.css');
  }

  console.log('✓ CSS build complete');
}

buildCSS().catch((error) => {
  console.error('Error building CSS:', error);
  process.exit(1);
});
