/**
 * OrderList types. Figma DS Order List (nodes 856-701, 847-5136, 847-4512, 856-743).
 * OrderList = list container; OrderListItem = row with image, title, price/points, Counter; OrderListSummary = total + item count.
 */
import type { ReactNode } from 'react';

export type OrderListItemProps = {
  /** Product image URL. */
  imageSrc: string;
  /** Image alt text. */
  imageAlt: string;
  /** Product name (e.g. "Product"). */
  title: string;
  /** Optional badges row (e.g. Badge with icons + numbers) below the title. When provided, price/points line is not shown. */
  badges?: ReactNode;
  /** Optional icon (e.g. voucher/ticket) rendered before price. */
  priceIcon?: ReactNode;
  /** Price string (e.g. "10 bonnetjes" or "€ 4.5"); shown when badges is not provided. */
  price?: string;
  /** Optional points string (e.g. "10 pts"); shown after bullet when provided and badges is not used. */
  points?: string;
  /** Current quantity. */
  quantity: number;
  /** Called when quantity changes. */
  onQuantityChange: (value: number) => void;
  /** Min for Counter (default 0). */
  min?: number;
  /** Max for Counter. */
  max?: number;
  /** Disable the whole row (Counter disabled). */
  disabled?: boolean;
  /** Optional class name for the row. */
  className?: string;
};

export type OrderListSummaryProps = {
  /** Label (e.g. "Totaal"). */
  label: string;
  /** Optional badges row (e.g. Badge with icons + numbers) below the label. When provided, totalPrice/totalPoints line is not shown. */
  badges?: ReactNode;
  /** Optional icon (e.g. voucher/ticket) rendered before total price. */
  totalPriceIcon?: ReactNode;
  /** Total price string (e.g. "20 bonnetjes" or "€ 20"); shown when badges is not provided. */
  totalPrice?: string;
  /** Optional total points (e.g. "100 pts"); shown when badges is not used. */
  totalPoints?: string;
  /** Item count text (e.g. "10 items"); styled as primary blue, small heading. */
  itemCount: string;
  /** Optional class name for the root. */
  className?: string;
};

export type OrderListProps = {
  /** List items (OrderListItem or custom rows). */
  children: ReactNode;
  /** Optional class name for the list container. */
  className?: string;
};
