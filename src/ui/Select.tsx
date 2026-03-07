import type { SelectHTMLAttributes } from 'react';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'onChange'> {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  size?: SelectSize;
  required?: boolean;
}

const sizeMap: Record<SelectSize, React.CSSProperties> = {
  sm: { height: 32, padding: '0 8px 0 8px', fontSize: '0.875rem' },
  md: { height: 40, padding: '0 32px 0 12px', fontSize: '0.875rem' },
  lg: { height: 48, padding: '0 40px 0 16px', fontSize: '1rem' },
};

const chevronSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`;

export function Select({
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
  size = 'md',
  required,
  disabled,
  style,
  id,
  ...props
}: SelectProps) {
  const selectId = id ?? `select-${Math.random().toString(36).slice(2)}`;

  const selectStyle: React.CSSProperties = {
    width: '100%',
    borderRadius: 'var(--radius-md)',
    background: 'var(--color-bg-tertiary)',
    border: error ? '1px solid var(--color-danger)' : '1px solid var(--color-border-default)',
    fontFamily: 'var(--font-family)',
    transition: 'var(--transition-fast)',
    outline: 'none',
    color: 'var(--color-text-primary)',
    appearance: 'none',
    backgroundImage: chevronSvg,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    backgroundSize: '16px',
    ...sizeMap[size],
    ...style,
  };

  return (
    <div>
      {label && (
        <label
          htmlFor={selectId}
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
          {required && ' *'}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        style={selectStyle}
        className="mep-select"
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p style={{ marginTop: 4, fontSize: '0.75rem', color: 'var(--color-danger)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
