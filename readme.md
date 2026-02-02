# @crealievs/design-system

🎨 **Crealievs Design System** - React components built from Figma

A production-ready React design system with TypeScript support, built directly from Figma designs. All components are fully typed, accessible, and follow consistent design patterns.

## Installation

```bash
npm install @crealievs/design-system
# or
yarn add @crealievs/design-system
# or
pnpm add @crealievs/design-system
```

## Peer Dependencies

This package requires:
- **React** ^18.0.0 or ^19.0.0
- **React DOM** ^18.0.0 or ^19.0.0

These are not included in the package to avoid version conflicts with your project.

## Quick Start

```tsx
import React from 'react';
import { Button, Badge, Checkbox } from '@crealievs/design-system';
// Import component styles
import '@crealievs/design-system/styles/components.css';
// Import design tokens (optional, if you want to use tokens in your own CSS)
import '@crealievs/design-system/styles/tokens.css';

function App() {
  return (
    <div>
      <Button variant="primary" onClick={() => console.log('Clicked!')}>
        Click me
      </Button>
      <Badge variant="success">Active</Badge>
      <Checkbox label="Accept terms" />
    </div>
  );
}
```

## Components

### Available Components

- **Badge** - Status indicators and labels with icon support
- **Button** - Interactive button elements with multiple variants (primary, secondary, tertiary, link, simple, ghost)
- **Checkbox** - Form checkboxes with label and optional description
- **FAB** (Floating Action Button) - Floating action buttons with positioning options
- **IconButton** - Icon-only buttons with tooltip support (plain and rich variants)
- **RadioButton** - Radio button groups (RadioGroup + RadioOption) for mutually exclusive selections
- **Tag** - Tag/label components with selection and icon support
- **Tooltip** - Tooltip/popover components (plain and rich variants)

### Component Examples

#### Button

```tsx
import { Button } from '@crealievs/design-system';

<Button variant="primary" size="default" onClick={handleClick}>
  Primary Button
</Button>

<Button variant="secondary" destructive>
  Delete
</Button>
```

#### Checkbox

```tsx
import { Checkbox } from '@crealievs/design-system';

<Checkbox
  label="Accept terms"
  description="By checking this, you agree to our terms and conditions"
  showDescription={true}
  checked={isChecked}
  onChange={setIsChecked}
/>
```

#### RadioButton Group

```tsx
import { RadioGroup, RadioOption } from '@crealievs/design-system';
import { useState } from 'react';

function MyForm() {
  const [value, setValue] = useState<string | null>('option1');
  
  return (
    <RadioGroup name="choices" value={value} onChange={setValue} direction="vertical">
      <RadioOption
        value="option1"
        label="First option"
        description="Additional information"
        showDescription={true}
      />
      <RadioOption
        value="option2"
        label="Second option"
        description="Additional information"
        showDescription={true}
      />
    </RadioGroup>
  );
}
```

#### IconButton with Rich Tooltip

```tsx
import { IconButton } from '@crealievs/design-system';
import { Info } from 'lucide-react';

<IconButton
  icon={Info}
  aria-label="More information"
  tooltipVariant="rich"
  tooltipBody="This is a rich tooltip with additional information and an action button."
  tooltipButtonLabel="Learn more"
  tooltipOnAction={() => console.log('Action clicked')}
/>
```

## Design Tokens

The design system includes comprehensive design tokens (CSS variables) for:

- **Colors**: Primary, secondary, neutral, error, success, warning, info, highlight, accent
- **Spacing**: Base spacing scale (4px to 56px) and semantic spacing (margins, padding)
- **Typography**: Font families (Oswald for headings, Open Sans for body), sizes, line heights
- **Borders**: Border radius, border widths, border colors
- **Other**: Opacity, layout values

### Using Design Tokens

```css
/* Import tokens in your CSS */
@import '@crealievs/design-system/styles/tokens.css';

.my-component {
  color: var(--text-neutral-default);
  background-color: var(--bg-primary-default);
  padding: var(--padding-default);
  border-radius: var(--radius-soft);
  font-family: var(--font-family-body);
}
```

### Available Token Categories

- `--bg-*` - Background colors
- `--text-*` - Text colors
- `--border-*` - Border colors and styles
- `--icon-*` - Icon colors
- `--padding-*` - Padding values
- `--margin-*` - Margin values
- `--font-*` - Font families, sizes, weights
- `--radius-*` - Border radius values
- `--opacity-*` - Opacity values

## TypeScript Support

All components are fully typed with TypeScript. Types are exported and available for use:

```tsx
import type { ButtonProps, ButtonVariant } from '@crealievs/design-system';

const buttonProps: ButtonProps = {
  variant: 'primary',
  children: 'Click me',
};
```

## Tree Shaking

The package supports tree shaking. You can import only the components you need:

```tsx
// ✅ Good - only imports Button
import { Button } from '@crealievs/design-system';

// ❌ Avoid - imports entire library
import * as Crealievs from '@crealievs/design-system';
```

## Styling

### Required CSS Import

You **must** import the component styles for components to render correctly:

```tsx
import '@crealievs/design-system/styles/components.css';
```

This imports all component CSS. The CSS is bundled and optimized for production.

### Design Tokens (Optional)

If you want to use design tokens in your own CSS:

```tsx
import '@crealievs/design-system/styles/tokens.css';
```

## Component Dependencies

Some components depend on others (this is normal in design systems):

- **IconButton** uses **Tooltip** internally
- **Tooltip** uses **Button** for rich tooltip actions

These dependencies are handled automatically - you don't need to import them separately.

## Accessibility

All components follow WCAG 2.1 AA standards:

- ✅ Proper ARIA attributes
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader support
- ✅ Minimum touch target sizes (24×24px)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- React 18+ and React 19+

## Documentation

Full component documentation is available in Storybook. Each component includes:

- Usage examples
- Props documentation
- Accessibility guidelines
- Best practices

### Running Storybook locally

```bash
npm run storybook
```

Storybook runs at `http://localhost:6006`.

### Publishing Storybook online (GitHub Pages)

You can host your Storybook library on GitHub Pages so it’s viewable at a URL like `https://<username>.github.io/<repo>/`.

1. **Push the repo to GitHub** (if you haven’t already):
   ```bash
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```

2. **Turn on GitHub Pages for this repo**
   - Open the repo on GitHub → **Settings** → **Pages**
   - Under **Build and deployment** > **Source**, choose **GitHub Actions**

3. **Deploy**
   - The workflow in `.github/workflows/deploy-storybook.yml` runs on every push to `main` (and can be run manually from the **Actions** tab).
   - After it finishes, your Storybook is available at `https://<username>.github.io/<repo>/`.

If your default branch is not `main`, edit the workflow’s `on.push.branches` in `.github/workflows/deploy-storybook.yml` to match your branch name.

## Contributing

This is a private design system. For issues or feature requests, please contact the maintainers.

## License

MIT

---

**Note**: This design system is actively being developed. More components will be added over time. The package structure is designed to scale automatically as new components are added.
