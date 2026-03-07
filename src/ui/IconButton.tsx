import type { ButtonHTMLAttributes } from 'react';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  title?: string;
  active?: boolean;
}

export function IconButton({
  icon,
  title,
  active,
  style,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      title={title}
      style={{
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-md)',
        background: active ? 'var(--color-brand)' : 'var(--color-bg-tertiary)',
        border: '1px solid',
        borderColor: active ? 'var(--color-brand)' : 'var(--color-border-default)',
        color: active ? 'white' : 'var(--color-text-secondary)',
        cursor: 'pointer',
        transition: 'var(--transition-fast)',
        ...style,
      }}
      {...props}
    >
      {icon}
    </button>
  );
}
