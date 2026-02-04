/**
 * InlineAlert: status alert with icon, title, optional description.
 * Figma DS Inline Alert (node 216-2788). Spacing, typography, and tokens from Figma variable_defs.
 */
import React from 'react';
import { Info, X, Check, AlertTriangle } from 'lucide-react';
import type { InlineAlertProps, InlineAlertVariant } from './InlineAlert.types';
import './InlineAlert.css';

export type { InlineAlertProps, InlineAlertVariant, InlineAlertSize } from './InlineAlert.types';

const VARIANT_ICON: Record<InlineAlertVariant, React.ComponentType<{ className?: string }>> = {
  info: Info,
  error: X,
  success: Check,
  warning: AlertTriangle,
};

export const InlineAlert: React.FC<InlineAlertProps> = ({
  variant,
  title,
  description,
  action,
  size = 'default',
  className = '',
}) => {
  const Icon = VARIANT_ICON[variant];
  return (
    <div
      className={`inline-alert inline-alert--${variant} inline-alert--${size} ${className}`.trim()}
      role="alert"
    >
      <div className="inline-alert__icon-wrap" aria-hidden="true">
        <Icon className="inline-alert__icon" />
      </div>
      <div className="inline-alert__content">
        <p className="inline-alert__title">{title}</p>
        {description != null && description !== '' && (
          <p className="inline-alert__description">{description}</p>
        )}
      </div>
      {action != null && <div className="inline-alert__action">{action}</div>}
    </div>
  );
};
