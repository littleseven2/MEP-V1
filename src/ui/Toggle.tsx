import type { InputHTMLAttributes } from 'react';

export type ToggleSize = 'sm' | 'md';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  label?: string;
  size?: ToggleSize;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const sizeMap: Record<ToggleSize, { track: React.CSSProperties; thumb: React.CSSProperties }> = {
  sm: { track: { width: 30, height: 16 }, thumb: { width: 12, height: 12 } },
  md: { track: { width: 36, height: 20 }, thumb: { width: 16, height: 16 } },
};

export function Toggle({
  label,
  size = 'md',
  checked,
  onChange,
  disabled,
  style,
  ...props
}: ToggleProps) {
  const { track, thumb } = sizeMap[size];

  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <span
        style={{
          position: 'relative',
          display: 'inline-flex',
          flexShrink: 0,
          borderRadius: 9999,
          transition: 'var(--transition-fast)',
          ...track,
          background: checked
            ? 'var(--color-brand)'
            : 'rgba(255,255,255,0.1)',
          boxShadow: checked ? '0 0 0 2px var(--color-brand-glow)' : undefined,
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clip: 'rect(0,0,0,0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
          {...props}
        />
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: checked ? 'calc(100% - 2px)' : 2,
            transform: checked ? 'translateX(-100%)' : 'none',
            borderRadius: '50%',
            background: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            transition: 'var(--transition-fast)',
            ...thumb,
          }}
        />
      </span>
      {label && (
        <span
          style={{
            fontFamily: 'var(--font-family)',
            fontSize: '0.875rem',
            color: 'var(--color-text-primary)',
          }}
        >
          {label}
        </span>
      )}
    </label>
  );
}
