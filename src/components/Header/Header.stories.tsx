import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';
import type { HeaderNavItem } from './Header.types';
import {
  PlusSquare,
  UtensilsCrossed,
  Crown,
  Settings,
} from 'lucide-react';
import '../../styles/tokens.css';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Single header: logo | nav (icon + label; mobile = icon-only) | account (tertiary IconButton; text hidden on mobile). Click nav items to see the indicator switch. Figma 350-13751.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Header>;

const baseNavItems: HeaderNavItem[] = [
  { id: 'new-order', icon: PlusSquare, label: 'New order', onClick: () => {} },
  { id: 'orders', icon: UtensilsCrossed, label: 'Orders', onClick: () => {} },
  { id: 'ranking', icon: Crown, label: 'Ranking', onClick: () => {} },
  { id: 'admin', icon: Settings, label: 'Admin', onClick: () => {} },
];

const logo = (
  <img
    src="/quiz-logo.png"
    alt="Quiz"
    className="header__logo-img"
    width={120}
    height={40}
  />
);

export const Default: Story = {
  args: {
    logo,
    account: {
      onClick: () => {},
      ariaLabel: 'Account',
      title: 'Account',
      subtitle: 'Staff',
    },
  },
  render: (args) => {
    const [activeId, setActiveId] = React.useState<string>('new-order');
    const navItems: HeaderNavItem[] = baseNavItems.map((item) => ({
      ...item,
      active: item.id === activeId,
      onClick: () => setActiveId(item.id),
    }));
    return (
      <Header
        logo={args.logo}
        navItems={navItems}
        account={args.account}
        className={args.className}
      />
    );
  },
};
