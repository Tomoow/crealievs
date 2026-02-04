import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import { Circle, Minus, Plus, Info, CheckCircle2, AlertCircle, X, Flame } from 'lucide-react';
import '../../styles/tokens.css';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {},
  argTypes: {
    children: {
      control: 'text',
      description: 'The content to display inside the badge',
    },
    variant: {
      control: 'select',
      options: ['default', 'neutral', 'pending', 'info', 'success', 'warning', 'error', 'hot'],
      description: 'Visual style variant of the badge',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size of the badge',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    showIcon: {
      control: 'boolean',
      description: 'Show an icon before the badge text',
      table: {
        defaultValue: { summary: 'true' },
        type: { summary: 'boolean' },
      },
    },
    icon: {
      control: 'select',
      options: ['Circle', 'Minus', 'Plus', 'Info', 'CheckCircle2', 'AlertCircle', 'X', 'Flame'],
      mapping: {
        'Circle': Circle,
        'Minus': Minus,
        'Plus': Plus,
        'Info': Info,
        'CheckCircle2': CheckCircle2,
        'AlertCircle': AlertCircle,
        'X': X,
        'Flame': Flame,
      },
      description: 'Lucide icon component to display. Only used when showIcon is true. Defaults based on variant if not provided.',
      table: {
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
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
    size: 'default',
    showIcon: true,
  },
  render: (args) => {
    // Handle the icon mapping from the control
    const iconMap: Record<string, typeof Circle> = {
      'Circle': Circle,
      'Minus': Minus,
      'Plus': Plus,
      'Info': Info,
      'CheckCircle2': CheckCircle2,
      'AlertCircle': AlertCircle,
      'X': X,
      'Flame': Flame,
    };
    const IconComponent = typeof args.icon === 'string' ? iconMap[args.icon] : args.icon;
    return <Badge {...args} icon={IconComponent} />;
  },
};
