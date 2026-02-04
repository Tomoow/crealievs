import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Ticket, Award } from 'lucide-react';
import { OrderList, OrderListItem, OrderListSummary } from './index';
import { Badge } from '../Badge';
import '../../styles/tokens.css';

type OrderListStoryArgs = {
  useBadges?: boolean;
  itemCount?: number;
  showSummary?: boolean;
  summaryLabel?: string;
  summaryItemCount?: string;
};

const meta: Meta<OrderListStoryArgs> = {
  title: 'Components/OrderList',
  component: OrderList,
  parameters: {
    docs: {
      description: {
        component:
          'Order list with items (image, title, badges or price • points, Counter) and optional summary (label, badges or total • points, item count in primary blue). Screenshot layout: badges with icons below title and below "Totaal". Use **Controls** for useBadges, item count, summary visibility. Figma nodes 856-701, 847-5136, 847-4512, 856-743.',
      },
    },
  },
  argTypes: {
    useBadges: {
      control: 'boolean',
      description: 'Use badges with icons (screenshot layout) instead of price • points text',
      table: { defaultValue: { summary: 'true' } },
    },
    itemCount: {
      control: { type: 'number', min: 1, max: 5 },
      description: 'Number of sample items',
      table: { defaultValue: { summary: '2' } },
    },
    showSummary: {
      control: 'boolean',
      description: 'Show OrderListSummary below the list',
      table: { defaultValue: { summary: 'true' } },
    },
    summaryLabel: {
      control: 'text',
      table: { defaultValue: { summary: 'Totaal' } },
    },
  },
};

export default meta;

type Story = StoryObj<OrderListStoryArgs>;

/* Per-unit values for summary totals (tickets and points per item quantity) */
const TICKETS_PER_UNIT = 5;
const POINTS_PER_UNIT = 10;

const SAMPLE_ITEMS = [
  { title: 'Product', imageAlt: 'Product' },
  { title: 'Product two', imageAlt: 'Product two' },
  { title: 'Product three', imageAlt: 'Product three' },
];

export const Default: Story = {
  args: {
    useBadges: true,
    itemCount: 2,
    showSummary: true,
    summaryLabel: 'Totaal',
  },
  render: (args) => {
    const {
      useBadges = true,
      itemCount = 2,
      showSummary = true,
      summaryLabel = 'Totaal',
    } = args;
    const items = SAMPLE_ITEMS.slice(0, Math.min(itemCount, SAMPLE_ITEMS.length));
    const itemBadges = (
      <>
        <Badge variant="info" icon={Ticket} size="small">
          {TICKETS_PER_UNIT}
        </Badge>
        <Badge variant="default" icon={Award} size="small">
          {POINTS_PER_UNIT}
        </Badge>
      </>
    );
    const OrderListWithState: React.FC = () => {
      const [quantities, setQuantities] = React.useState<number[]>(
        items.map((_, i) => (i === 0 ? 0 : 2))
      );
      const totalItems = quantities.reduce((sum, q) => sum + q, 0);
      const totalTickets = quantities.reduce((sum, q) => sum + q * TICKETS_PER_UNIT, 0);
      const totalPoints = quantities.reduce((sum, q) => sum + q * POINTS_PER_UNIT, 0);
      const summaryBadges = (
        <>
          <Badge variant="info" icon={Ticket} size="small">
            {totalTickets}
          </Badge>
          <Badge variant="default" icon={Award} size="small">
            {totalPoints}
          </Badge>
        </>
      );
      return (
        <div style={{ width: '100%', maxWidth: 480 }}>
          <OrderList>
            {items.map((item, i) => (
              <OrderListItem
                key={i}
                imageSrc="https://placehold.co/48x48/f2f4f7/606073?text=•"
                imageAlt={item.imageAlt}
                title={item.title}
                badges={useBadges ? itemBadges : undefined}
                price={useBadges ? undefined : '€ 4.5'}
                points={useBadges ? undefined : '10 pts'}
                quantity={quantities[i] ?? 0}
                onQuantityChange={(v) => {
                  const next = [...quantities];
                  next[i] = v;
                  setQuantities(next);
                }}
                min={0}
              />
            ))}
          </OrderList>
          {showSummary && (
            <OrderListSummary
              label={summaryLabel}
              badges={useBadges ? summaryBadges : undefined}
              totalPrice={useBadges ? undefined : '€ 20'}
              totalPoints={useBadges ? undefined : '100 pts'}
              itemCount={`${totalItems} items`}
            />
          )}
        </div>
      );
    };
    return <OrderListWithState />;
  },
};
