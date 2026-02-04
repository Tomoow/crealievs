/**
 * OrderCard types. Figma DS Order Card (nodes 852-162, 852-69, 852-71, 852-120).
 * Bar order card: incoming / preparing / done; edit mode with counters, Add, Save/Cancel.
 */
export type OrderCardState = 'incoming' | 'preparing' | 'done';

export type OrderCardItem = {
  id: string;
  name: string;
  quantity: number;
  /** Optional image URL for edit view (OrderListItem). */
  imageSrc?: string;
  /** Optional image alt for edit view. */
  imageAlt?: string;
};

export type OrderCardProps = {
  /** Card state: incoming (Start preparing), preparing (Mark as done), done (no actions, green time badge). */
  state: OrderCardState;
  /** Table or order identifier (e.g. "Table 1"). */
  tableName: string;
  /** Optional subtitle (e.g. "Trivia Titans"). */
  subtitle?: string;
  /** Order time string (e.g. "23:00"). Shown in top-right badge; green when state is 'done'. */
  orderTime: string;
  /** Order line items. */
  items: OrderCardItem[];
  /** When true, show editable list (counters), Add button, Save/Cancel. */
  isEditing?: boolean;
  /** Called when "Start preparing" is clicked (incoming only). */
  onStartPreparing?: () => void;
  /** Called when "Mark as done" is clicked (preparing only). */
  onMarkDone?: () => void;
  /** Called when edit (pencil) is clicked. Consumer should set isEditing true and optionally open add-item dropdown/sheet. */
  onEditClick?: () => void;
  /** Called when delete (trash) is clicked. */
  onDeleteClick?: () => void;
  /** Called when quantity changes in edit mode. (itemId, newQuantity) */
  onQuantityChange?: (itemId: string, quantity: number) => void;
  /** Called when "Add" is clicked in edit mode. Consumer opens dropdown (desktop) or bottom panel (mobile). */
  onAddItemClick?: () => void;
  /** Called when Save is clicked in edit mode. Consumer should persist and set isEditing false. */
  onSaveEdit?: () => void;
  /** Called when Cancel is clicked in edit mode. Consumer should revert and set isEditing false. */
  onCancelEdit?: () => void;
  /** Optional class name for the card root. */
  className?: string;
};
