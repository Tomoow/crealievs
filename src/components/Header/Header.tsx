/**
 * Header – Figma DS Header (350-13751).
 * Desktop (icons + labels, 120px padding) above 1200px; compact (icon-only, 1rem padding) at 1200px and below.
 */
import React, { useRef, useLayoutEffect, useState, useCallback } from 'react';
import { User } from 'lucide-react';
import { IconButton } from '../IconButton';
import type { HeaderProps } from './Header.types';
import './Header.css';

type IndicatorStyle = { left: number; width: number } | null;

function useIndicatorPosition(
  activeId: string | null,
  navItems: HeaderProps['navItems']
): [React.RefObject<HTMLDivElement>, IndicatorStyle] {
  const innerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<IndicatorStyle>(null);

  const updateIndicator = useCallback(() => {
    if (activeId == null) {
      setIndicator(null);
      return;
    }
    const container = innerRef.current;
    const activeEl = container?.querySelector<HTMLButtonElement>(
      `[data-nav-id="${CSS.escape(activeId)}"]`
    );
    if (!container || !activeEl) {
      setIndicator(null);
      return;
    }
    const cRect = container.getBoundingClientRect();
    const tRect = activeEl.getBoundingClientRect();
    setIndicator({
      left: tRect.left - cRect.left,
      width: tRect.width,
    });
  }, [activeId]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator, navItems]);

  useLayoutEffect(() => {
    const container = innerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => updateIndicator());
    ro.observe(container);
    return () => ro.disconnect();
  }, [updateIndicator]);

  return [innerRef, indicator];
}

export const Header: React.FC<HeaderProps> = ({
  logo,
  navItems,
  account,
  className = '',
}) => {
  const activeId = navItems.find((item) => item.active === true)?.id ?? null;
  const [innerRef, indicator] = useIndicatorPosition(activeId, navItems);

  return (
    <header className={`header ${className}`.trim()}>
      <div className="header__inner" ref={innerRef}>
        <div className="header__logo" aria-hidden>
          {logo}
        </div>

        <nav className="header__nav" aria-label="Main navigation">
          <ul className="header__nav-list" role="list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.active === true;
              const label = item.label;

              return (
                <li key={item.id} className="header__nav-item">
                  <button
                    type="button"
                    data-nav-id={item.id}
                    className={`header__nav-link ${isActive ? 'header__nav-link--active' : ''}`.trim()}
                    onClick={item.onClick}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={label ?? item.id}
                  >
                    <span className="header__nav-icon" aria-hidden>
                      <Icon />
                    </span>
                    {label != null && label !== '' && (
                      <span className="header__nav-label">{label}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {account != null && (
          <div className="header__account">
            <IconButton
              icon={User}
              variant="tertiary"
              size="small"
              aria-label={account.ariaLabel ?? 'Account'}
              onClick={account.onClick}
            />
            <div className="header__account-text" aria-hidden>
              {account.title != null && account.title !== '' && (
                <span className="header__account-title">{account.title}</span>
              )}
              {account.subtitle != null && account.subtitle !== '' && (
                <span className="header__account-subtitle">{account.subtitle}</span>
              )}
            </div>
          </div>
        )}

        {indicator !== null && (
          <div
            className="header__indicator"
            aria-hidden
            style={{ left: indicator.left, width: indicator.width }}
          />
        )}
      </div>

      <div className="header__bottom-line" role="presentation" />
    </header>
  );
};
