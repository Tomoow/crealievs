export type ModalSize = 'small' | 'medium' | 'large';

export type ModalFooterAlignment = 'left' | 'right';

/** Modal variant: default (neutral) or destructive (primary action styled as destructive). */
export type ModalVariant = 'default' | 'destructive';

export type ModalAction = {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  /** Whether the button represents a destructive action (e.g. Delete) */
  destructive?: boolean;
};

import type { ReactNode } from 'react';

export type ModalProps = {
  /** Whether the modal is open */
  open: boolean;
  /** Called when the modal should close (backdrop click, Escape, close button) */
  onClose: () => void;
  /** Title shown in the header */
  title: string;
  /** Main content */
  children: ReactNode;
  /** Optional primary action (e.g. Confirm) */
  primaryAction?: ModalAction;
  /** Optional secondary action (e.g. Sluiten/Cancel); rendered as tertiary button by default */
  secondaryAction?: ModalAction;
  /** Size affects max width of the dialog */
  size?: ModalSize;
  /** Variant: default (neutral) or destructive (primary action shown as destructive, e.g. Delete). */
  variant?: ModalVariant;
  /** Alignment of footer buttons */
  footerAlignment?: ModalFooterAlignment;
  /** Whether to show the close (X) button in the header */
  showCloseButton?: boolean;
  /** Optional class name for the dialog container */
  className?: string;
  /** Id for the dialog element (for aria-labelledby) */
  id?: string;
  /** Optional id for the description element (aria-describedby) */
  'aria-describedby'?: string;
};
