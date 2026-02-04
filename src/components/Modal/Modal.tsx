/**
 * Modal: overlay dialog with title, body, optional close button and footer actions.
 * Logic split into types, utils, hooks, keyboard.
 */
import React from 'react';
import { X } from 'lucide-react';
import { IconButton } from '../IconButton';
import { Button } from '../Button';
import type { ModalProps, ModalSize, ModalFooterAlignment, ModalVariant } from './Modal.types';
import { useIsMobile, useModalOpenEffects, useModalPresence } from './Modal.hooks';
import { useModalKeyboard } from './Modal.keyboard';
import './Modal.css';

export type { ModalProps } from './Modal.types';

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  primaryAction,
  secondaryAction,
  size = 'medium',
  variant = 'default',
  footerAlignment = 'right',
  showCloseButton = true,
  className = '',
  id,
  'aria-describedby': ariaDescribedBy,
}) => {
  const autoId = React.useId();
  const dialogId = id ?? `modal-${autoId}`;
  const titleId = `${dialogId}-title`;

  const dialogRef = React.useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { shouldRender, visible } = useModalPresence(open, isMobile);

  useModalOpenEffects({ open, dialogRef, onClose });
  const handleKeyDown = useModalKeyboard({ open, dialogRef, onClose });

  if (!shouldRender) return null;

  const hasFooter = primaryAction || secondaryAction;
  const primaryFirst = footerAlignment === 'right';
  const primaryDestructive = variant === 'destructive' ? primaryAction?.destructive ?? true : primaryAction?.destructive;
  const visibleClass = isMobile && visible ? ' modal__dialog--visible' : '';

  return (
    <>
      <div
        className="modal__backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        id={dialogId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={ariaDescribedBy}
        className={`modal__dialog modal__dialog--${size}${variant === 'destructive' ? ' modal__dialog--destructive' : ''}${visibleClass} ${className}`.trim()}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <header className="modal__header">
          <h2 id={titleId} className="modal__title">
            {title}
          </h2>
          {showCloseButton && (
            <div className="modal__close-wrap">
              <IconButton
                icon={X}
                variant="tertiary"
                size="small"
                onClick={onClose}
                aria-label="Close"
              />
            </div>
          )}
        </header>
        <div className="modal__body">{children}</div>
        {hasFooter && (
          <footer className={`modal__footer modal__footer--${footerAlignment}`}>
            {primaryFirst && primaryAction && (
              <Button
                variant={primaryAction.variant ?? 'primary'}
                destructive={primaryDestructive}
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant={secondaryAction.variant ?? 'tertiary'}
                destructive={secondaryAction.destructive}
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )}
            {!primaryFirst && primaryAction && (
              <Button
                variant={primaryAction.variant ?? 'primary'}
                destructive={primaryDestructive}
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </Button>
            )}
          </footer>
        )}
      </div>
    </>
  );
};
