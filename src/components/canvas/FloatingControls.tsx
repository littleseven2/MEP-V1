import type { ReactNode } from 'react';

export interface ControlButtonProps {
  icon: ReactNode;
  onClick: () => void;
  title: string;
  variant?: 'default' | 'delete' | 'primary';
  disabled?: boolean;
}

export function ControlButton({
  icon,
  onClick,
  title,
  variant = 'default',
  disabled = false,
}: ControlButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onClick();
      }}
      disabled={disabled}
      style={{
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: variant === 'primary' ? 'var(--color-brand-subtle)' : 'var(--color-bg-secondary)',
        border: variant === 'primary' ? '1px solid var(--color-brand)' : '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-card)',
        color: variant === 'primary' ? 'var(--color-brand)' : 'var(--color-text-secondary)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'var(--transition-fast)',
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        if (variant === 'delete') {
          e.currentTarget.style.background = 'var(--color-error)';
          e.currentTarget.style.borderColor = 'var(--color-error)';
          e.currentTarget.style.color = 'white';
        } else {
          e.currentTarget.style.background = 'var(--color-brand)';
          e.currentTarget.style.borderColor = 'var(--color-brand)';
          e.currentTarget.style.color = 'white';
        }
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = variant === 'primary' ? 'var(--color-brand-subtle)' : 'var(--color-bg-secondary)';
        e.currentTarget.style.borderColor = variant === 'primary' ? 'var(--color-brand)' : 'var(--color-border-default)';
        e.currentTarget.style.color = variant === 'primary' ? 'var(--color-brand)' : 'var(--color-text-secondary)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {icon}
    </button>
  );
}
