import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';
import { SegmentedButtons, type SegmentedButtonsProps, type SegmentOption } from './SegmentedButtons';
import { FileText } from 'lucide-react';
import '../../styles/tokens.css';

const meta: Meta<SegmentedButtonsProps> = {
  title: 'Components/SegmentedButtons',
  component: SegmentedButtons,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/OHwR5VlI0xnvCfMisbHhQM/crealiev-ds?node-id=67-350',
    },
    docs: {
      description: {
        component:
          'Single-select group built from segment instances (icon + label). Use **Controls** to try `value`, `size`, and option labels.',
      },
    },
  },
  argTypes: {
    value: {
      control: 'select',
      options: [null, 'segment-1', 'segment-2', 'segment-3'],
      description: 'Currently selected value',
      table: { type: { summary: 'string | null' } },
    },
    size: {
      control: 'select',
      options: ['default', 'small'],
      table: { defaultValue: { summary: 'default' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name for the group',
    },
  },
};

export default meta;

type Story = StoryObj<SegmentedButtonsProps>;

const defaultOptions: SegmentOption[] = [
  { value: 'segment-1', label: 'Segment 1', icon: FileText },
  { value: 'segment-2', label: 'Segment 2', icon: FileText },
  { value: 'segment-3', label: 'Segment 3', icon: FileText },
];

export const Default: Story = {
  args: {
    options: defaultOptions,
    value: 'segment-1',
    size: 'default',
    'aria-label': 'Choose segment',
  },
  render: (args) => {
    const [value, setValue] = useState<string | null>(args.value ?? 'segment-1');
    useEffect(() => {
      setValue(args.value ?? 'segment-1');
    }, [args.value]);
    return (
      <SegmentedButtons
        {...args}
        value={value}
        onChange={(v) => setValue(v)}
      />
    );
  },
};
