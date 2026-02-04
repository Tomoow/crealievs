import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Tooltip } from './Tooltip';
import { Info } from 'lucide-react';
import '../../styles/tokens.css';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component: `
## Accessibility

Tooltips provide additional context for interactive elements. They appear on hover or focus and disappear when the user moves away.

### Keyboard Navigation
- Tooltips appear on focus for keyboard users
- Tooltips disappear on blur
- Use \`aria-label\` on the trigger element for screen readers

### Best Practices
- Keep tooltip content concise
- Use tooltips for supplementary information, not critical content
- Ensure the trigger element is keyboard accessible
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['plain', 'rich'],
      description: 'Variant of the tooltip - plain for simple text, rich for title, body, and action',
      table: {
        defaultValue: { summary: 'plain' },
        type: { summary: 'TooltipVariant' },
      },
    },
    title: {
      control: 'text',
      description: 'The text content for plain tooltip, or title for rich tooltip',
      table: {
        type: { summary: 'string' },
      },
    },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Position of the tooltip relative to the trigger element',
      table: {
        defaultValue: { summary: 'top' },
        type: { summary: 'TooltipPosition' },
      },
    },
    body: {
      control: 'text',
      description: 'For rich tooltip: body text content',
      table: {
        type: { summary: 'string' },
      },
      if: { arg: 'variant', eq: 'rich' },
    },
    buttonLabel: {
      control: 'text',
      description: 'For rich tooltip: button label text',
      table: {
        type: { summary: 'string' },
      },
      if: { arg: 'variant', eq: 'rich' },
    },
    onAction: {
      action: 'onAction',
      description: 'For rich tooltip: button click handler',
      table: {
        type: { summary: '() => void' },
      },
      if: { arg: 'variant', eq: 'rich' },
    },
    showButton: {
      control: 'boolean',
      description: 'For rich tooltip: whether to show the action button',
      table: {
        defaultValue: { summary: 'true' },
        type: { summary: 'boolean' },
      },
      if: { arg: 'variant', eq: 'rich' },
    },
    className: {
      control: 'text',
      description: 'Additional CSS class name for custom styling',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    variant: 'plain',
    title: 'Plain tooltip',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    buttonLabel: 'Bevestigen',
    showButton: true,
    position: 'top',
  },
  render: (args) => (
    <Tooltip {...args}>
      <button
        type="button"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          border: '1px solid var(--border-default-default)',
          backgroundColor: 'var(--bg-neutral-default)',
          cursor: 'pointer',
          padding: 0,
        }}
        aria-label="Information"
      >
        <Info size={20} />
      </button>
    </Tooltip>
  ),
};
