/**
 * Toast – Figma DS Components 278:12664. Error/success/warning/info with icon, message, and bottom progress bar (countdown).
 * Auto-dismiss after duration; timer and progress pause on hover.
 */
import React, { useEffect, useRef, useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Info, type LucideIcon } from 'lucide-react';
import type { ToastProps, ToastVariant } from './Toast.types';
import './Toast.css';

export type { ToastProps, ToastVariant } from './Toast.types';

const TICK_MS = 50;

const variantIcons: Record<ToastVariant, LucideIcon> = {
  error: X,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
};

export const Toast: React.FC<ToastProps> = ({
  message,
  variant = 'error',
  durationMs = 5000,
  onDismiss,
  className = '',
}) => {
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef(0);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isHovered) {
      clearTimer();
      return;
    }
    const increment = (TICK_MS / durationMs) * 100;
    intervalRef.current = setInterval(() => {
      progressRef.current = Math.min(100, progressRef.current + increment);
      setProgress(progressRef.current);
      if (progressRef.current >= 100) {
        clearTimer();
        onDismiss();
      }
    }, TICK_MS);
    return clearTimer;
  }, [isHovered, durationMs, onDismiss]);

  const Icon = variantIcons[variant];

  return (
    <div
      className={`toast toast--${variant} ${className}`.trim()}
      role="alert"
      aria-live="assertive"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="toast__content">
        <div className="toast__icon-wrap">
          <Icon className="toast__icon" aria-hidden />
        </div>
        <p className="toast__message">{message}</p>
      </div>
      <div
        className="toast__progress"
        style={{ width: `${progress}%` }}
        aria-hidden
      />
    </div>
  );
};
