import type { InputHTMLAttributes } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  size?: InputSize;
  fullWidth?: boolean;
}

const sizeMap: Record<InputSize, React.CSSProperties> = {
  sm: { height: 32, padding: '0 8px', fontSize: '0.875rem' },
  md: { height: 40, padding: '0 12px', fontSize: '0.875rem' },
  lg: { height: 48, padding: '0 16px', fontSize: '1rem' },
};

export function Input({
  label,
  error,
  hint,
  size = 'md',
  fullWidth,
  style,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? `input-${Math.random().toString(36).slice(2)}`;

  const inputStyle: React.CSSProperties = {
    width: fullWidth ? '100%' : undefined,
    borderRadius: 'var(--radius-md)',
    background: 'var(--color-bg-tertiary)',
    border: error ? '1px solid var(--color-danger)' : '1px solid var(--color-border-default)',
    fontFamily: 'var(--font-family)',
    transition: 'var(--transition-fast)',
    outline: 'none',
    color: 'var(--color-text-primary)',
    ...sizeMap[size],
    ...style,
  };

  return (
    <div style={{ width: fullWidth ? '100%' : undefined }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            display: 'block',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text-secondary)',
            marginBottom: 4,
          }}
        >
          {label}
        </label>
      )}
      <input id={inputId} style={inputStyle} className="mep-input" {...props} />
      {error && (
        <p style={{ marginTop: 4, fontSize: '0.75rem', color: 'var(--color-danger)' }}>
          {error}
        </p>
      )}
      {hint && !error && (
        <p style={{ marginTop: 4, fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
          {hint}
        </p>
      )}
    </div>
  );
}
