import type { Meta, StoryObj } from '@storybook/react';
import { FAB } from './FAB';
import { Plus, Trash2, Edit, Download } from 'lucide-react';
import '../../styles/tokens.css';

const meta: Meta<typeof FAB> = {
  title: 'Components/FAB',
  component: FAB,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/OHwR5VlI0xnvCfMisbHhQM/crealiev-ds?node-id=511-4734',
    },
  },
  argTypes: {
    icon: {
      control: 'select',
      options: ['Plus', 'Trash2', 'Edit', 'Download'],
      mapping: {
        'Plus': Plus,
        'Trash2': Trash2,
        'Edit': Edit,
        'Download': Download,
      },
      description: 'Lucide icon component to display',
    },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'tertiary'],
      description: 'Visual style variant of the FAB',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    state: {
      control: 'select',
      options: ['default', 'hover', 'active', 'disabled', 'focus'],
      description: 'Visual state of the FAB for demonstration purposes',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    destructive: {
      control: 'boolean',
      description: 'Whether the FAB represents a destructive action',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    position: {
      control: 'select',
      options: ['bottom-right', 'bottom-left', 'top-right', 'top-left', 'none'],
      description: 'Position for sticky/fixed positioning',
      table: {
        defaultValue: { summary: 'bottom-right' },
      },
    },
    offset: {
      control: 'object',
      description: 'Offset from the edge when using position',
      table: {
        defaultValue: { summary: '{ x: "1rem", y: "1rem" }' },
      },
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Button type attribute for form handling',
      table: {
        defaultValue: { summary: 'button' },
        type: { summary: "'button' | 'submit' | 'reset'" },
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler function. Standard React prop for handling button clicks.',
      table: {
        type: { summary: '(e: React.MouseEvent<HTMLButtonElement>) => void' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS class name for custom styling and animations',
      table: {
        type: { summary: 'string' },
      },
    },
    style: {
      control: 'object',
      description: 'Inline styles for custom animations and positioning',
      table: {
        type: { summary: 'React.CSSProperties' },
      },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessibility label for screen readers (required)',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FAB>;

export const Default: Story = {
  args: {
    icon: Plus,
    variant: 'primary',
    state: 'default',
    destructive: false,
    type: 'button',
    position: 'none',
    'aria-label': 'Add item',
  },
  render: (args) => {
    const IconComponent = typeof args.icon === 'string'
      ? (args.icon === 'Plus' ? Plus : args.icon === 'Trash2' ? Trash2 : args.icon === 'Edit' ? Edit : Download)
      : args.icon;
    return <FAB {...args} icon={IconComponent} />;
  },
};
