import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Tag } from './Tag';
import { Calendar, Check, Star } from 'lucide-react';
import '../../styles/tokens.css';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  parameters: {},
  argTypes: {
    children: {
      control: 'text',
      description: 'The content to display inside the tag',
    },
    state: {
      control: 'select',
      options: ['default', 'hover', 'pressed', 'focus'],
      description: 'Visual state of the tag for demonstration purposes',
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: "'default' | 'hover' | 'pressed' | 'focus'" },
      },
    },
    selected: {
      control: 'boolean',
      description: 'Whether the tag is in selected state',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    showIcon: {
      control: 'boolean',
      description: 'Show an icon before the tag text (always on the left). When selected is true, this is always true and the Check icon is always shown.',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
      if: { arg: 'selected', eq: false },
    },
    icon: {
      control: 'select',
      options: ['Calendar', 'Check', 'Star'],
      mapping: {
        'Calendar': Calendar,
        'Check': Check,
        'Star': Star,
      },
      description: 'Lucide icon component to display. Only used when showIcon is true and selected is false. When selected is true, this is ignored and Check icon is always used.',
      table: {
        defaultValue: { summary: 'Calendar' },
        type: { summary: 'LucideIcon' },
      },
      if: { arg: 'showIcon', eq: true },
    },
    className: {
      control: 'text',
      description: 'Additional CSS class name for custom styling. Use sparingly - prefer design tokens and component props.',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {
    children: 'Tag',
    selected: false,
    showIcon: true,
    icon: 'Calendar',
    state: 'default',
  },
  render: (args) => {
    const [selected, setSelected] = React.useState(args.selected || false);
    
    // Sync selected state with args
    React.useEffect(() => {
      if (args.selected !== undefined) {
        setSelected(args.selected);
      }
    }, [args.selected]);
    
    const IconComponent = typeof args.icon === 'string' 
      ? (args.icon === 'Calendar' ? Calendar : args.icon === 'Check' ? Check : Star)
      : args.icon;
    
    return (
      <Tag 
        {...args} 
        icon={IconComponent}
        selected={selected}
        onClick={() => setSelected(!selected)}
      />
    );
  },
};
