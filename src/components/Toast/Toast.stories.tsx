import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Toast } from './Toast';
import { Button } from '../Button';
import type { ToastVariant } from './Toast.types';
import '../../styles/tokens.css';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/OHwR5VlI0xnvCfMisbHhQM/crealiev-ds?node-id=278-12655',
    },
    docs: {
      description: {
        component:
          'Fixed bottom-right toast. Error/success/warning/info with icon, message, and countdown progress bar. Auto-dismiss after duration; timer pauses on hover. Use **Controls** for `message`, `variant`, `durationMs`. Click the button to show a toast.',
      },
    },
  },
  argTypes: {
    message: {
      control: 'text',
      description: 'Message text shown in the toast',
      table: { defaultValue: { summary: '—' } },
    },
    variant: {
      control: 'select',
      options: ['error', 'success', 'warning', 'info'] satisfies ToastVariant[],
      table: { defaultValue: { summary: 'error' } },
    },
    durationMs: {
      control: 'number',
      description: 'Auto-dismiss duration in ms; progress bar fills over this time',
      table: { defaultValue: { summary: '5000' } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: {
    message: 'Something went wrong. Please try again.',
    variant: 'error',
    durationMs: 5000,
  },
  render: (args) => {
    const [show, setShow] = useState(false);
    return (
      <>
        <Button variant="primary" onClick={() => setShow(true)}>
          Show toast
        </Button>
        {show && (
          <Toast
            {...args}
            onDismiss={() => setShow(false)}
          />
        )}
      </>
    );
  },
};
