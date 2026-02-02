# NPM Package Publishing Implementation Plan

This document outlines the step-by-step plan to make the Crealievs design system ready for npm publishing.

## 📋 Overview

**Current Status**: Components are well-built but package infrastructure is missing  
**Target**: Publishable npm package that consumers can install and use  
**Estimated Time**: 2-3 days of focused work

---

## 🔴 Phase 1: Critical Fixes (Must Do First)

### 1.1 Fix Broken Exports

**Issue**: `Tag/index.ts` exports types that don't exist  
**File**: `src/components/Tag/index.ts`

**Action**:
- Remove `TagVariant` and `TagIconPosition` from exports (they don't exist in Tag.tsx)
- Export only what exists: `Tag`, `TagProps`, `TagState`

**Current**:
```ts
export type { TagProps, TagVariant, TagIconPosition } from './Tag';
```

**Should be**:
```ts
export { Tag } from './Tag';
export type { TagProps, TagState } from './Tag';
```

---

### 1.2 Create Main Entry Point

**Issue**: No central export file for the package  
**File**: `src/index.ts` (create new)

**Action**: Create main entry point that exports all components:

```ts
// src/index.ts
// Components
export { Badge } from './components/Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './components/Badge';

export { Button } from './components/Button';
export type { ButtonProps, ButtonVariant, ButtonSize, ButtonState } from './components/Button';

export { Checkbox } from './components/Checkbox';
export type { CheckboxProps, CheckboxState } from './components/Checkbox';

export { FAB } from './components/FAB';
export type { FABProps, FABVariant, FABState } from './components/FAB';

export { IconButton } from './components/IconButton';
export type { IconButtonProps, IconButtonVariant, IconButtonSize, IconButtonState } from './components/IconButton';

export { RadioGroup, useRadioGroup } from './components/RadioButton';
export type { RadioGroupProps, RadioGroupContextType, RadioGroupDirection } from './components/RadioButton';
export { RadioOption, RadioButton } from './components/RadioButton';
export type { RadioOptionProps as RadioButtonProps, RadioButtonState } from './components/RadioButton';

export { Tag } from './components/Tag';
export type { TagProps, TagState } from './components/Tag';

export { Tooltip } from './components/Tooltip';
export type { TooltipProps, TooltipVariant, TooltipPosition } from './components/Tooltip';

// Design Tokens (CSS file - consumers will import separately)
// Note: tokens.css will be distributed as a separate file
```

---

### 1.3 Configure Vite for Library Mode

**Issue**: Current Vite config builds for app, not library  
**File**: `vite.config.ts`

**Action**: Update to build as a library with proper entry points:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Crealievs',
      formats: ['es', 'cjs'],
      fileName: (format) => `crealievs.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'lucide-react',
        '@floating-ui/react-dom',
        'lottie-react',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
        },
      },
    },
    cssCodeSplit: false, // Bundle all CSS into one file
    sourcemap: true,
  },
});
```

**Note**: This will create:
- `dist/crealievs.mjs` (ESM)
- `dist/crealievs.cjs` (CommonJS)
- `dist/style.css` (all component CSS bundled)

---

### 1.4 Create TypeScript Build Config

**Issue**: Current tsconfig has `noEmit: true` - can't generate declaration files  
**File**: `tsconfig.build.json` (create new)

**Action**: Create separate build config for generating `.d.ts` files:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": false,
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": true,
    "outDir": "./dist",
    "moduleResolution": "node",
    "module": "ESNext"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "**/*.stories.tsx", "**/*.stories.ts", "**/*.test.tsx", "**/*.test.ts", ".storybook"]
}
```

**Update `tsconfig.json`**: Keep `noEmit: true` for development

---

### 1.5 Update package.json for npm

**Issue**: Missing critical npm package fields  
**File**: `package.json`

**Action**: Add all required fields:

```json
{
  "name": "@crealievs/design-system",
  "version": "1.0.0",
  "description": "🎨 Crealievs Design System - React components built from Figma",
  "type": "module",
  "main": "./dist/crealievs.cjs",
  "module": "./dist/crealievs.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/crealievs.mjs"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/crealievs.cjs"
      }
    },
    "./styles/tokens.css": "./dist/tokens.css",
    "./styles/components.css": "./dist/style.css",
    "./package.json": "./package.json"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "dev": "vite",
    "build": "npm run build:types && npm run build:lib",
    "build:types": "tsc -p tsconfig.build.json",
    "build:lib": "vite build",
    "preview": "vite preview",
    "storybook": "storybook dev -p 6006 --host localhost",
    "build-storybook": "storybook build",
    "prepublishOnly": "npm run build"
  },
  "keywords": [
    "react",
    "design-system",
    "components",
    "ui",
    "figma",
    "typescript"
  ],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/crealievs.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/crealievs/issues"
  },
  "homepage": "https://github.com/yourusername/crealievs#readme",
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "dependencies": {
    "@floating-ui/react-dom": "^2.1.6",
    "lottie-react": "^2.4.0",
    "lucide-react": "^0.344.0"
  },
  "devDependencies": {
    "@storybook/addon-essentials": "8.6.15",
    "@storybook/addon-interactions": "8.6.15",
    "@storybook/addon-links": "8.6.15",
    "@storybook/blocks": "8.6.15",
    "@storybook/react": "8.6.15",
    "@storybook/react-vite": "8.6.15",
    "@storybook/test": "8.6.15",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "storybook": "8.6.15",
    "typescript": "^5.5.4",
    "vite": "^5.4.2"
  }
}
```

**Key Changes**:
- Moved `react` and `react-dom` to `peerDependencies`
- Added `main`, `module`, `types`, `exports` fields
- Added `files` field to control what gets published
- Added `prepublishOnly` script to build before publishing
- Added repository, bugs, homepage fields
- Changed license to MIT (or your preferred license)

---

### 1.6 Handle CSS Distribution

**Issue**: CSS files need to be bundled and distributed  
**Files**: `vite.config.ts` (update), create CSS entry point

**Action**: 

1. **Create CSS entry file**: `src/styles/index.css`
```css
/* Import all component CSS */
@import './tokens.css';
@import '../components/Badge/Badge.css';
@import '../components/Button/Button.css';
@import '../components/Checkbox/Checkbox.css';
@import '../components/FAB/FAB.css';
@import '../components/IconButton/IconButton.css';
@import '../components/RadioButton/RadioButton.css';
@import '../components/RadioButton/RadioGroup.css';
@import '../components/Tag/Tag.css';
@import '../components/Tooltip/Tooltip.css';
```

2. **Update vite.config.ts** to copy CSS:
```ts
// Add to build.rollupOptions
plugins: [
  // ... existing plugins
  {
    name: 'copy-css',
    generateBundle() {
      // Vite will automatically handle CSS bundling
      // The CSS will be in dist/style.css
    },
  },
],
```

3. **Create separate tokens export**: Copy `tokens.css` to `dist/tokens.css` during build

**Alternative Approach** (if above doesn't work):
- Use a plugin to copy CSS files separately
- Or use a post-build script to copy CSS files

---

### 1.7 Create .npmignore

**Issue**: Storybook files and dev files shouldn't be in package  
**File**: `.npmignore` (create new)

**Action**: Create `.npmignore`:

```
# Source files (consumers get dist/)
src/
.storybook/
*.stories.tsx
*.stories.ts
*.mdx

# Development
.vscode/
.idea/
*.swp
*.swo

# Build artifacts (keep dist/)
*.tsbuildinfo

# Dependencies
node_modules/

# Documentation (keep README.md)
GETTING_STARTED.md
PROJECT_STRUCTURE.md
COMPONENTS_ANALYSIS.md
DESIGN_SYSTEM_SUMMARY.md
tokens.md

# Config (keep package.json, but not all configs)
vite.config.ts
tsconfig.json
tsconfig.node.json
tsconfig.build.json

# Git
.git/
.gitignore

# Other
.env
.env.local
*.log
.DS_Store
Thumbs.db
1.lottie
```

**Note**: The `files` field in package.json will override this, but `.npmignore` is a safety net.

---

## 🟡 Phase 2: High Priority Improvements

### 2.1 Create Consumer-Facing README

**Issue**: Current README is for development, not consumption  
**File**: `README.md` (update or create `README_NPM.md`)

**Action**: Create installation and usage documentation:

```markdown
# @crealievs/design-system

🎨 Crealievs Design System - React components built from Figma

## Installation

\`\`\`bash
npm install @crealievs/design-system
# or
yarn add @crealievs/design-system
# or
pnpm add @crealievs/design-system
\`\`\`

## Peer Dependencies

This package requires:
- React ^18.0.0 or ^19.0.0
- React DOM ^18.0.0 or ^19.0.0

## Usage

### Import Components

\`\`\`tsx
import { Button, Badge, Checkbox } from '@crealievs/design-system';
import '@crealievs/design-system/styles/components.css';
import '@crealievs/design-system/styles/tokens.css';
\`\`\`

### Basic Example

\`\`\`tsx
import React from 'react';
import { Button } from '@crealievs/design-system';
import '@crealievs/design-system/styles/components.css';
import '@crealievs/design-system/styles/tokens.css';

function App() {
  return (
    <Button variant="primary" onClick={() => console.log('Clicked!')}>
      Click me
    </Button>
  );
}
\`\`\`

### Using Design Tokens

\`\`\`css
/* Import tokens in your CSS */
@import '@crealievs/design-system/styles/tokens.css';

.my-component {
  color: var(--text-neutral-default);
  padding: var(--padding-default);
}
\`\`\`

## Components

- **Badge** - Status indicators and labels
- **Button** - Interactive button elements
- **Checkbox** - Form checkboxes
- **FAB** - Floating Action Button
- **IconButton** - Icon-only buttons
- **RadioButton** - Radio button groups (RadioGroup + RadioOption)
- **Tag** - Tag/label components
- **Tooltip** - Tooltip/popover components

## Documentation

Full documentation available at [Storybook URL] or see individual component `.mdx` files.

## License

MIT
```

---

### 2.2 Export Design Tokens

**Issue**: Consumers can't access design tokens  
**File**: Update build process

**Action**: Ensure `tokens.css` is copied to `dist/tokens.css` during build

Add to `vite.config.ts`:
```ts
import { copyFileSync } from 'fs';
import { resolve } from 'path';

// In build config, add a plugin or use a post-build script
build: {
  // ... existing config
  rollupOptions: {
    // ... existing options
  },
  // After build, copy tokens.css
  // Use a plugin or post-build script
}
```

**Or create a post-build script**: `scripts/copy-assets.js`
```js
import { copyFileSync } from 'fs';
import { resolve } from 'path';

copyFileSync(
  resolve('src/styles/tokens.css'),
  resolve('dist/tokens.css')
);
```

Update `package.json` scripts:
```json
"build": "npm run build:types && npm run build:lib && npm run copy:assets",
"copy:assets": "node scripts/copy-assets.js"
```

---

### 2.3 Update Build Scripts

**Issue**: Build process needs to generate types and bundle  
**File**: `package.json`

**Action**: Update scripts (already shown in 1.5, but ensure):

```json
{
  "scripts": {
    "build": "npm run build:types && npm run build:lib && npm run copy:assets",
    "build:types": "tsc -p tsconfig.build.json",
    "build:lib": "vite build",
    "copy:assets": "node scripts/copy-assets.js",
    "prepublishOnly": "npm run build",
    "dev": "vite",
    "preview": "vite preview",
    "storybook": "storybook dev -p 6006 --host localhost",
    "build-storybook": "storybook build"
  }
}
```

---

## 🟢 Phase 3: Nice-to-Have Improvements

### 3.1 Add CHANGELOG.md

**File**: `CHANGELOG.md` (create new)

**Format**: Follow [Keep a Changelog](https://keepachangelog.com/) format

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-01-26

### Added
- Initial release
- Badge component
- Button component
- Checkbox component
- FAB component
- IconButton component
- RadioButton and RadioGroup components
- Tag component
- Tooltip component
- Design tokens (CSS variables)
```

---

### 3.2 Add LICENSE File

**File**: `LICENSE` (create new)

**Action**: Add MIT license (or your preferred license)

---

### 3.3 Version Management Strategy

**Recommendation**: Use [Semantic Versioning](https://semver.org/)

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backward compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, backward compatible

**Tools**: Consider using `npm version` command or tools like `standard-version`

---

## 📝 Implementation Checklist

### Critical (Must Do)
- [ ] Fix Tag exports (remove non-existent types)
- [ ] Create `src/index.ts` main entry point
- [ ] Configure Vite for library mode
- [ ] Create `tsconfig.build.json` for type generation
- [ ] Update `package.json` with all npm fields
- [ ] Set up CSS distribution (bundle + tokens.css)
- [ ] Create `.npmignore`
- [ ] Move React deps to `peerDependencies`

### High Priority
- [ ] Create consumer-facing README
- [ ] Ensure tokens.css is exported
- [ ] Update build scripts
- [ ] Test build locally (`npm pack` to see what would be published)

### Nice to Have
- [ ] Add CHANGELOG.md
- [ ] Add LICENSE file
- [ ] Set up versioning strategy
- [ ] Add tests (future)
- [ ] Set up CI/CD (future)

---

## 🧪 Testing the Package Locally

Before publishing, test locally:

1. **Build the package**:
   ```bash
   npm run build
   ```

2. **Check what will be published**:
   ```bash
   npm pack
   ```
   This creates a `.tgz` file - extract it to see the contents

3. **Test in a separate project**:
   ```bash
   # In a test project
   npm install ../path/to/crealievs/crealievs-1.0.0.tgz
   ```

4. **Verify imports work**:
   ```tsx
   import { Button } from '@crealievs/design-system';
   import '@crealievs/design-system/styles/components.css';
   ```

---

## 🚀 Publishing Steps

Once everything is ready:

1. **Update version**:
   ```bash
   npm version patch  # or minor, or major
   ```

2. **Build**:
   ```bash
   npm run build
   ```

3. **Test locally** (see above)

4. **Publish**:
   ```bash
   npm publish --access public  # if scoped package
   # or
   npm publish
   ```

---

## 📚 Additional Resources

- [Vite Library Mode](https://vitejs.dev/guide/build.html#library-mode)
- [npm Package.json Fields](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)
- [TypeScript Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
- [Semantic Versioning](https://semver.org/)

---

## ⚠️ Important Notes

1. **Component Dependencies**: As noted, it's normal for components to depend on each other (e.g., IconButton uses Tooltip, Tooltip uses Button). This is expected in design systems.

2. **CSS Strategy**: The current approach bundles all CSS. Consumers must import the CSS file. Alternative approaches:
   - CSS-in-JS (would require refactoring)
   - CSS Modules (would require refactoring)
   - Current approach is fine for npm packages

3. **Tree Shaking**: With proper exports and ESM build, tree shaking should work automatically. Consumers can import only what they need.

4. **TypeScript**: Declaration files (`.d.ts`) will be generated automatically with the build config.

---

## 🎯 Success Criteria

The package is ready when:
- ✅ `npm run build` produces `dist/` with all necessary files
- ✅ `npm pack` shows only necessary files
- ✅ Can install and import components in a test project
- ✅ CSS imports work correctly
- ✅ TypeScript types are available
- ✅ No broken exports
- ✅ All peer dependencies properly declared

---

**Next Steps**: Start with Phase 1 (Critical Fixes) and work through systematically. Test after each phase before moving to the next.
