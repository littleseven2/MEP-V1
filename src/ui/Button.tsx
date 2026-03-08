import { useState } from 'react';
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const sizeMap: Record<ButtonSize, CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: '0.875rem' },
  md: { padding: '8px 16px', fontSize: '0.875rem' },
  lg: { padding: '12px 24px', fontSize: '1rem' },
};

const baseStyle: CSSProperties = {
  borderRadius: 'var(--radius-md)',
  fontFamily: 'var(--font-family)',
  fontWeight: 500,
  transition: 'var(--transition-fast)',
  border: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: 'var(--color-brand)',
    color: 'white',
  },
  secondary: {
    background: 'var(--color-bg-tertiary)',
    border: '1px solid var(--color-border-default)',
    color: 'var(--color-text-primary)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-text-primary)',
  },
  danger: {
    background: 'var(--color-danger)',
    color: 'white',
  },
};

const hoverStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: 'var(--color-brand-hover)',
    boxShadow: 'var(--shadow-brand)',
  },
  secondary: {
    background: 'var(--color-bg-hover)',
  },
  ghost: {
    background: 'var(--color-bg-tertiary)',
  },
  danger: {
    background: 'var(--color-danger-hover)',
  },
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  style,
  disabled,
  ...props
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const mergedStyle: CSSProperties = {
    ...baseStyle,
    ...sizeMap[size],
    ...variantStyles[variant],
    ...(hovered && !disabled ? hoverStyles[variant] : {}),
    ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
    ...style,
  };

  return (
    <button
      type="button"
      style={mergedStyle}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      {children}
    </button>
  );
}
