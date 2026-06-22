import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OrderCard } from './index';
import { Modal } from '../Modal';
import type { OrderCardState, OrderCardItem } from './OrderCard.types';
import '../../styles/tokens.css';

const DELAY_SCENARIOS = {
  none: 0,
  achterstand: 6,
  dringend: 11,
} as const;

type DelayScenario = keyof typeof DELAY_SCENARIOS;

type OrderCardStoryArgs = {
  state?: OrderCardState;
  isEditing?: boolean;
  tableName?: string;
  subtitle?: string;
  orderTime?: string;
  /** Delay badge scenario: none, achterstand (≥5 min), or dringend (≥10 min). Only applies when state is incoming or preparing. */
  delayScenario?: DelayScenario;
};

const meta: Meta<OrderCardStoryArgs> = {
  title: 'Components/OrderCard',
  component: OrderCard,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/OHwR5VlI0xnvCfMisbHhQM/crealiev-ds?node-id=847-5156',
    },
    docs: {
      description: {
        component:
          'Bar order card: incoming (Start preparing), preparing (Mark as done, animated blue gradient), done (green time badge, no actions). Edit mode: counters, Add, Save/Cancel. Figma nodes 852-162, 852-69, 852-71, 852-120.',
      },
    },
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['incoming', 'preparing', 'done'] satisfies OrderCardState[],
      table: { defaultValue: { summary: 'incoming' } },
    },
    isEditing: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    tableName: {
      control: 'text',
      table: { defaultValue: { summary: 'Table 1' } },
    },
    subtitle: {
      control: 'text',
      table: { defaultValue: { summary: 'Trivia Titans' } },
    },
    orderTime: {
      control: 'text',
      table: { defaultValue: { summary: '23:00' } },
    },
    delayScenario: {
      control: 'select',
      options: ['none', 'achterstand', 'dringend'] as const,
      table: {
        description: 'Delay badge: none, achterstand (≥5 min), or dringend (≥10 min). Only when state is incoming or preparing.',
        defaultValue: { summary: 'none' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<OrderCardStoryArgs>;

const INITIAL_ITEMS: OrderCardItem[] = [
  { id: '1', name: 'Fourchette', quantity: 2 },
  { id: '2', name: 'Duvel', quantity: 2 },
  { id: '3', name: 'Pint', quantity: 2 },
  { id: '4', name: 'Cola', quantity: 2 },
];

export const Default: Story = {
  args: {
    state: 'incoming',
    isEditing: false,
    tableName: 'Table 1',
    subtitle: 'Trivia Titans',
    orderTime: '23:00',
    delayScenario: "achterstand"
  },
  render: (args) => {
    const {
      state: stateArg = 'incoming',
      isEditing: isEditingArg = false,
      tableName = 'Table 1',
      subtitle = 'Trivia Titans',
      orderTime = '23:00',
      delayScenario = 'none',
    } = args;
    const delayMinutes = DELAY_SCENARIOS[delayScenario];
    const orderCreatedAt =
      delayMinutes > 0 ? Date.now() - delayMinutes * 60 * 1000 : undefined;
    const [cardState, setCardState] = React.useState<OrderCardState>(stateArg);
    const [items, setItems] = React.useState<OrderCardItem[]>(INITIAL_ITEMS);
    const [editing, setEditing] = React.useState(isEditingArg);
    const [addModalOpen, setAddModalOpen] = React.useState(false);

    React.useEffect(() => {
      setCardState(stateArg);
    }, [stateArg]);
    React.useEffect(() => {
      setEditing(isEditingArg);
    }, [isEditingArg]);

    const handleQuantityChange = (itemId: string, quantity: number) => {
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
      );
    };
    const handleSaveEdit = () => {
      setItems((prev) => prev.filter((i) => i.quantity > 0));
      setEditing(false);
    };
    const handleCancelEdit = () => {
      setItems(INITIAL_ITEMS);
      setEditing(false);
    };

    return (
      <div style={{ width: '100%', maxWidth: 400 }}>
        <OrderCard
          state={cardState}
          tableName={tableName}
          subtitle={subtitle}
          orderTime={cardState === 'done' ? '23:05' : orderTime}
          orderCreatedAt={orderCreatedAt}
          items={items}
          isEditing={editing}
          onStartPreparing={() => setCardState('preparing')}
          onMarkDone={() => setCardState('done')}
          onUndoPreparing={() => setCardState('incoming')}
          onEditClick={() => setEditing(true)}
          onDeleteClick={() => {}}
          onQuantityChange={handleQuantityChange}
          onAddItemClick={() => setAddModalOpen(true)}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
        />
        <Modal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          title="Add item"
          primaryAction={{ label: 'Close', onClick: () => setAddModalOpen(false) }}
        >
          <p style={{ margin: 0 }}>
            In your app, use a dropdown (desktop) or bottom panel (mobile) to select an item to add to the order.
          </p>
        </Modal>
      </div>
    );
  },
};
