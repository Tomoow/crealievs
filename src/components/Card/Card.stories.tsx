import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../Button';
import { Smartphone } from 'lucide-react';
import type { CardViewField, CardEditField } from './Card.types';
import '../../styles/tokens.css';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/OHwR5VlI0xnvCfMisbHhQM/crealiev-ds?node-id=878-1813',
    },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Card: default (icon/image + title/subtitle, 3-dot actions small, subtext, footer primary left) or editable variant (view/edit modes, upload image link, icon-wrap shows uploaded image).',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'editable'],
      table: { defaultValue: { summary: 'default' } },
    },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    subtext: { control: 'text' },
    onActionsClick: { action: 'actionsClicked', description: 'When set, shows 3-dot button; fired when clicked.' },
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

const defaultSubtext =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

export const Default: Story = {
  args: {
    variant: 'default',
    title: 'Titel',
    subtitle: 'Ondertitel',
    subtext: defaultSubtext,
    icon: <Smartphone size={20} strokeWidth={1.5} />,
    onActionsClick: () => {},
    footer: [
      <Button key="confirm" variant="primary" size="small">
        Bevestigen
      </Button>,
      <Button key="cancel" variant="secondary" size="small">
        Annuleren
      </Button>,
    ],
  },
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <Card
        variant={args.variant}
        title={args.title}
        subtitle={args.subtitle}
        subtext={args.subtext}
        icon={args.icon ?? <Smartphone size={20} strokeWidth={1.5} />}
        onActionsClick={args.onActionsClick}
        footer={args.footer}
        className={args.className}
      />
    </div>
  ),
};

const DEFAULT_VIEW_FIELDS: CardViewField[] = [
  { id: 'bonnetjes', label: 'Bonnetjes', value: 'Value' },
  { id: 'punten', label: 'Punten', value: 'Value' },
];

type EditableStoryArgs = {
  isEditing?: boolean;
  title?: string;
};

export const Editable: Story = {
  args: {
    variant: 'editable',
    isEditing: false,
    title: 'Naam',
  },
  argTypes: {
    variant: { table: { disable: true } },
    isEditing: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    title: { control: 'text', table: { defaultValue: { summary: 'Naam' } } },
  },
  render: (args) => {
    const { isEditing: isEditingArg = false, title = 'Naam' } = args as EditableStoryArgs;
    const [editing, setEditing] = React.useState(isEditingArg);
    const [displayTitle, setDisplayTitle] = React.useState(title);
    const [viewFields, setViewFields] = React.useState(DEFAULT_VIEW_FIELDS);
    const [imageSrc, setImageSrc] = React.useState<string | undefined>(undefined);
    const [imageAlt, setImageAlt] = React.useState('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [editValues, setEditValues] = React.useState({
      naam: title,
      bonnetjes: 'Value',
      punten: 'Value',
    });

    React.useEffect(() => {
      setEditing(isEditingArg);
    }, [isEditingArg]);
    React.useEffect(() => {
      setDisplayTitle(title);
    }, [title]);

    const editFields: CardEditField[] = [
      {
        id: 'naam',
        label: 'Naam',
        value: editValues.naam,
        required: true,
        onChange: (v) => setEditValues((prev) => ({ ...prev, naam: v })),
      },
      {
        id: 'bonnetjes',
        label: 'Bonnetjes',
        value: editValues.bonnetjes,
        required: true,
        onChange: (v) => setEditValues((prev) => ({ ...prev, bonnetjes: v })),
      },
      {
        id: 'punten',
        label: 'Punten',
        value: editValues.punten,
        required: true,
        onChange: (v) => setEditValues((prev) => ({ ...prev, punten: v })),
      },
    ];

    const handleUploadImageClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setImageSrc(url);
        setImageAlt(file.name);
      }
      e.target.value = '';
    };

    const handleSaveEdit = () => {
      setDisplayTitle(editValues.naam);
      setViewFields([
        { id: 'bonnetjes', label: 'Bonnetjes', value: editValues.bonnetjes },
        { id: 'punten', label: 'Punten', value: editValues.punten },
      ]);
      setEditing(false);
    };

    const handleCancelEdit = () => {
      setEditValues({
        naam: displayTitle,
        bonnetjes: viewFields.find((f) => f.id === 'bonnetjes')?.value ?? 'Value',
        punten: viewFields.find((f) => f.id === 'punten')?.value ?? 'Value',
      });
      setEditing(false);
    };

    return (
      <div style={{ width: '100%', maxWidth: 400 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-hidden
        />
        <Card
          variant="editable"
          icon={<Smartphone size={20} strokeWidth={1.5} />}
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          title={displayTitle}
          viewFields={viewFields}
          isEditing={editing}
          onEditClick={() => setEditing(true)}
          onDeleteClick={() => {}}
          editFields={editFields}
          onUploadImageClick={handleUploadImageClick}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
        />
      </div>
    );
  },
};
