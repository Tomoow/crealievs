# Components Analysis - Token Integration

This document captures the components defined in your design system and how tokens are integrated.

## Complete Component List

Based on the Figma file structure, here are all 23 components:

1. **Accordion** - Expandable/collapsible content sections
2. **Badge** - Status indicators or labels
3. **Buttons** - Interactive button elements
4. **Cards** - Container components for content
5. **Checkbox** - Form input checkboxes
6. **Dropdown** - Select/dropdown menus
7. **Datepicker** - Date selection input
8. **Footer** - Page footer component
9. **Inline alert** - Alert/notification messages
10. **Header** - Page header component
11. **Inputfield** - Text input fields
12. **Loading spinner** - Loading animation (uses Lottie file: `1.lottie`)
13. **Modal** - Dialog/modal overlays
14. **Progress indicator** - Progress bars/indicators
15. **Radiobutton** - Radio button inputs
16. **Segmented buttons** - Button groups with segments
17. **Slide toggle** - Toggle switches
18. **Slider** - Range slider inputs
19. **Tabs** - Tab navigation component
20. **Table** - Data table component
21. **Tag** - Tag/label components
22. **Toaster** - Toast notification component
23. **Tooltip** - Tooltip/popover component

## Token Integration Patterns (Observed)

### Accordion Component
**Visual Structure:**
- Collapsed state: Shows question with downward chevron
- Expanded state: Shows question and answer with upward chevron
- Multiple instances stacked vertically

**Token Usage (Inferred):**
- **Colors:**
  - Background: `--bg-neutral-default` or `--bg-neutral-alt`
  - Text: `--text-neutral-default`
  - Borders: `--border-default-subtle` (for separators)
- **Typography:**
  - Question text: Uses Interface text styles (likely `Ag default` or `Ag small`)
  - Answer text: Uses Body text styles (likely `Ag default` or `Ag small`)
- **Spacing:**
  - Vertical padding: `--padding-default` or `--padding-large`
  - Gap between items: `--margin-default` or `--margin-small`
  - Padding between question and answer: `--padding-default`
- **Icons:**
  - Chevron icons: Uses Lucide icons library
  - Icon color: `--icon-neutral-default`
- **Borders:**
  - Border width: `--border-default` (1px)
  - Border color: `--border-default-subtle`

### Checkbox Component
**Visual Structure:**
- Square checkbox with label text "Keuze"
- Multiple states: checked (blue), checked (darker blue), unchecked (white with gray border)

**Token Usage (Inferred):**
- **Colors:**
  - Checked background: `--bg-primary-default` (blue) and `--bg-primary-active` (darker blue)
  - Checked icon: `--icon-neutral-inverse` (white checkmark)
  - Checked border: `--border-action-default`
  - Unchecked background: `--bg-neutral-default` (white)
  - Unchecked border: `--border-default-default` (gray)
  - Label text: `--text-neutral-default`
- **Typography:**
  - Label: Uses Interface text styles (`Ag default` or `Ag small`)
- **Spacing:**
  - Gap between checkbox and label: `--padding-small` or `--padding-default`
  - Vertical spacing between items: `--margin-default`
- **Border Radius:**
  - Checkbox corners: `--radius-1` or `--input` (slightly rounded)
- **Border Width:**
  - Border: `--border-default` (1px)

## Animation Assets

- **Loading Spinner**: Uses Lottie animation file (`1.lottie`)

## Token Integration Principles (Based on Observations)

1. **Semantic Color Usage**: Components use semantic color tokens (e.g., `--bg-primary-default`, `--text-neutral-default`) rather than base colors directly
2. **Typography Styles**: Components reference Figma text styles (e.g., `Ag default`, `Ag small`) which map to your typography tokens
3. **Spacing Consistency**: Components use semantic spacing tokens (`--padding-default`, `--margin-small`, etc.) for consistent spacing
4. **Border System**: Components use semantic border tokens (`--border-default`, `--border-action-default`) with defined widths and colors
5. **State Management**: Components have clear states (default, hover, active, disabled) using state-specific tokens
6. **Icon Integration**: Components use Lucide icons with semantic icon color tokens

## Next Steps for Implementation

When building each component:
1. Map Figma text styles to typography tokens
2. Use semantic color tokens for all colors
3. Apply spacing tokens consistently
4. Use border radius tokens for rounded corners
5. Implement state variants (default, hover, active, disabled)
6. Integrate Lucide icons with proper icon color tokens
7. Use Lottie for loading spinner animation
