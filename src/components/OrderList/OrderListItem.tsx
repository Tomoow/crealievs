/**
 * OrderListItem: row with image, title, badges or price • points, Counter.
 * Figma DS Order List Item (nodes 847-5136, 847-4512). Screenshot: badges with icons below title.
 */
import React from 'react';
import { Counter } from '../Counter';
import type { OrderListItemProps } from './OrderList.types';
import './OrderList.css';

export const OrderListItem: React.FC<OrderListItemProps> = ({
  imageSrc,
  imageAlt,
  title,
  badges,
  price,
  points,
  quantity,
  onQuantityChange,
  min = 0,
  max,
  disabled = false,
  className = '',
}) => {
  const showPriceLine = badges == null && (price != null || points != null);
  return (
    <li className={`order-list__item ${className}`.trim()}>
      <div className="order-list__item-media" aria-hidden="true">
        <img src={imageSrc} alt={imageAlt} className="order-list__item-image" width={48} height={48} />
      </div>
      <div className="order-list__item-content">
        <p className="order-list__item-title">{title}</p>
        {badges != null ? (
          <div className="order-list__item-badges">{badges}</div>
        ) : showPriceLine ? (
          <p className="order-list__item-price-line">
            {price != null && price !== '' && <span className="order-list__item-price">{price}</span>}
            {price != null && price !== '' && points != null && points !== '' && (
              <span className="order-list__item-sep" aria-hidden="true">
                {' '}
                •{' '}
              </span>
            )}
            {points != null && points !== '' && <span className="order-list__item-points">{points}</span>}
          </p>
        ) : null}
      </div>
      <div className="order-list__item-actions">
        <Counter
          value={quantity}
          onChange={onQuantityChange}
          min={min}
          max={max}
          disabled={disabled}
          aria-label={`Quantity for ${title}`}
        />
      </div>
    </li>
  );
};
