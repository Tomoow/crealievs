# Numeric Stepper API Design for InputField

## Recommended API Extension

### 1. TypeScript Changes

**Extend `InputFieldType`:**
```typescript
export type InputFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'url'
  | 'tel'
  | 'search'
  | 'number';  // Add number type
```

**Add to `InputFieldProps`:**
```typescript
export type InputFieldProps = InputFieldLabelProps & {
  // ... existing props ...
  
  /**
   * Minimum value for number inputs.
   * Only applies when type="number".
   */
  min?: number;
  
  /**
   * Maximum value for number inputs.
   * Only applies when type="number".
   */
  max?: number;
  
  /**
   * Step increment for number inputs.
   * Only applies when type="number".
   * @default 1
   */
  step?: number;
  
  /**
   * Show increment/decrement stepper buttons for number inputs.
   * Defaults to true when type="number", can be set to false to hide stepper.
   * @default true (when type="number")
   */
  showStepper?: boolean;
};
```

### 2. Component Logic

**Behavior:**
- When `type="number"` and `showStepper !== false`, render stepper buttons (ChevronUp/ChevronDown) instead of clear button
- Stepper buttons use `IconButton` component (variant="default", size="small")
- Increment/decrement handlers respect `min`, `max`, and `step` props
- Value is coerced to number and clamped to min/max bounds
- Stepper buttons are disabled when value is at min (decrement) or max (increment)
- Clear button is hidden for number inputs (stepper serves the purpose)

**Implementation notes:**
- Use `ChevronUp` and `ChevronDown` icons from `lucide-react`
- Stepper buttons should be grouped in a container for proper spacing
- Buttons should be vertically stacked (increment on top, decrement on bottom)
- Maintain focus on input after stepper button clicks
- Handle edge cases: empty value, NaN, Infinity

### 3. CSS Hooks

**Add to `InputField.css`:**

```css
/* Stepper container modifier */
.input-field-container--stepper {
  /* No additional styles needed - flex layout handles it */
}

/* Stepper button group wrapper */
.input-field__stepper-group {
  display: flex;
  flex-direction: column;
  gap: 0; /* Buttons should be touching */
  flex-shrink: 0;
  margin-left: var(--padding-small); /* 8px gap from input */
}

/* Individual stepper button spacing */
.input-field__stepper-group .icon-button-container {
  /* IconButton already handles its own styling */
  /* May need to adjust border-radius for touching buttons */
}

/* First button in group - round top corners only */
.input-field__stepper-group .icon-button-container:first-child .icon-button {
  border-radius: var(--radius-input) var(--radius-input) 0 0;
}

/* Last button in group - round bottom corners only */
.input-field__stepper-group .icon-button-container:last-child .icon-button {
  border-radius: 0 0 var(--radius-input) var(--radius-input);
}
```

**Alternative simpler approach (if IconButton doesn't need border-radius adjustment):**
```css
/* Stepper button group wrapper */
.input-field__stepper-group {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  margin-left: var(--padding-small); /* 8px gap from input */
}
```

## Rationale

### Why extend InputField rather than create a new component?

1. **Consistency**: The stepper is fundamentally a number input with UI affordances. It shares all the same concerns (labeling, validation, error states, helper text) as other input types.

2. **Simplicity**: Following the design system's "prefer simple, flat components" rule, extending the existing component avoids creating parallel component hierarchies. The stepper buttons are just another right-side action, similar to the clear button.

3. **Reusability**: By extending `InputField`, we automatically get all existing features (left icons, error states, helper text, accessibility) without duplication.

### Why `showStepper` prop instead of automatic behavior?

1. **Explicit control**: Some use cases may want number inputs without stepper buttons (e.g., for very large numbers, or when keyboard input is preferred). Making it opt-out (defaults to true) provides flexibility while maintaining sensible defaults.

2. **Avoids over-generic variants**: Rather than creating a `variant="stepper"` system, a simple boolean prop keeps the API surface small and explicit.

3. **Future-proofing**: If we later need other number input variants (e.g., with different button styles), we can extend without breaking changes.

### Why reuse IconButton?

1. **Design system consistency**: `IconButton` already provides the right visual style, sizing, and interaction states (hover, focus, disabled).

2. **Accessibility**: `IconButton` includes proper ARIA labels, keyboard support, and tooltip handling.

3. **Maintainability**: Reusing existing primitives reduces code duplication and ensures visual consistency across the design system.

## Storybook Story Structure

Add a new story under `Components/InputField`:

```typescript
export const Stepper: Story = {
  args: {
    type: 'number',
    label: 'Quantity',
    value: '0',
    min: 0,
    max: 100,
    step: 1,
    helperText: 'Select quantity between 0 and 100',
  },
  render: renderControlled,
};
```

This demonstrates the stepper behavior with controlled state, showing increment/decrement functionality, min/max constraints, and helper text.
