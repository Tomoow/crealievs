import React, { createContext, useContext } from 'react';
import './RadioGroup.css';

export type RadioGroupContextType = {
  value: string | null;
  onChange: (value: string) => void;
  name: string;
};

const RadioGroupContext = createContext<RadioGroupContextType | null>(null);

export const useRadioGroup = () => {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('RadioOption must be used within a RadioGroup');
  }
  return context;
};

export type RadioGroupDirection = 'vertical' | 'horizontal';

export interface RadioGroupProps {
  /**
   * The currently selected value. Use null for no selection.
   */
  value: string | null;
  /**
   * Callback fired when the selection changes.
   */
  onChange: (value: string) => void;
  /**
   * The name attribute for the radio group (for accessibility and form submission).
   */
  name: string;
  /**
   * The radio options to render
   */
  children: React.ReactNode;
  /**
   * Layout direction of the radio group
   * @default 'vertical'
   */
  direction?: RadioGroupDirection;
  /**
   * Additional CSS class name for custom styling
   */
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onChange,
  name,
  children,
  direction = 'vertical',
  className = '',
}) => {
  const directionClass = direction === 'horizontal' ? 'radio-group--horizontal' : 'radio-group--vertical';
  const groupClassName = `radio-group ${directionClass} ${className}`.trim();

  return (
    <RadioGroupContext.Provider value={{ value, onChange, name }}>
      <div role="radiogroup" className={groupClassName}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};
