/**
 * Card – Figma 419:17380 (default), 419-17403 / 878-1814 (editable).
 * Default: icon/image + title/subtitle, optional 3-dot actions (small), subtext, footer (primary left).
 * Editable variant: view (key-value rows + edit/delete) and edit mode (upload image link + form + Save/Cancel).
 * Icon-wrap shows imageSrc when set (e.g. after upload), otherwise icon.
 */
import React from 'react';
import { MoreVertical, Pencil, Trash2, Upload } from 'lucide-react';
import type { CardProps } from './Card.types';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { InputField } from '../InputField';
import './Card.css';

export type { CardProps, CardVariant, CardViewField, CardEditField } from './Card.types';

export function Card({
  variant = 'default',
  icon,
  imageSrc,
  imageAlt = '',
  title,
  subtitle,
  onActionsClick,
  subtext,
  footer,
  className = '',
  isEditing = false,
  viewFields = [],
  onEditClick,
  onDeleteClick,
  editFields = [],
  onUploadImageClick,
  onSaveEdit,
  onCancelEdit,
}: CardProps) {
  const isEditable = variant === 'editable';
  const showImage = imageSrc != null && imageSrc !== '';
  const showIconOrImage = showImage || icon != null;

  return (
    <article
      className={`card ${isEditable ? 'card--editable' : ''} ${isEditable && isEditing ? 'card--editing' : ''} ${className}`.trim()}
    >
      <header className="card__header">
        <div className="card__head-main">
          {showIconOrImage && (
            <div
              className={`card__icon-wrap ${isEditable && !showImage ? 'card__icon-wrap--placeholder' : ''}`.trim()}
              aria-hidden={!showImage}
            >
              {showImage ? (
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="card__icon-img"
                />
              ) : (
                icon
              )}
            </div>
          )}
          <div className="card__head-text">
            {isEditable && isEditing && onUploadImageClick != null ? (
              <Button
                variant="link"
                size="small"
                showLeftIcon
                iconLeft={Upload}
                onClick={onUploadImageClick}
              >
                Upload image
              </Button>
            ) : (
              <>
                <h2 className="card__title">{title}</h2>
                {!isEditable && subtitle != null && subtitle !== '' && (
                  <p className="card__subtitle">{subtitle}</p>
                )}
              </>
            )}
          </div>
        </div>
        {isEditable && !isEditing && (onEditClick != null || onDeleteClick != null) && (
          <div className="card__actions">
            {onEditClick != null && (
              <IconButton
                icon={Pencil}
                variant="default"
                size="small"
                aria-label="Edit"
                onClick={onEditClick}
              />
            )}
            {onDeleteClick != null && (
              <IconButton
                icon={Trash2}
                variant="default"
                size="small"
                destructive
                aria-label="Delete"
                onClick={onDeleteClick}
              />
            )}
          </div>
        )}
        {!isEditable && onActionsClick != null && (
          <div className="card__actions">
            <IconButton
              icon={MoreVertical}
              variant="default"
              size="small"
              aria-label="More actions"
              onClick={onActionsClick}
            />
          </div>
        )}
      </header>

      {isEditable ? (
        <div className="card__body">
          {isEditing ? (
            <div className="card__form">
              {editFields.map((field) => (
                <InputField
                  key={field.id}
                  label={field.label}
                  required={field.required}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              ))}
            </div>
          ) : (
            <dl className="card__fields" role="list">
              {viewFields.map((field) => (
                <div key={field.id} className="card__field-row">
                  <dt className="card__field-label">{field.label}</dt>
                  <dd className="card__field-value">{field.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      ) : (
        subtext != null &&
        subtext !== '' && (
          <div className="card__body">
            <p className="card__subtext">{subtext}</p>
          </div>
        )
      )}

      {isEditable && isEditing && (onSaveEdit != null || onCancelEdit != null) && (
        <footer className="card__footer">
          {onSaveEdit != null && (
            <Button variant="primary" size="small" onClick={onSaveEdit}>
              Save
            </Button>
          )}
          {onCancelEdit != null && (
            <Button variant="tertiary" size="small" onClick={onCancelEdit}>
              Cancel
            </Button>
          )}
        </footer>
      )}
      {!isEditable && footer != null && <footer className="card__footer">{footer}</footer>}
    </article>
  );
}
