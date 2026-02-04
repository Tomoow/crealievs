import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ArrowRight } from 'lucide-react';
import { InlineAlert } from './InlineAlert';
import { Button } from '../Button';
import type { InlineAlertVariant, InlineAlertSize } from './InlineAlert.types';
import '../../styles/tokens.css';

type InlineAlertStoryArgs = ComponentProps<typeof InlineAlert> & {
  showAction?: boolean;
  actionLabel?: string;
};

const meta: Meta<InlineAlertStoryArgs> = {
  title: 'Components/InlineAlert',
  component: InlineAlert,
  parameters: {
    docs: {
      description: {
        component:
          'Full width. Left inner bar 0.625rem. Optional action (e.g. "Los op"). Mobile: icon → text → button. Use **Controls** for `variant`, `title`, `description`, `showAction`, `actionLabel`, `size`. Eight designs: 4 variants × with/without button.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'error', 'success', 'warning'] satisfies InlineAlertVariant[],
      table: { defaultValue: { summary: 'info' } },
    },
    title: {
      control: 'text',
      table: { defaultValue: { summary: 'Alert title' } },
    },
    description: {
      control: 'text',
      table: { defaultValue: { summary: 'Alert description' } },
    },
    showAction: {
      control: 'boolean',
      description: 'Show action button (e.g. Los op)',
      table: { defaultValue: { summary: 'false' } },
    },
    actionLabel: {
      control: 'text',
      description: 'Label for action button when showAction is true',
      table: { defaultValue: { summary: 'Los op' } },
    },
    size: {
      control: 'select',
      options: ['default', 'compact'] satisfies InlineAlertSize[],
      table: { defaultValue: { summary: 'default' } },
    },
  },
};

export default meta;

type Story = StoryObj<InlineAlertStoryArgs>;

export const Default: Story = {
  args: {
    variant: 'info',
    title: 'Alert title',
    description: 'Alert description',
    showAction: false,
    actionLabel: 'Los op',
    size: 'default',
  },
  render: (args) => {
    const { showAction, actionLabel, ...inlineAlertProps } = args;
    const action = showAction ? (
      <Button variant="secondary" showRightIcon iconRight={ArrowRight}>
        {actionLabel}
      </Button>
    ) : undefined;
    return (
      <div style={{ width: '100%' }}>
        <InlineAlert {...inlineAlertProps} action={action} />
      </div>
    );
  },
};
