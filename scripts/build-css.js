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

  // Build CSS bundle
  await build({
    build: {
      lib: {
        entry: resolve(process.cwd(), 'src/styles/index.css'),
        name: 'styles',
        formats: ['es'],
        fileName: () => 'style.css',
      },
      cssCodeSplit: false,
      cssMinify: true,
      write: true,
      emptyOutDir: false, // Don't clear dist/ (types and JS already there)
      outDir: distDir,
      rollupOptions: {
        output: {
          assetFileNames: 'style.css',
        },
      },
    },
  });

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
