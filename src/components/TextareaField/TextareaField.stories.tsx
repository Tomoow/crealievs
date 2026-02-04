import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TextareaField } from './TextareaField';
import { Search, Mail, Lock, User } from 'lucide-react';
import '../../styles/tokens.css';

const meta: Meta<typeof TextareaField> = {
  title: 'Components/TextareaField',
  component: TextareaField,
  parameters: {
    docs: {
      description: {
        component: `
## Accessibility

### Accessible Name
- Provide either \`label\` (visible) or \`aria-label\` (required when no visible label)
- The component automatically associates labels with textareas using \`htmlFor\` and \`id\`

### Keyboard Navigation
- Fully keyboard accessible via native textarea behavior
- Focus ring appears on the textarea (orange outline)

### ARIA Attributes
- \`aria-invalid\` is automatically set when \`errorMessage\` is provided
- \`aria-required\` is set when \`required={true}\`
- \`aria-describedby\` links to helper text or error message
        `,
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text displayed above the textarea',
      table: {
        type: { summary: 'string' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Whether the textarea is required',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
      table: {
        type: { summary: 'string' },
      },
    },
    value: {
      control: 'text',
      description: 'Current value of the textarea (required)',
      table: {
        type: { summary: 'string' },
      },
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the textarea',
      table: {
        type: { summary: 'string' },
      },
    },
    leftIcon: {
      control: 'select',
      options: ['Search', 'Mail', 'Lock', 'User', 'None'],
      mapping: {
        'Search': Search,
        'Mail': Mail,
        'Lock': Lock,
        'User': User,
        'None': undefined,
      },
      description: 'Left icon displayed at the top left of the textarea',
      table: {
        type: { summary: 'LucideIcon' },
      },
    },
    errorMessage: {
      control: 'text',
      description: 'Error message displayed below the textarea (shows error state when provided)',
      table: {
        type: { summary: 'string' },
      },
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the textarea is read-only',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    rows: {
      control: 'number',
      description: 'Number of visible text lines',
      table: {
        defaultValue: { summary: '4' },
        type: { summary: 'number' },
      },
    },
    resize: {
      control: 'select',
      options: ['none', 'both', 'horizontal', 'vertical'],
      description: 'How the textarea can be resized',
      table: {
        defaultValue: { summary: 'vertical' },
        type: { summary: "'none' | 'both' | 'horizontal' | 'vertical'" },
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
type Story = StoryObj<typeof TextareaField>;

const renderControlled: Story['render'] = (args) => {
  const [value, setValue] = useState(args.value || '');

  return (
    <div style={{ width: '400px' }}>
      <TextareaField
        {...args}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          args.onChange?.(e);
        }}
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    label: 'Label',
    required: false,
    placeholder: 'Placeholder text',
    value: '',
    helperText: 'Hint text',
    rows: 4,
    resize: 'vertical',
  },
  render: renderControlled,
};
