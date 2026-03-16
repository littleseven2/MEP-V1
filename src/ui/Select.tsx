import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: React.ReactNode;
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
  const [hovered, setHovered] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectId = id ?? `select-${Math.random().toString(36).slice(2)}`;

  const selected = options.find((o) => o.value === value);
  const dims = sizeMap[size];

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      setOpen(false);
    };
    const handleScroll = () => updatePosition();
    document.addEventListener('mousedown', handleClick);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [open, updatePosition]);

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
        ref={buttonRef}
        id={selectId}
        type="button"
        className="mep-select"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          height: dims.height,
          padding: dims.padding,
          fontSize: dims.fontSize,
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-bg-tertiary)',
          border: error ? '1px solid var(--color-danger)' : hovered && !disabled ? '1px solid var(--color-border-strong)' : '1px solid var(--color-border-default)',
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
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{
            position: 'absolute', right: 8, top: '50%', transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`,
            transition: 'transform 150ms ease',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && dropdownPos && createPortal(
        <div ref={dropdownRef} style={{
          position: 'fixed',
          top: dropdownPos.top,
          left: dropdownPos.left,
          width: dropdownPos.width,
          background: 'var(--color-bg-tertiary)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          zIndex: 10000,
          overflow: 'hidden',
          maxHeight: 200,
          overflowY: 'auto',
          scrollbarWidth: 'none',
        }}>
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                padding: '10px 12px',
                fontSize: dims.fontSize,
                fontFamily: 'var(--font-family)',
                color: opt.value === value ? 'var(--color-brand)' : 'var(--color-text-primary)',
                background: opt.value === value ? 'var(--color-brand-subtle)' : 'transparent',
                cursor: 'pointer',
                transition: 'background 100ms ease',
              }}
              onMouseEnter={(e) => {
                if (opt.value !== value) e.currentTarget.style.background = 'var(--color-bg-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = opt.value === value ? 'var(--color-brand-subtle)' : 'transparent';
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>,
        document.body,
      )}

      {error && (
        <p style={{ marginTop: 4, fontSize: '0.75rem', color: 'var(--color-danger)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
