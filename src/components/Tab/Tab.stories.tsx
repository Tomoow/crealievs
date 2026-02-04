import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';
import { Tab, type TabProps, type TabOption } from './Tab';
import '../../styles/tokens.css';

const meta: Meta<TabProps> = {
  title: 'Components/Tab',
  component: Tab,
  parameters: {
    docs: {
      description: {
        component:
          'Single-select tab list. Figma 67:580 (underline), 67:581 (pill). Use **Controls** to try `value`, `variant`, and tab labels.',
      },
    },
  },
  argTypes: {
    value: {
      control: 'select',
      options: [null, 'tab-1', 'tab-2', 'tab-3', 'tab-4', 'tab-5'],
      description: 'Currently selected tab',
      table: { type: { summary: 'string | null' } },
    },
    variant: {
      control: 'select',
      options: ['underline', 'pill'],
      table: { defaultValue: { summary: 'underline' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name for the tab list',
    },
  },
};

export default meta;

type Story = StoryObj<TabProps>;

const defaultTabs: TabOption[] = [
  { value: 'tab-1', label: 'Tab 1' },
  { value: 'tab-2', label: 'Tab 2' },
  { value: 'tab-3', label: 'Tab 3' },
  { value: 'tab-4', label: 'Tab 4' },
  { value: 'tab-5', label: 'Tab 5' },
];

export const Default: Story = {
  args: {
    tabs: defaultTabs,
    value: 'tab-1',
    variant: 'underline',
    'aria-label': 'Tabs',
  },
  render: (args) => {
    const [value, setValue] = useState<string | null>(args.value ?? 'tab-1');
    useEffect(() => {
      setValue(args.value ?? 'tab-1');
    }, [args.value]);
    return (
      <Tab
        {...args}
        value={value}
        onChange={(v) => setValue(v)}
      />
    );
  },
};
