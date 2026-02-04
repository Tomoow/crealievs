/**
 * OrderList: container for OrderListItem rows. Figma DS Order List (nodes 856-701, 847-5136, 847-4512, 856-743).
 */
import React from 'react';
import type { OrderListProps } from './OrderList.types';
import './OrderList.css';

export const OrderList: React.FC<OrderListProps> = ({ children, className = '' }) => {
  return (
    <ul className={`order-list ${className}`.trim()} role="list">
      {children}
    </ul>
  );
};
