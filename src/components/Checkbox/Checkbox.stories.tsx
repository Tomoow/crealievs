import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Checkbox } from './Checkbox';
import '../../styles/tokens.css';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: `
## Accessibility

### Target Size
- Meets WCAG 2.5.8 AA with 24×24px minimum hit area

### Accessible Name
- Provide either \`label\` (visible) or \`ariaLabel\` (required when no visible label)
- The component will warn in development if neither is provided

### Keyboard Navigation
- Fully keyboard accessible via native checkbox behavior
- Focus ring appears on the checkbox
        `,
      },
    },
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    label: {
      control: 'text',
      description: 'Label text to display next to the checkbox',
      table: {
        type: { summary: 'string' },
      },
    },
    description: {
      control: 'text',
      description: 'Secondary descriptive text displayed below the primary label',
      table: {
        type: { summary: 'string' },
      },
    },
    showDescription: {
      control: 'boolean',
      description: 'Whether to show the description text',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label for screen readers (required when label is not provided)',
      table: {
        type: { summary: 'string' },
      },
    },
    state: {
      control: 'select',
      options: ['default', 'hover', 'focus', 'disabled'],
      description: 'Visual state of the checkbox',
      table: {
        defaultValue: { summary: 'default' },
      },
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
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    checked: false,
    label: 'Keuze',
    description: 'Extra informatie',
    showDescription: false,
    state: 'default',
  },
  render: (args) => {
    const [checked, setChecked] = useState(args.checked || false);
    
    // Sync state with args when args.checked changes
    React.useEffect(() => {
      if (args.checked !== undefined) {
        setChecked(args.checked);
      }
    }, [args.checked]);
    
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={(newChecked) => setChecked(newChecked)}
      />
    );
  },
};
