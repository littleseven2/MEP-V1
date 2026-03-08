import { useState, useRef, useEffect } from 'react';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  size?: SelectSize;
  required?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  id?: string;
}

const sizeMap: Record<SelectSize, { height: number; padding: string; fontSize: string }> = {
  sm: { height: 32, padding: '0 28px 0 8px', fontSize: '0.875rem' },
  md: { height: 36, padding: '0 32px 0 12px', fontSize: '0.875rem' },
  lg: { height: 44, padding: '0 40px 0 16px', fontSize: '1rem' },
};

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
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectId = id ?? `select-${Math.random().toString(36).slice(2)}`;

  const selected = options.find((o) => o.value === value);
  const dims = sizeMap[size];

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {label && (
        <label
          htmlFor={selectId}
          style={{
            display: 'block',
            textTransform: 'none',
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
      <button
        id={selectId}
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          height: dims.height,
          padding: dims.padding,
          fontSize: dims.fontSize,
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-bg-tertiary)',
          border: error ? '1px solid var(--color-danger)' : '1px solid var(--color-border-default)',
          fontFamily: 'var(--font-family)',
          color: selected ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          textAlign: 'left',
          position: 'relative',
          outline: 'none',
          transition: 'var(--transition-fast)',
          ...style,
        }}
      >
        {selected ? selected.label : placeholder || 'Select...'}
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{
            position: 'absolute', right: 8, top: '50%', transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`,
            transition: 'transform 150ms ease',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: 4,
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          zIndex: 100,
          overflow: 'hidden',
          maxHeight: 200,
          overflowY: 'auto',
        }}>
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                padding: '8px 12px',
                fontSize: dims.fontSize,
                fontFamily: 'var(--font-family)',
                color: opt.value === value ? 'var(--color-brand)' : 'var(--color-text-primary)',
                background: opt.value === value ? 'var(--color-brand-subtle)' : 'transparent',
                cursor: 'pointer',
                transition: 'background 100ms ease',
              }}
              onMouseEnter={(e) => {
                if (opt.value !== value) e.currentTarget.style.background = 'var(--color-bg-tertiary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = opt.value === value ? 'var(--color-brand-subtle)' : 'transparent';
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}

      {error && (
        <p style={{ marginTop: 4, fontSize: '0.75rem', color: 'var(--color-danger)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
