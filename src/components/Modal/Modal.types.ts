export type ModalSize = 'small' | 'medium' | 'large';

export type ModalFooterAlignment = 'left' | 'right';

export type ModalAction = {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
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
  /** Optional secondary action (e.g. Close) */
  secondaryAction?: ModalAction;
  /** Size affects max width of the dialog */
  size?: ModalSize;
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
