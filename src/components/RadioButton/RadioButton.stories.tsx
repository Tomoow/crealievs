import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { RadioGroup } from './RadioGroup';
import { RadioOption } from './RadioButton';
import '../../styles/tokens.css';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioButton',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Accessibility

### Target Size
- Meets WCAG 2.5.8 AA with 24×24px minimum hit area

### Accessible Name
- Provide either \`label\` (visible) or \`ariaLabel\` (required when no visible label)
- The component will warn in development if neither is provided

### Keyboard Navigation
- Fully keyboard accessible via native radio button behavior
- Focus ring appears on the radio button (orange halo)
- Arrow keys can be used to navigate between radio buttons in a group

### Grouping
- Radio buttons must always be used in groups (at least 2, never alone)
- All radio buttons in a group must share the same \`name\` attribute
- Use a parent component to manage the selected value
        `,
      },
    },
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'The name attribute for the radio group',
      table: {
        type: { summary: 'string' },
      },
    },
    direction: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Layout direction of the radio group',
      table: {
        defaultValue: { summary: 'vertical' },
        type: { summary: 'vertical | horizontal' },
      },
    },
    // Radio Option 1 controls
    option1Label: {
      control: 'text',
      description: 'Label for Radio Option 1',
      table: {
        category: 'Option 1',
        type: { summary: 'string' },
      },
    },
    option1Description: {
      control: 'text',
      description: 'Description for Radio Option 1',
      table: {
        category: 'Option 1',
        type: { summary: 'string' },
      },
    },
    option1ShowDescription: {
      control: 'boolean',
      description: 'Show description for Radio Option 1',
      table: {
        category: 'Option 1',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    option1State: {
      control: 'select',
      options: ['default', 'hover', 'focus', 'disabled'],
      description: 'State for Radio Option 1',
      table: {
        category: 'Option 1',
        defaultValue: { summary: 'default' },
        type: { summary: 'default | hover | focus | disabled' },
      },
    },
    // Radio Option 2 controls
    option2Label: {
      control: 'text',
      description: 'Label for Radio Option 2',
      table: {
        category: 'Option 2',
        type: { summary: 'string' },
      },
    },
    option2Description: {
      control: 'text',
      description: 'Description for Radio Option 2',
      table: {
        category: 'Option 2',
        type: { summary: 'string' },
      },
    },
    option2ShowDescription: {
      control: 'boolean',
      description: 'Show description for Radio Option 2',
      table: {
        category: 'Option 2',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    option2State: {
      control: 'select',
      options: ['default', 'hover', 'focus', 'disabled'],
      description: 'State for Radio Option 2',
      table: {
        category: 'Option 2',
        defaultValue: { summary: 'default' },
        type: { summary: 'default | hover | focus | disabled' },
      },
    },
    // Radio Option 3 controls
    option3Label: {
      control: 'text',
      description: 'Label for Radio Option 3',
      table: {
        category: 'Option 3',
        type: { summary: 'string' },
      },
    },
    option3Description: {
      control: 'text',
      description: 'Description for Radio Option 3',
      table: {
        category: 'Option 3',
        type: { summary: 'string' },
      },
    },
    option3ShowDescription: {
      control: 'boolean',
      description: 'Show description for Radio Option 3',
      table: {
        category: 'Option 3',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    option3State: {
      control: 'select',
      options: ['default', 'hover', 'focus', 'disabled'],
      description: 'State for Radio Option 3',
      table: {
        category: 'Option 3',
        defaultValue: { summary: 'default' },
        type: { summary: 'default | hover | focus | disabled' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  args: {
    name: 'example-group',
    direction: 'vertical',
    option1Label: 'Keuze',
    option1Description: 'Extra informatie',
    option1ShowDescription: false,
    option1State: 'default',
    option2Label: 'Keuze',
    option2Description: 'Extra informatie',
    option2ShowDescription: false,
    option2State: 'default',
    option3Label: 'Keuze',
    option3Description: 'Extra informatie',
    option3ShowDescription: false,
    option3State: 'default',
  },
  render: (args) => {
    const [value, setValue] = useState<string | null>('option1');
    
    return (
      <RadioGroup 
        name={args.name} 
        value={value} 
        onChange={setValue}
        direction={args.direction}
      >
        <RadioOption
          id="radio-option1"
          value="option1"
          label={args.option1Label}
          description={args.option1Description}
          showDescription={args.option1ShowDescription}
          state={args.option1State}
        />
        <RadioOption
          id="radio-option2"
          value="option2"
          label={args.option2Label}
          description={args.option2Description}
          showDescription={args.option2ShowDescription}
          state={args.option2State}
        />
        <RadioOption
          id="radio-option3"
          value="option3"
          label={args.option3Label}
          description={args.option3Description}
          showDescription={args.option3ShowDescription}
          state={args.option3State}
        />
      </RadioGroup>
    );
  },
};
