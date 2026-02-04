/**
 * OrderListSummary: label, badges or total price • points, item count on the right (primary blue, small heading).
 * Figma DS Order List Summary (nodes 856-701, 856-743). Screenshot: badges with icons below label.
 */
import React from 'react';
import type { OrderListSummaryProps } from './OrderList.types';
import './OrderList.css';

export const OrderListSummary: React.FC<OrderListSummaryProps> = ({
  label,
  badges,
  totalPrice,
  totalPoints,
  itemCount,
  className = '',
}) => {
  const showValueLine = badges == null && (totalPrice != null || totalPoints != null);
  return (
    <div className={`order-list__summary ${className}`.trim()} role="group" aria-label={label}>
      <div className="order-list__summary-left">
        <p className="order-list__summary-label">{label}</p>
        {badges != null ? (
          <div className="order-list__summary-badges">{badges}</div>
        ) : showValueLine ? (
          <p className="order-list__summary-value">
            {totalPrice != null && totalPrice !== '' && (
              <span className="order-list__summary-price">{totalPrice}</span>
            )}
            {totalPrice != null && totalPrice !== '' && totalPoints != null && totalPoints !== '' && (
              <span className="order-list__summary-sep" aria-hidden="true">
                {' '}
                •{' '}
              </span>
            )}
            {totalPoints != null && totalPoints !== '' && (
              <span className="order-list__summary-points">{totalPoints}</span>
            )}
          </p>
        ) : null}
      </div>
      <p className="order-list__summary-count">{itemCount}</p>
    </div>
  );
};
