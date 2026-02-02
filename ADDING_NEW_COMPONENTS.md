# Adding New Components to the Design System

This guide ensures new components **match Figma exactly on the first pass** and follow design-system, accessibility, and responsive standards. Follow it step by step; do not skip the Figma workflow.

**Goal:** Build the component once, correctly. No rework, no “it doesn’t look like Figma,” no reprompting.

---

## 1. Mandatory: Figma First (Before Any Code)

**Do not implement from screenshots or descriptions.** Always use Figma MCP tools first. Implementing without them leads to wrong tokens, wrong states, and components that don’t match the design.

### 1.1 Get Figma identifiers

From a Figma URL, e.g.:

`https://www.figma.com/design/fV2stU6OBO4lVr2CKMqOfO/DS---Components?node-id=36-508&m=dev`

- **fileKey:** `fV2stU6OBO4lVr2CKMqOfO` (after `/design/`)
- **nodeId:** `36:508` (from `node-id=36-508`; use colon in MCP)

### 1.2 Call Figma MCP in this order

1. **`get_variable_defs`** (nodeId, fileKey)  
   Returns every design token used: colors, spacing, typography, radius, opacity.  
   Use this to map Figma token names to `src/styles/tokens.css`. If a token is missing in `tokens.css`, add it (semantic alias) before implementing.

2. **`get_design_context`** (nodeId, fileKey, **forceCode: true**)  
   Returns structure and layout. Use it to understand hierarchy, padding, gaps, and which elements are the “container” vs “instance” (e.g. Segmented Buttons container vs. segment instance).

3. **`get_screenshot`** (nodeId, fileKey)  
   Use for visual sanity check, not as the source of truth. Tokens from `get_variable_defs` are the source of truth.

4. **`get_metadata`** (nodeId, fileKey) — when the component has variants  
   Use to find child node IDs for each state/variant (default, hover, active, disabled, checked, etc.). Then run `get_variable_defs` (and optionally `get_design_context`) **per variant node** so you have exact tokens per state.

### 1.3 Component vs. instance / states

- **Container** (e.g. Segmented Buttons): layout (flex/gap/padding), background, radius. Tokens from the main node.
- **Instance** (e.g. segment, tab, option): often has **states** in Figma (default, hover, active/pressed, disabled, selected).  
  For each state, use the token names Figma shows (e.g. `bg/primary/subtle-hover`, `bg/primary/subtle-active`). Implement those exact states in CSS (`:hover`, `:active`, `:disabled`, `[aria-checked="true"]`, etc.) and map to semantic tokens in `tokens.css`.

### 1.4 Token mapping rules

- **Never invent token names.** Use only names returned by `get_variable_defs` (or their semantic aliases in `tokens.css`).
- **Never use base tokens in component CSS.** Use semantic tokens only (e.g. `--bg-neutral-elevated`, not `--secondary-metal-200`).
- **Never assume.** If Figma has no border token for a state, don’t add a border. If Figma says “pill” or “gap/very-tight”, use the matching semantic token (e.g. `--pill`, `--gap-very-tight`).
- **Typography:** Match font family, size, weight, line-height, and color from Figma; use typography tokens from `tokens.css`.

### 1.5 Common mistakes

- Guessing from a screenshot instead of using `get_variable_defs`.
- Using “similar” tokens (e.g. `--bg-neutral-alt` when Figma uses `--bg-neutral-elevated`).
- Adding borders or shadows Figma doesn’t define.
- Implementing only default state; missing hover, active, disabled, or selected tokens.
- Skipping child nodes when the design has a clear “instance” with multiple states.

---

## 2. Component Structure (Design-System Architect)

Every component MUST follow this structure:

```
src/components/ComponentName/
  ├── ComponentName.tsx
  ├── ComponentName.css
  ├── ComponentName.types.ts   (if types are non-trivial)
  ├── ComponentName.stories.tsx
  ├── ComponentName.mdx
  └── index.ts
```

- Directory name = PascalCase component name.
- Component is exported from `src/index.ts`.
- Its CSS is imported in `src/styles/index.css`:  
  `@import '../components/ComponentName/ComponentName.css';`

---

## 3. API and Code (Architect + Simplifier)

- **Semantic props:** Use names like `variant`, `size`, `state` (when needed), not `type` or `mode`.
- **No “state” props for interaction:** Do not add props that mirror hover, focus, pressed, or disabled. Those are CSS pseudo-classes and native attributes (`disabled`, `aria-checked`), not props.
- **Flat and explicit:** Prefer one clear component; avoid unnecessary wrappers, factories, or adapters. Prefer 0–1 levels of indirection.
- **Reuse existing components:** Use `IconButton`, `Tooltip`, `Button`, etc. instead of re-implementing. Compose instead of configuring.
- **TypeScript:** Functional components with `React.FC`, JSDoc on props, types exported from `index.ts`.
- **No duplicate state:** Don’t duplicate the same concept in props, JS state, and CSS. Prefer CSS for hover/focus/pressed/disabled where possible.

---

## 4. CSS (Architect + Figma Fidelity)

- **BEM-like:** `.component`, `.component--modifier`, `.component__element`.
- **Only semantic tokens:** From `src/styles/tokens.css`. No base color/spacing tokens, no hardcoded values.
- **One source of truth:** Figma variable defs + `tokens.css`. Every color, spacing, radius, font, and opacity must map to a token you got from Figma (or a semantic alias you added).
- **States:** Implement every state Figma defines (default, hover, active, disabled, selected) with the exact tokens you pulled for that state.
- **Overlays (Modal, DatePicker, Dropdown, etc.):** No auto-focus on open. Trap focus inside when open; Escape closes. If Figma specifies max height (e.g. 60vh), implement it. Mobile: use bottom-sheet pattern where applicable.

---

## 5. Accessibility (React Accessibility Guardian)

- **Semantic HTML:** Use `<button>`, `<a>`, `<input>`, `<label>`, `<fieldset>`. No clickable `<div>`/`<span>` without a very good reason.
- **Keyboard:** Every interactive element reachable by Tab; visible focus style; Enter/Space where appropriate. Composite widgets (tabs, radiogroup, listbox, menu) follow WAI-ARIA keyboard patterns.
- **ARIA:** Minimal and correct. Use `aria-label`, `aria-describedby`, `aria-checked`, `aria-disabled`, etc. when needed. Do not duplicate semantics (e.g. `button` + `role="button"`).
- **Focus:** No removal of focus outlines. No `tabIndex={-1}` without a documented reason. Focus must not get lost on re-render.
- **Motion:** Respect `prefers-reduced-motion` (disable or shorten transitions when set). No essential information only via animation.
- **Definition of done:** A keyboard-only or screen-reader user can use the component calmly, predictably, and without confusion.

---

## 6. Responsive (Responsive Design Guardian)

- **Mobile-first:** Base styles for small viewport; enhance for larger. Not “desktop first, then shrink.”
- **Avoid fixed dimensions** unless justified. Prefer `min-width`/`max-width`, `clamp()`, flex/grid, content-driven sizing.
- **Touch targets:** Interactive elements at least 44px (e.g. `min-height: 2.75rem`).
- **Overflow:** No accidental horizontal scroll or cut-off content. Overflow should be intentional.
- **Storybook:** Component must work at 320px, 375px, 768px, and larger. Do not rely on Storybook’s default canvas width alone.
- **Principle:** The component should adapt to its container, not assume a specific layout.

---

## 7. Storybook (Storybook Conventions)

- **One default story only.** No separate stories per state (e.g. no “Error”, “Disabled”, “Primary” stories). One story (e.g. `Default`) that renders the component.
- **One MDX:** `ComponentName.mdx` with `<Canvas of={...Default} />` and a note that users should try states via the **Controls** panel.
- **Controls for state:** Expose props that affect state in `argTypes`: `disabled`, `errorMessage`, `value`/`initialValue`, `variant`, etc. Users change args to explore states.
- **CSF3:** `Meta`, `StoryObj`, named export for the default story, `args`/`argTypes` on meta or story.

---

## 8. Avoid Heavy Workarounds (Simplifier)

- Prefer **simple, maintainable** solutions over clever tricks.
- **Example – layout shift:** If bold only on the selected item causes a small shift, prefer accepting that shift over adding hidden duplicate text (sizer) in the DOM. Hidden duplicates add maintenance and accessibility risk; small shifts are usually acceptable.
- **Example – sliding indicator:** If you need a “sliding pill” (e.g. selected background moving between segments), one absolutely positioned indicator animated with JS is acceptable. Pure CSS cannot “move” one background between siblings.
- Do not add abstractions, extra state, or DOM that exist only to satisfy a minor visual preference. When in doubt, choose the option that is easier to read and change later.

---

## 9. Step-by-Step Workflow (Summary)

1. **Figma**
   - Get `fileKey` and `nodeId` from URL.
   - `get_variable_defs` → list all tokens; map to `tokens.css` (add semantic aliases if needed).
   - `get_design_context` (forceCode: true) → structure and layout.
   - `get_screenshot` → visual check.
   - If there are variants/instances with states: `get_metadata` to find child nodes, then `get_variable_defs` (and optionally `get_design_context`) per state node.

2. **Implement**
   - Create folder and files (tsx, css, types if needed, stories, mdx, index).
   - Implement component using **only** the tokens and structure from Figma. Implement every state (default, hover, active, disabled, selected) with the correct tokens.
   - Add CSS import to `src/styles/index.css` and export from `src/index.ts`.

3. **Review**
   - **Architect:** Structure, API, BEM, tokens only, no base tokens.
   - **Simplifier:** No redundant state, no unnecessary props or DOM, reuse existing components.
   - **Accessibility:** Semantic HTML, keyboard, ARIA, focus, reduced motion.
   - **Responsive:** Mobile-first, touch targets, no unjustified fixed sizes, works in Storybook at small widths.

4. **Storybook**
   - One Default story, Controls for state-affecting props, one MDX with Canvas and “use Controls to try states.”

---

## 10. Verification Checklist (Before Done)

- [ ] Figma MCP used: `get_variable_defs`, `get_design_context` (forceCode: true), `get_screenshot`; variants/states queried if present.
- [ ] Every visual property (color, spacing, radius, typography, opacity) maps to a token from Figma / `tokens.css`; no invented or “similar” tokens.
- [ ] All states implemented (default, hover, active, disabled, selected) with correct tokens.
- [ ] Folder structure and exports correct; CSS imported in `src/styles/index.css`.
- [ ] Semantic HTML; keyboard and focus work; ARIA minimal and correct; `prefers-reduced-motion` respected.
- [ ] No unjustified fixed dimensions; touch targets ≥ 44px; works at 320px and in Storybook.
- [ ] One default story; states via Controls; one MDX with Canvas.
- [ ] No heavy workarounds (e.g. no hidden duplicate content for layout) unless justified and documented.

---

## 11. Subagents Quick Reference

When building or reviewing a component, apply:

| Subagent | Focus |
|----------|--------|
| **Design-system architect** | Folder structure, API design, BEM, tokens-only CSS, Figma-first workflow, accessibility checklist. |
| **Design-system simplifier** | Remove redundant state/props/DOM; prefer CSS for interaction state; reuse existing components; avoid workarounds that add complexity. |
| **React accessibility guardian** | Semantic HTML, keyboard, focus, ARIA, screen readers, reduced motion. |
| **Responsive design guardian** | Mobile-first, touch targets, no fixed sizes without reason, overflow, Storybook viewports. |

These perspectives are baked into this guide. Following it gives you a single, reliable path to components that match Figma and meet design-system, accessibility, and responsive standards the first time.
