import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SearchField } from './SearchField';
import '../../styles/tokens.css';

const meta: Meta<typeof SearchField> = {
  title: 'Components/SearchField',
  component: SearchField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Accessibility

### Accessible Name
- Provide either \`label\` (visible) or \`aria-label\` (required when no visible label)
- The component automatically associates labels with search inputs using \`htmlFor\` and \`id\`

### Keyboard Navigation
- Fully keyboard accessible via native input behavior
- Focus ring appears on the search input (orange outline)
- Clear button and microphone button are keyboard accessible

### ARIA Attributes
- \`aria-invalid\` is automatically set when \`errorMessage\` is provided
- \`aria-required\` is set when \`required={true}\`
- \`aria-describedby\` links to helper text or error message

### Voice Recognition
- Uses Web Speech API for voice input
- Requires browser support and microphone permissions
- Automatically stops when user finishes speaking
        `,
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text displayed above the search field',
      table: {
        type: { summary: 'string' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Whether the search field is required',
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
      description: 'Current value of the search field (required)',
      table: {
        type: { summary: 'string' },
      },
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the search field',
      table: {
        type: { summary: 'string' },
      },
    },
    errorMessage: {
      control: 'text',
      description: 'Error message displayed below the search field (shows error state when provided)',
      table: {
        type: { summary: 'string' },
      },
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the search field is read-only',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    voiceLanguage: {
      control: 'text',
      description: 'Language code for voice recognition (e.g., "en-US", "nl-NL")',
      table: {
        defaultValue: { summary: "'en-US'" },
        type: { summary: 'string' },
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
type Story = StoryObj<typeof SearchField>;

const renderControlled: Story['render'] = (args) => {
  const [value, setValue] = useState(args.value || '');

  return (
    <div style={{ width: '400px' }}>
      <SearchField
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
        onVoiceStart={() => {
          console.log('Voice recognition started');
        }}
        onVoiceEnd={() => {
          console.log('Voice recognition ended');
        }}
        onVoiceError={(error) => {
          console.error('Voice recognition error:', error);
        }}
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    label: 'Label',
    required: false,
    placeholder: 'Search',
    value: '',
    helperText: 'Hint text',
    voiceLanguage: 'en-US',
  },
  render: renderControlled,
};
