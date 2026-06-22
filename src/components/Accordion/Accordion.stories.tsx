import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion';
import type { AccordionItem } from './Accordion.types';
import '../../styles/tokens.css';

const defaultItems: AccordionItem[] = [
  { id: '1', title: 'Question', content: 'Answer' },
  { id: '2', title: 'Question', content: 'Answer' },
  { id: '3', title: 'Question', content: 'Answer' },
  { id: '4', title: 'Question', content: 'Answer' },
];

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/OHwR5VlI0xnvCfMisbHhQM/crealiev-ds?node-id=3-29',
    },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Accordion with collapsible items: trigger (title + chevron) and panel (content). Use **Controls** to try allowMultiple and defaultExpandedIds.',
      },
    },
  },
  argTypes: {
    allowMultiple: {
      control: 'boolean',
      description: 'When true, multiple items can be open at once.',
      table: { defaultValue: { summary: 'false' } },
    },
    defaultExpandedIds: {
      control: 'object',
      description: 'Initial expanded item ids (uncontrolled).',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    items: defaultItems,
    allowMultiple: false,
    defaultExpandedIds: [],
    'aria-label': 'FAQ',
  },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <Accordion {...args} />
    </div>
  ),
};
