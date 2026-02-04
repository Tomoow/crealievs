import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Plus, ArrowRight, Download, Save, Trash2 } from 'lucide-react';
import '../../styles/tokens.css';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {},
  argTypes: {
    children: {
      control: 'text',
      description: 'The content to display inside the button',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'link', 'ghost', 'simple'],
      description: 'Visual style variant of the button',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'small'],
      description: 'Size of the button',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    state: {
      control: 'select',
      options: ['default', 'hover', 'active', 'disabled', 'focus'],
      description: 'Visual state of the button for demonstration purposes',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    destructive: {
      control: 'boolean',
      description: 'Whether the button represents a destructive action',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    showLeftIcon: {
      control: 'boolean',
      description: 'Show an icon before the button text',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    iconLeft: {
      control: 'select',
      options: ['Plus', 'Download', 'Save', 'Trash2'],
      mapping: {
        'Plus': Plus,
        'Download': Download,
        'Save': Save,
        'Trash2': Trash2,
      },
      description: 'Lucide icon component to display on the left. Only used when showLeftIcon is true.',
      table: {
        type: { summary: 'LucideIcon' },
      },
      if: { arg: 'showLeftIcon', eq: true },
    },
    showRightIcon: {
      control: 'boolean',
      description: 'Show an icon after the button text',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    iconRight: {
      control: 'select',
      options: ['ArrowRight', 'Download', 'Save'],
      mapping: {
        'ArrowRight': ArrowRight,
        'Download': Download,
        'Save': Save,
      },
      description: 'Lucide icon component to display on the right. Only used when showRightIcon is true.',
      table: {
        type: { summary: 'LucideIcon' },
      },
      if: { arg: 'showRightIcon', eq: true },
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Button type attribute',
      table: {
        defaultValue: { summary: 'button' },
      },
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
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'default',
    state: 'default',
    destructive: false,
    showLeftIcon: false,
    showRightIcon: false,
    type: 'button',
  },
  render: (args) => {
    const LeftIconComponent = typeof args.iconLeft === 'string'
      ? (args.iconLeft === 'Plus' ? Plus : args.iconLeft === 'Download' ? Download : args.iconLeft === 'Save' ? Save : Trash2)
      : args.iconLeft;
    const RightIconComponent = typeof args.iconRight === 'string'
      ? (args.iconRight === 'ArrowRight' ? ArrowRight : args.iconRight === 'Download' ? Download : Save)
      : args.iconRight;
    return <Button {...args} iconLeft={LeftIconComponent} iconRight={RightIconComponent} />;
  },
};
