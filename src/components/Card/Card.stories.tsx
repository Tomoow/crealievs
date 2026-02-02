import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../Button';
import { Smartphone } from 'lucide-react';
import '../../styles/tokens.css';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Card with icon (bg fill) top left, title and subtitle, optional 3-dot actions top right, subtext, and optional footer (e.g. two buttons). Use **Controls** to try options.',
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    subtext: { control: 'text' },
    onActionsClick: { action: 'actionsClicked', description: 'When set, shows 3-dot button; fired when clicked.' },
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

const defaultSubtext =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

export const Default: Story = {
  args: {
    title: 'Titel',
    subtitle: 'Ondertitel',
    subtext: defaultSubtext,
    icon: <Smartphone size={20} strokeWidth={1.5} />,
    onActionsClick: () => {},
    footer: [
      <Button key="cancel" variant="secondary" size="small">
        Annuleren
      </Button>,
      <Button key="confirm" variant="primary" size="small">
        Bevestigen
      </Button>,
    ],
  },
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <Card
        title={args.title}
        subtitle={args.subtitle}
        subtext={args.subtext}
        icon={args.icon ?? <Smartphone size={20} strokeWidth={1.5} />}
        onActionsClick={args.onActionsClick}
        footer={args.footer}
        className={args.className}
      />
    </div>
  ),
};
