import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Slider } from './Slider';
import { Euro, DollarSign, Percent, TrendingUp } from 'lucide-react';
import '../../styles/tokens.css';

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  parameters: {
    docs: {
      description: {
        component: `
## Accessibility

### Keyboard Navigation
- **Arrow keys**: Move the slider value by the step amount
  - ArrowRight/ArrowUp: Increase value
  - ArrowLeft/ArrowDown: Decrease value
- **Home**: Move to minimum value
- **End**: Move to maximum value
- **Tab**: Navigate to/from the slider

### Accessible Name
- Provide either \`label\` (visible) or \`ariaLabel\` (required when no visible label)
- The component will warn in development if neither is provided

### Focus Management
- Focus ring appears on the active thumb (orange outline)
- For ranged sliders, each thumb can be focused independently
- Tooltip displays current value when focused, hovered, or pressed
        `,
      },
    },
  },
  argTypes: {
    variant: {
      table: {
        disable: true, // Hide variant control since we have separate stories
      },
    },
    value: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 1,
      },
      description: 'Current value as percentage (0-100). For default slider: 0% = min, 100% = max.',
      table: {
        type: { summary: 'number' },
      },
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether to show an icon before the label',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    icon: {
      control: 'select',
      options: ['Euro', 'DollarSign', 'Percent', 'TrendingUp'],
      mapping: {
        'Euro': Euro,
        'DollarSign': DollarSign,
        'Percent': Percent,
        'TrendingUp': TrendingUp,
      },
      description: 'Lucide icon component to display before the label (only used when showIcon is true)',
      table: {
        type: { summary: 'LucideIcon' },
      },
      if: { arg: 'showIcon', eq: true },
    },
    min: {
      control: 'number',
      description: 'Minimum value',
      table: {
        defaultValue: { summary: '0' },
        type: { summary: 'number' },
      },
    },
    max: {
      control: 'number',
      description: 'Maximum value',
      table: {
        defaultValue: { summary: '100' },
        type: { summary: 'number' },
      },
    },
    step: {
      control: 'number',
      description: 'Step increment',
      table: {
        defaultValue: { summary: '1' },
        type: { summary: 'number' },
      },
    },
    label: {
      control: 'text',
      description: 'Label text to display next to the slider',
      table: {
        type: { summary: 'string' },
      },
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label for screen readers (required when label is not provided)',
      table: {
        type: { summary: 'string' },
      },
    },
    state: {
      control: 'select',
      options: ['default', 'hover', 'pressed', 'focus', 'disabled'],
      description: 'Visual state of the slider',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    formatValue: {
      control: false,
      description: 'Format function to display value in tooltip',
      table: {
        defaultValue: { summary: '(val) => String(val)' },
        type: { summary: '(value: number) => string' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS class name for custom styling',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    variant: 'default',
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    label: '€ Title',
    showIcon: false,
    icon: Euro,
    state: 'default',
  },
  argTypes: {
    // @ts-ignore - value1 and value2 are custom Storybook controls, not part of SliderProps
    value1: {
      table: {
        disable: true, // Hide value1 for default slider
      },
    },
    // @ts-ignore - value1 and value2 are custom Storybook controls, not part of SliderProps
    value2: {
      table: {
        disable: true, // Hide value2 for default slider
      },
    },
  },
  render: (args) => {
    const [valuePercent, setValuePercent] = useState(args.value || 50);
    
    // Convert percentage to actual value (always rounded)
    const actualValue = React.useMemo(() => {
      const min = args.min || 0;
      const max = args.max || 100;
      const value = min + (Number(valuePercent) / 100) * (max - min);
      return Math.round(value);
    }, [valuePercent, args.min, args.max]);
    
    React.useEffect(() => {
      if (args.value !== undefined) {
        setValuePercent(args.value);
      }
    }, [args.value]);
    
    return (
      <div style={{ width: '300px' }}>
        <Slider
          variant="default"
          min={args.min}
          max={args.max}
          step={args.step}
          label={args.label}
          showIcon={args.showIcon}
          icon={args.icon}
          state={args.state}
          value={Math.round(actualValue)}
          onChange={(newValue) => {
            const min = args.min || 0;
            const max = args.max || 100;
            const roundedValue = Math.round(newValue as number);
            const percent = ((roundedValue - min) / (max - min)) * 100;
            setValuePercent(Math.round(percent));
          }}
        />
      </div>
    );
  },
};

export const Ranged: Story = {
  args: {
    variant: 'ranged',
    value1: 20,
    value2: 60,
    min: 0,
    max: 100,
    step: 1,
    label: '€ Title',
    showIcon: false,
    icon: Euro,
    state: 'default',
  } as any,
  argTypes: {
    value: {
      table: {
        disable: true, // Hide value control for ranged slider
      },
    },
    // @ts-ignore - value1 and value2 are custom Storybook controls, not part of SliderProps
    value1: {
      control: 'number',
      description: 'First value (minimum value, must be less than or equal to value2)',
      table: {
        type: { summary: 'number' },
      },
    },
    // @ts-ignore - value1 and value2 are custom Storybook controls, not part of SliderProps
    value2: {
      control: 'number',
      description: 'Second value (maximum value, must be greater than or equal to value1)',
      table: {
        type: { summary: 'number' },
      },
    },
  },
  render: (args) => {
    const [value1, setValue1] = useState((args as any).value1 || 20);
    const [value2, setValue2] = useState((args as any).value2 || 60);
    
    // Ensure value1 <= value2
    const actualValue1 = Math.min(value1, value2);
    const actualValue2 = Math.max(value1, value2);
    
    React.useEffect(() => {
      if ((args as any).value1 !== undefined) {
        const newValue1 = Math.round((args as any).value1);
        setValue1(newValue1);
        // Ensure value2 is still >= value1
        if (newValue1 > value2) {
          setValue2(newValue1);
        }
      }
      if ((args as any).value2 !== undefined) {
        const newValue2 = Math.round((args as any).value2);
        setValue2(newValue2);
        // Ensure value1 is still <= value2
        if (newValue2 < value1) {
          setValue1(newValue2);
        }
      }
    }, [(args as any).value1, (args as any).value2]);
    
    const actualValue: [number, number] = [actualValue1, actualValue2];
    
    return (
      <div style={{ width: '300px' }}>
        <Slider
          variant="ranged"
          min={args.min}
          max={args.max}
          step={args.step}
          label={args.label}
          showIcon={args.showIcon}
          icon={args.icon}
          state={args.state}
          value={actualValue}
          onChange={(newValue) => {
            const [minVal, maxVal] = newValue as [number, number];
            setValue1(Math.round(minVal));
            setValue2(Math.round(maxVal));
          }}
        />
      </div>
    );
  },
};
