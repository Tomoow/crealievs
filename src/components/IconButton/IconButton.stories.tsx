import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';
import { Plus, Trash2, Edit, Download } from 'lucide-react';
import '../../styles/tokens.css';

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/OHwR5VlI0xnvCfMisbHhQM/crealiev-ds?node-id=120-2603',
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
      description: 'Visual style variant of the icon button',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'small'],
      description: 'Size of the icon button',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    state: {
      control: 'select',
      options: ['default', 'hover', 'active', 'disabled', 'focus'],
      description: 'Visual state of the icon button for demonstration purposes',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    destructive: {
      control: 'boolean',
      description: 'Whether the icon button represents a destructive action',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
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
      description: 'Additional CSS class name for custom styling',
      table: {
        type: { summary: 'string' },
      },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessibility label for screen readers (required)',
      table: {
        type: { summary: 'string' },
      },
    },
    tooltipVariant: {
      control: 'select',
      options: ['plain', 'rich'],
      description: 'Tooltip variant - plain for simple text, rich for title, body, and action',
      table: {
        defaultValue: { summary: 'plain' },
        type: { summary: "'plain' | 'rich'" },
      },
    },
    tooltipPosition: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Tooltip position relative to the button',
      table: {
        defaultValue: { summary: 'top' },
        type: { summary: "'top' | 'bottom' | 'left' | 'right'" },
      },
    },
    tooltipBody: {
      control: 'text',
      description: 'For rich tooltip: body text content',
      table: {
        type: { summary: 'string' },
      },
      if: { arg: 'tooltipVariant', eq: 'rich' },
    },
    tooltipButtonLabel: {
      control: 'text',
      description: 'For rich tooltip: button label text',
      table: {
        type: { summary: 'string' },
      },
      if: { arg: 'tooltipVariant', eq: 'rich' },
    },
    tooltipOnAction: {
      action: 'tooltipAction',
      description: 'For rich tooltip: action button click handler',
      table: {
        type: { summary: '() => void' },
      },
      if: { arg: 'tooltipVariant', eq: 'rich' },
    },
    tooltipShowButton: {
      control: 'boolean',
      description: 'For rich tooltip: whether to show the action button',
      table: {
        defaultValue: { summary: 'true' },
        type: { summary: 'boolean' },
      },
      if: { arg: 'tooltipVariant', eq: 'rich' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    icon: Plus,
    variant: 'default',
    size: 'default',
    state: 'default',
    destructive: false,
    type: 'button',
    'aria-label': 'Add item',
    tooltipVariant: 'plain',
    tooltipPosition: 'top',
    tooltipBody: 'This is a rich tooltip with additional information and an action button.',
    tooltipButtonLabel: 'Learn more',
    tooltipShowButton: true,
  },
  render: (args) => {
    const IconComponent = typeof args.icon === 'string'
      ? (args.icon === 'Plus' ? Plus : args.icon === 'Trash2' ? Trash2 : args.icon === 'Edit' ? Edit : Download)
      : args.icon;
    return <IconButton {...args} icon={IconComponent} />;
  },
};
