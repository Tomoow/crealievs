import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal, type ModalProps } from './Modal';
import { Button } from '../Button';
import type { ModalSize, ModalFooterAlignment, ModalVariant } from './Modal.types';
import '../../styles/tokens.css';

type ModalStoryArgs = ModalProps & {
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
};

const meta: Meta<ModalStoryArgs> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    docs: {
      description: {
        component:
          'Use **Controls** to try states: `title`, `size`, `variant`, `footerAlignment`, `showCloseButton`, `primaryActionLabel`, `secondaryActionLabel`. Open via the trigger button; close via backdrop, Escape, or close button. No auto-focus on open (Tab moves focus into the modal). On mobile (<768px) the modal opens as a bottom sheet.',
      },
    },
  },
  argTypes: {
    title: { control: 'text', table: { defaultValue: { summary: 'Titel van het paneel' } } },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'] satisfies ModalSize[],
      table: { defaultValue: { summary: 'medium' } },
    },
    variant: {
      control: 'select',
      options: ['default', 'destructive'] satisfies ModalVariant[],
      description: 'Default (neutral) or destructive (primary action styled as destructive).',
      table: { defaultValue: { summary: 'default' } },
    },
    footerAlignment: {
      control: 'select',
      options: ['left', 'right'] satisfies ModalFooterAlignment[],
      table: { defaultValue: { summary: 'right' } },
    },
    showCloseButton: { control: 'boolean', table: { defaultValue: { summary: 'true' } } },
    primaryActionLabel: {
      control: 'text',
      description: 'Label for primary action (e.g. Bevestigen).',
      table: { defaultValue: { summary: 'Bevestigen' } },
    },
    secondaryActionLabel: {
      control: 'text',
      description: 'Label for secondary/cancel action (e.g. Sluiten). Rendered as tertiary button.',
      table: { defaultValue: { summary: 'Sluiten' } },
    },
  },
};

export default meta;

type Story = StoryObj<ModalStoryArgs>;

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.';

export const Default: Story = {
  args: {
    open: false,
    title: 'Titel van het paneel',
    size: 'medium',
    variant: 'default',
    footerAlignment: 'right',
    showCloseButton: true,
    primaryActionLabel: 'Bevestigen',
    secondaryActionLabel: 'Sluiten',
  },
  render: (args: ModalStoryArgs) => {
    const {
      primaryActionLabel,
      secondaryActionLabel,
      open: _openArg,
      primaryAction: _pa,
      secondaryAction: _sa,
      variant,
      ...modalProps
    } = args;
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal
          {...modalProps}
          variant={variant}
          open={open}
          onClose={() => setOpen(false)}
          primaryAction={
            primaryActionLabel
              ? { label: primaryActionLabel, onClick: () => setOpen(false) }
              : undefined
          }
          secondaryAction={
            secondaryActionLabel
              ? { label: secondaryActionLabel, onClick: () => setOpen(false) }
              : undefined
          }
        >
          <p>{lorem}</p>
          <p>{lorem}</p>
        </Modal>
      </>
    );
  },
};
