import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';
import { Counter } from './Counter';
import '../../styles/tokens.css';

const meta: Meta<typeof Counter> = {
  title: 'Components/Counter',
  component: Counter,
  parameters: {
    docs: {
      description: {
        component:
          'Use **Controls** to try states: `value`, `min`, `max`, `step`, `disabled`. Decrement/increment buttons; center field is editable. On mobile the counter uses the same layout.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'number', min: -10, max: 100 },
      description: 'Current value',
      table: { defaultValue: { summary: '0' } },
    },
    min: {
      control: { type: 'number' },
      description: 'Minimum value (decrement disabled when at min)',
      table: { type: { summary: 'number' } },
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum value (increment disabled when at max)',
      table: { type: { summary: 'number' } },
    },
    step: {
      control: { type: 'number', min: 0.1, step: 0.1 },
      description: 'Step for increment/decrement',
      table: { defaultValue: { summary: '1' } },
    },
    disabled: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Counter>;

export const Default: Story = {
  args: {
    value: 0,
    min: 0,
    max: 10,
    step: 1,
    disabled: false,
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return (
      <div style={{ width: 'min(100%, 200px)' }}>
        <Counter {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};
