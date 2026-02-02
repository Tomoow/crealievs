import React from 'react';
import { Search, Mic, X } from 'lucide-react';
import { IconButton } from '../IconButton';
import './SearchField.css';

type SearchFieldLabelProps =
  | {
      /** Visible label rendered above the search field. */
      label: string;
      /** Only required when no visible `label` is provided. */
      'aria-label'?: never;
    }
  | {
      label?: undefined;
      'aria-label': string;
    };

export type SearchFieldProps = SearchFieldLabelProps & {
  required?: boolean;
  placeholder?: string;
  value: string;
  helperText?: string;
  errorMessage?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * Called when the clear button is activated.
   * If not provided, defaults to clearing the input value.
   */
  onClear?: () => void;
  /**
   * Called when voice recognition starts.
   */
  onVoiceStart?: () => void;
  /**
   * Called when voice recognition ends.
   */
  onVoiceEnd?: () => void;
  /**
   * Called when voice recognition encounters an error.
   */
  onVoiceError?: (error: string) => void;
  /**
   * Accessible name for the clear button.
   * @default 'Clear search'
   */
  clearButtonAriaLabel?: string;
  /**
   * Accessible name for the microphone button.
   * @default 'Start voice search'
   */
  microphoneButtonAriaLabel?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
  'aria-describedby'?: string;
  readOnly?: boolean;
  /**
   * Language for voice recognition (e.g., 'en-US', 'nl-NL').
   * @default 'en-US'
   */
  voiceLanguage?: string;
};

const createChangeEvent = (value: string): React.ChangeEvent<HTMLInputElement> => ({
  target: { value },
  currentTarget: { value },
} as React.ChangeEvent<HTMLInputElement>);

export const SearchField: React.FC<SearchFieldProps> = ({
  label,
  required = false,
  placeholder,
  value,
  helperText,
  errorMessage,
  onChange,
  onClear,
  onVoiceStart,
  onVoiceEnd,
  onVoiceError,
  clearButtonAriaLabel = 'Clear search',
  microphoneButtonAriaLabel = 'Start voice search',
  onFocus,
  onBlur,
  className = '',
  id,
  name,
  autoComplete = 'off',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  readOnly = false,
  voiceLanguage = 'en-US',
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const autoId = React.useId();
  const searchId = id ?? `search-field-${autoId}`;
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = React.useState(false);

  const hasError = Boolean(errorMessage);
  const hasValue = value.length > 0;
  const helperOrErrorId = errorMessage || helperText ? `${searchId}-description` : undefined;
  const ariaDescribedByAttr = [ariaDescribedBy, helperOrErrorId].filter(Boolean).join(' ') || undefined;

  // Check if Speech Recognition API is available
  const isSpeechRecognitionSupported = () => {
    return (
      typeof window !== 'undefined' &&
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    );
  };

  // Initialize speech recognition
  React.useEffect(() => {
    if (!isSpeechRecognitionSupported()) return;

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = voiceLanguage;

    recognition.onstart = () => {
      setIsListening(true);
      onVoiceStart?.();
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      onChange(createChangeEvent(transcript));
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      const errorMessage = event.error === 'no-speech' 
        ? 'No speech detected'
        : event.error === 'not-allowed'
        ? 'Microphone access denied'
        : `Voice recognition error: ${event.error}`;
      onVoiceError?.(errorMessage);
    };

    recognition.onend = () => {
      setIsListening(false);
      onVoiceEnd?.();
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [voiceLanguage, onChange, onVoiceStart, onVoiceEnd, onVoiceError]);

  const handleMicrophoneClick = () => {
    if (!isSpeechRecognitionSupported() || !recognitionRef.current) {
      onVoiceError?.('Voice recognition is not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        // Recognition might already be running
        onVoiceError?.('Voice recognition is already active');
      }
    }
  };

  const handleClear = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    onClear ? onClear() : onChange(createChangeEvent(''));
    inputRef.current?.focus();
  };

  const isClearVisible = hasValue && !readOnly;
  const isMicrophoneVisible = !hasValue && !readOnly && isSpeechRecognitionSupported();
  const microphoneAriaLabel = isListening ? 'Stop voice search' : microphoneButtonAriaLabel;

  const commonInputProps = {
    id: searchId,
    name,
    ref: inputRef,
    type: 'search' as const,
    value,
    placeholder,
    readOnly,
    required,
    autoComplete,
    onFocus,
    onBlur,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedByAttr,
    'aria-invalid': hasError || undefined,
    'aria-required': required,
  };

  const iconButtonProps = {
    variant: 'default' as const,
    size: 'small' as const,
    tooltipVariant: 'plain' as const,
    tooltipPosition: 'top' as const,
  };

  return (
    <div className={`search-field-wrapper ${hasError ? 'search-field-wrapper--error' : ''} ${className}`.trim()}>
      {label && (
        <label htmlFor={searchId} className={`search-field__label ${hasError ? 'search-field__label--error' : ''}`.trim()}>
          {label}
          {required && <span className="search-field__required-indicator">*</span>}
        </label>
      )}

      <div
        className={`search-field-container${hasError ? ' search-field-container--error' : ''}${
          readOnly ? ' search-field-container--readonly' : ''
        }${isListening ? ' search-field-container--listening' : ''}`}
      >
        <Search className="search-field__search-icon" aria-hidden="true" />
        <input {...commonInputProps} onChange={onChange} className="search-field" />
        {isClearVisible && (
          <IconButton
            {...iconButtonProps}
            icon={X}
            onClick={handleClear}
            aria-label={clearButtonAriaLabel}
            className="search-field__clear-button"
          />
        )}
        {isMicrophoneVisible && (
          <IconButton
            {...iconButtonProps}
            icon={Mic}
            onClick={handleMicrophoneClick}
            aria-label={microphoneAriaLabel}
            className="search-field__microphone-button"
            state={isListening ? 'active' : 'default'}
          />
        )}
      </div>

      {helperOrErrorId && (
        <span id={helperOrErrorId} className={`search-field__helper-text ${hasError ? 'search-field__helper-text--error' : ''}`.trim()}>
          {errorMessage ?? helperText}
        </span>
      )}
    </div>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  }

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
  }

  interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
  }

  interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
  }
}
