import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { DropdownField, DropdownFieldOption, DropdownFieldMultiValue } from './DropdownField';
import '../../styles/tokens.css';

const options: DropdownFieldOption[] = [
  { value: 'keuze', label: 'Keuze' },
  { value: 'keuze-1', label: 'Keuze' },
  { value: 'keuze-2', label: 'Keuze' },
  { value: 'keuze-3', label: 'Keuze' },
];

const _optionsWithIcons: DropdownFieldOption[] = [
  { value: 'keuze', label: 'Keuze', icon: MapPin },
  { value: 'keuze-1', label: 'Keuze' },
  { value: 'keuze-2', label: 'Keuze' },
  { value: 'keuze-3', label: 'Keuze' },
];

const meta: Meta<typeof DropdownField> = {
  title: 'Components/DropdownField',
  component: DropdownField,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/OHwR5VlI0xnvCfMisbHhQM/crealiev-ds?node-id=92-377',
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text displayed above the field',
      table: {
        type: { summary: 'string' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no value is selected',
      table: {
        type: { summary: 'string' },
      },
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the field',
      table: {
        type: { summary: 'string' },
      },
    },
    errorMessage: {
      control: 'text',
      description: 'Error message displayed below the field (shows error state when provided)',
      table: {
        type: { summary: 'string' },
      },
    },
    leftIcon: {
      control: 'select',
      options: ['MapPin', 'None'],
      mapping: {
        MapPin,
        None: undefined,
      },
      description: 'Optional leading icon displayed inside the field',
      table: {
        type: { summary: 'LucideIcon' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the field is read-only',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    showSelectAll: {
      control: 'boolean',
      description: 'Whether to show "Select all" option at the top (only for multi-select)',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    options: {
      control: false,
      table: {
        type: { summary: 'DropdownFieldOption[]' },
      },
    },
    value: {
      control: false,
    },
    onChange: {
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof DropdownField>;

const renderSingle: Story['render'] = (args) => {
  const [value, setValue] = useState<string | null>(args.value as string | null);

  return (
    <div style={{ width: '328px' }}>
      <DropdownField
        {...args}
        multiple={false}
        value={value}
        onChange={(next) => {
          setValue(next);
          (args as any).onChange?.(next);
        }}
      />
    </div>
  );
};

const renderMulti: Story['render'] = (args) => {
  const [value, setValue] = useState<DropdownFieldMultiValue>(
    (args.value as DropdownFieldMultiValue) ?? [],
  );

  return (
    <div style={{ width: '328px' }}>
      <DropdownField
        {...args}
        multiple
        value={value}
        onChange={(next) => {
          setValue(next);
          (args as any).onChange?.(next);
        }}
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    label: 'Label',
    placeholder: 'Maak een keuze',
    helperText: 'Dit is hint text',
    options,
    value: null,
  },
  argTypes: {
    multiple: {
      control: false,
      table: {
        disable: true,
      },
    },
    showSelectAll: {
      control: false,
      table: {
        disable: true,
      },
    },
  },
  render: renderSingle,
};

export const MultiSelect: Story = {
  args: {
    label: 'Label',
    placeholder: 'Maak een keuze',
    helperText: 'Selecteer één of meerdere opties',
    showSelectAll: true,
    options,
    value: [] as DropdownFieldMultiValue,
  },
  argTypes: {
    multiple: {
      control: false,
      table: {
        disable: true,
      },
    },
  },
  render: renderMulti,
};

