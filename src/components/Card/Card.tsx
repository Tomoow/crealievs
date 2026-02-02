/**
 * Card – Figma 419:17380. Icon + title/subtitle top left, optional 3-dot actions top right, subtext, optional footer.
 */
import React from 'react';
import { MoreVertical } from 'lucide-react';
import type { CardProps } from './Card.types';
import { IconButton } from '../IconButton';
import './Card.css';

export type { CardProps } from './Card.types';

export function Card({
  icon,
  title,
  subtitle,
  onActionsClick,
  subtext,
  footer,
  className = '',
}: CardProps) {
  return (
    <article className={`card ${className}`.trim()}>
      <header className="card__header">
        <div className="card__head-main">
          {icon != null && (
            <div className="card__icon-wrap" aria-hidden="true">
              {icon}
            </div>
          )}
          <div className="card__head-text">
            <h2 className="card__title">{title}</h2>
            {subtitle != null && subtitle !== '' && (
              <p className="card__subtitle">{subtitle}</p>
            )}
          </div>
        </div>
        {onActionsClick != null && (
          <div className="card__actions">
            <IconButton
              icon={MoreVertical}
              variant="default"
              aria-label="More actions"
              onClick={onActionsClick}
            />
          </div>
        )}
      </header>
      {subtext != null && subtext !== '' && (
        <div className="card__body">
          <p className="card__subtext">{subtext}</p>
        </div>
      )}
      {footer != null && <footer className="card__footer">{footer}</footer>}
    </article>
  );
}
