/**
 * OrderCard: bar order card with states (incoming / preparing / done), edit mode, time badge.
 * Figma DS Order Card (nodes 852-162, 852-69, 852-71, 852-120).
 */
import React from 'react';
import { Clock, Pencil, Trash2, Plus } from 'lucide-react';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { OrderList, OrderListItem, OrderListSummary } from '../OrderList';
import type { OrderCardProps, OrderCardState } from './OrderCard.types';
import './OrderCard.css';

const PLACEHOLDER_IMAGE = 'https://placehold.co/48x48/f2f4f7/606073?text=•';

export const OrderCard: React.FC<OrderCardProps> = ({
  state,
  tableName,
  subtitle,
  orderTime,
  items,
  isEditing = false,
  onStartPreparing,
  onMarkDone,
  onEditClick,
  onDeleteClick,
  onQuantityChange,
  onAddItemClick,
  onSaveEdit,
  onCancelEdit,
  className = '',
}) => {
  const visibleItems = items.filter((item) => item.quantity > 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const showActions = state !== 'done' && !isEditing;
  const isPreparing = state === 'preparing';
  const itemsToShow = isEditing ? items : visibleItems;

  return (
    <article
      className={`order-card order-card--${state} ${isPreparing ? 'order-card--preparing' : ''} ${isEditing ? 'order-card--editing' : ''} ${className}`.trim()}
    >
      <header className="order-card__header">
        <div className="order-card__header-left">
          <h2 className="order-card__title">{tableName}</h2>
          {subtitle != null && subtitle !== '' && (
            <p className="order-card__subtitle">{subtitle}</p>
          )}
        </div>
        <div
          className={`order-card__time-badge order-card__time-badge--${state === 'done' ? 'done' : 'default'}`}
          aria-label={`Order time ${orderTime}`}
        >
          <Clock className="order-card__time-icon" aria-hidden />
          <span>{orderTime}</span>
        </div>
      </header>

      <div className="order-card__separator" role="presentation" />

      <div className="order-card__body">
        {isEditing ? (
          <>
            <OrderList>
              {itemsToShow.map((item) => (
                <OrderListItem
                  key={item.id}
                  imageSrc={item.imageSrc ?? PLACEHOLDER_IMAGE}
                  imageAlt={item.imageAlt ?? item.name}
                  title={item.name}
                  quantity={item.quantity}
                  onQuantityChange={(q) => onQuantityChange?.(item.id, q)}
                  min={0}
                />
              ))}
            </OrderList>
            {onAddItemClick != null && (
              <Button
                variant="secondary"
                size="small"
                showLeftIcon
                iconLeft={Plus}
                onClick={onAddItemClick}
              >
                Add
              </Button>
            )}
          </>
        ) : (
          <ul className="order-card__items" role="list">
            {itemsToShow.map((item) => (
              <li key={item.id} className="order-card__item-row">
                <span className="order-card__item-name">{item.name}</span>
                <span className="order-card__item-qty">x{item.quantity}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="order-card__separator" role="presentation" />

      <div className="order-card__summary">
        <OrderListSummary
          label="Totaal"
          itemCount={`${totalCount} stuks`}
        />
      </div>

      {isEditing ? (
        <footer className="order-card__footer order-card__footer--edit">
          <Button variant="primary" size="small" onClick={onSaveEdit}>
            Save
          </Button>
          <Button variant="tertiary" size="small" onClick={onCancelEdit}>
            Cancel
          </Button>
        </footer>
      ) : showActions ? (
        <footer className="order-card__footer order-card__footer--actions">
          {state === 'incoming' && onStartPreparing != null && (
            <Button
              variant="secondary"
              size="small"
              onClick={onStartPreparing}
            >
              Start preparing
            </Button>
          )}
          {state === 'preparing' && onMarkDone != null && (
            <Button variant="primary" size="small" onClick={onMarkDone}>
              Mark as done
            </Button>
          )}
          <div className="order-card__icon-actions">
            {onEditClick != null && (
              <IconButton
                icon={Pencil}
                variant="default"
                size="small"
                aria-label="Edit order"
                onClick={onEditClick}
              />
            )}
            {onDeleteClick != null && (
              <IconButton
                icon={Trash2}
                variant="default"
                size="small"
                destructive
                aria-label="Delete order"
                onClick={onDeleteClick}
              />
            )}
          </div>
        </footer>
      ) : null}
    </article>
  );
};
