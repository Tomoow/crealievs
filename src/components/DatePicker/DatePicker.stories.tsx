import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DatePicker, type DatePickerProps } from './DatePicker';
import '../../styles/tokens.css';

/** Story-only arg: initial value for controlled state. Not passed to DatePicker. */
type InitialValueOption = 'empty' | 'today' | '2026-06-25';
type DatePickerStoryArgs = DatePickerProps & { initialValue?: InitialValueOption };

const meta: Meta<DatePickerStoryArgs> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Use **Controls** to try states: \`errorMessage\`, \`disabled\`, \`readOnly\`, \`initialValue\`.

**Mobile:** Calendar only, centered, hugs content; dark blurred backdrop; close via backdrop tap or Escape. **Desktop:** Floating popover. **fullWidth:** On mobile the input fills; set to also fill on desktop.
        `,
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    required: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    placeholder: { control: 'text', table: { defaultValue: { summary: 'dd/mm/yyyy' } } },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    disabled: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    readOnly: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    fullWidth: {
      control: 'boolean',
      description: 'On mobile the input already fills the container. When true, also fill on desktop (no max-width).',
      table: { defaultValue: { summary: 'false' } },
    },
    initialValue: {
      control: 'select',
      options: ['empty', 'today', '2026-06-25'] satisfies InitialValueOption[],
      description: 'Initial value for the story (empty, today, or a fixed date).',
      table: { type: { summary: 'empty | today | 2026-06-25' } },
    },
  },
};

export default meta;

type Story = StoryObj<DatePickerStoryArgs>;

function parseInitialValue(v: InitialValueOption | null | undefined): Date | null {
  if (!v || v === 'empty') return null;
  if (v === 'today') return new Date();
  const [y, m, d] = v.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export const Default: Story = {
  args: {
    label: 'Label',
    required: false,
    placeholder: 'dd/mm/yyyy',
    helperText: 'Select a date',
    errorMessage: '',
    disabled: false,
    readOnly: false,
    fullWidth: false,
    initialValue: 'empty',
  },
  render: (args: DatePickerStoryArgs) => {
    const { initialValue, ...datePickerProps } = args;
    const initial = parseInitialValue(initialValue);
    const [value, setValue] = useState<Date | null>(initial);
    /* Simulate page: 16px horizontal margin so input fills available space on mobile. */
    return (
      <div
        key={initialValue ?? 'empty'}
        style={{
          width: '100%',
          maxWidth: '36rem',
          minWidth: 0,
          paddingInline: 'var(--screen-margin-mobile)',
          boxSizing: 'border-box',
        }}
      >
        <DatePicker
          {...datePickerProps}
          value={value}
          onChange={(date) => setValue(date)}
        />
      </div>
    );
  },
};
