import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Table, type TableProps, type TableColumn, type TableRow } from './Table';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { Trash2, Pencil } from 'lucide-react';
import '../../styles/tokens.css';

type SampleRow = TableRow<{ name: string; email: string; role: string }>;

const columns: TableColumn<SampleRow>[] = [
  { key: 'name', header: 'Name', width: '1fr' },
  { key: 'email', header: 'Email', width: '2fr' },
  { key: 'role', header: 'Role', width: '1fr' },
];

const sampleRows: SampleRow[] = [
  { id: '1', name: 'Cell', email: 'Cell', role: 'Cell' },
  { id: '2', name: 'Cell', email: 'Cell', role: 'Cell' },
  { id: '3', name: 'Cell', email: 'Cell', role: 'Cell' },
  { id: '4', name: 'Cell', email: 'Cell', role: 'Cell' },
];

const meta: Meta<TableProps<SampleRow> & { multiselect?: boolean }> = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Data table. Use **Controls** to toggle header, multiselect, sticky columns, and mobile view switcher. In mobile card view a tertiary FAB (3-dot icon) in the bottom-right opens a menu with "Selecteer alles" / "Deselecteer alles" when selection is enabled, plus optional **cardActions** (e.g. "Verwijder alles" with your own confirmation modal). Buttons in cards wrap when space is limited. Mouse wheel scrolls table horizontally when it overflows.',
      },
    },
  },
  argTypes: {
    header: { control: 'boolean', name: 'Header', table: { defaultValue: { summary: 'true' } } },
    multiselect: { control: 'boolean', name: 'Multiselect', table: { defaultValue: { summary: 'false' } } },
    stickyFirstColumn: { control: 'boolean', name: 'Sticky column(s)', table: { defaultValue: { summary: 'false' } } },
    mobileViewSwitcher: { control: 'boolean', name: 'Mobile view switcher', table: { defaultValue: { summary: 'true' } } },
    cardContentColumns: {
      control: 'radio',
      options: [1, 2],
      name: 'Card content columns',
      table: { defaultValue: { summary: '1' } },
    },
    'aria-label': { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<TableProps<SampleRow> & { multiselect?: boolean }>;

const rowActionsDesktop = () => (
  <>
    <Button variant="secondary" size="small" onClick={() => {}}>
      Delete
    </Button>
    <Button variant="primary" size="small" onClick={() => {}}>
      Edit
    </Button>
  </>
);

const rowActionsMobile = () => (
  <>
    <IconButton icon={Trash2} variant="secondary" size="small" aria-label="Delete" onClick={() => {}} />
    <IconButton icon={Pencil} variant="primary" size="small" aria-label="Edit" onClick={() => {}} />
  </>
);

export const Default: Story = {
  args: {
    columns,
    rows: sampleRows,
    header: true,
    multiselect: false,
    stickyFirstColumn: false,
    mobileViewSwitcher: true,
    cardContentColumns: 1,
    'aria-label': 'Sample table',
  },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>([]);
    const { multiselect, ...tableArgs } = args;
    const cardActions = [
      {
        label: 'Verwijder alles',
        onClick: () => {
          if (selected.length === 0) return;
          if (window.confirm('Weet je zeker dat je alle geselecteerde rijen wilt verwijderen?')) {
            setSelected([]);
          }
        },
      },
    ];
    return (
      <div style={{ width: '100%', maxWidth: args.stickyFirstColumn ? '420px' : undefined }}>
        <Table
          {...tableArgs}
          selectedRowIds={multiselect ? selected : undefined}
          onSelectionChange={multiselect ? setSelected : undefined}
          renderRowActions={rowActionsDesktop}
          renderRowActionsMobile={rowActionsMobile}
          cardActions={multiselect ? cardActions : undefined}
        />
      </div>
    );
  },
};
