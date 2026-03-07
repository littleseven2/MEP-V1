import type { ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeId, onChange }: TabsProps) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: 4,
          borderBottom: '1px solid var(--color-border-default)',
          marginBottom: 12,
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            style={{
              padding: '8px 16px',
              background: activeId === tab.id ? 'var(--color-brand-subtle)' : 'transparent',
              color: activeId === tab.id ? 'var(--color-brand)' : 'var(--color-text-secondary)',
              border: 'none',
              borderBottom: activeId === tab.id ? '2px solid var(--color-brand)' : '2px solid transparent',
              fontFamily: 'var(--font-family)',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.find((t) => t.id === activeId)?.content}
    </div>
  );
}
