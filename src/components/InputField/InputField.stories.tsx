import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { InputField } from './InputField';
import { Search, Mail, Lock, User } from 'lucide-react';
import '../../styles/tokens.css';

const meta: Meta<typeof InputField> = {
  title: 'Components/InputField',
  component: InputField,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/OHwR5VlI0xnvCfMisbHhQM/crealiev-ds?node-id=48-176',
    },
    docs: {
      description: {
        component: `
## Accessibility

### Accessible Name
- Provide either \`label\` (visible) or \`aria-label\` (required when no visible label)
- The component automatically associates labels with inputs using \`htmlFor\` and \`id\`

### Keyboard Navigation
- Fully keyboard accessible via native input behavior
- Focus ring appears on the input (orange outline)

### ARIA Attributes
- \`aria-invalid\` is automatically set when \`errorMessage\` is provided
- \`aria-required\` is set when \`required={true}\`
- \`aria-describedby\` links to helper text or error message
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'url', 'tel', 'search', 'number'],
      description: 'Input type',
      table: {
        defaultValue: { summary: 'text' },
        type: { summary: 'InputFieldType' },
      },
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the input',
      table: {
        type: { summary: 'string' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Whether the input is required',
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
      description: 'Current value of the input (required)',
      table: {
        type: { summary: 'string' },
      },
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the input',
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
      description: 'Left icon displayed inside the input',
      table: {
        type: { summary: 'LucideIcon' },
      },
    },
    errorMessage: {
      control: 'text',
      description: 'Error message displayed below the input (shows error state when provided)',
      table: {
        type: { summary: 'string' },
      },
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the input is read-only',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
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
type Story = StoryObj<typeof InputField>;

const renderControlled: Story['render'] = (args) => {
  const [value, setValue] = useState(args.value || '');

  return (
    <div style={{ width: '300px' }}>
      <InputField
        {...args}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          args.onChange?.(e);
        }}
        onClear={
          args.onClear
            ? () => {
                setValue('');
                args.onClear?.();
              }
            : undefined
        }
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    type: 'text',
    label: 'Label',
    required: false,
    placeholder: 'Placeholder text',
    value: '',
    helperText: 'Hint text',
  },
  render: renderControlled,
};