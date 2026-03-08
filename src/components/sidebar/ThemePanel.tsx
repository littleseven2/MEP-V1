import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useMessageStore } from '../../store/messageStore';
import { defaultThemes } from '../../data/defaults';
import type { ThemeConfig } from '../../types/message';
import { Select, Input } from '../../ui';

export function ThemePanel() {
  const message = useMessageStore((s) => s.message);
  const setTheme = useMessageStore((s) => s.setTheme);

  if (!message) return null;

  const theme = message.theme;
  const isCustom = theme.id === 'custom' || !defaultThemes.some((t) => t.id === theme.id);

  const handlePresetSelect = (t: ThemeConfig) => setTheme({ ...t });

  const handleCustomize = (updates: Partial<ThemeConfig>) => {
    setTheme({ ...theme, id: 'custom', name: 'Custom', ...updates });
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{
        marginBottom: 20, paddingBottom: 16,
        borderBottom: '1px solid var(--color-border-default)',
      }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 11, fontWeight: 600,
          color: 'var(--color-text-tertiary)',
          textTransform: 'none',
          letterSpacing: 'var(--letter-spacing-wide)',
          marginBottom: 12,
        }}>
          Presets
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {defaultThemes.map((t) => (
            <ThemeCard
              key={t.id}
              theme={t}
              selected={theme.id === t.id && !isCustom}
              onClick={() => handlePresetSelect(t)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 11, fontWeight: 600,
          color: 'var(--color-text-tertiary)',
          textTransform: 'none',
          letterSpacing: 'var(--letter-spacing-wide)',
          marginBottom: 12,
        }}>
          Customize
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Select
            label="Background type"
            options={[
              { value: 'solid', label: 'Solid' },
              { value: 'gradient', label: 'Gradient' },
              { value: 'blur', label: 'Blur' },
              { value: 'image', label: 'Image' },
            ]}
            value={theme.background.type}
            onChange={(v) => handleCustomize({ background: { ...theme.background, type: v as ThemeConfig['background']['type'] } })}
          />
          <ColorRow label="Primary color" value={theme.colors.primary} onChange={(v) => handleCustomize({ colors: { ...theme.colors, primary: v } })} />
          <ColorRow label="Text color" value={theme.colors.text} onChange={(v) => handleCustomize({ colors: { ...theme.colors, text: v } })} />
          <Select
            label="Spacing"
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'normal', label: 'Normal' },
              { value: 'relaxed', label: 'Relaxed' },
            ]}
            value={theme.spacing}
            onChange={(v) => handleCustomize({ spacing: v as ThemeConfig['spacing'] })}
          />
          <Input
            label="Border radius"
            value={theme.radius}
            onChange={(e) => handleCustomize({ radius: e.target.value })}
            placeholder="e.g. 8px"
          />
        </div>
      </div>
    </div>
  );
}

const ThemeCard: React.FC<{
  theme: ThemeConfig; selected: boolean; onClick: () => void;
}> = ({ theme, selected, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: 12,
        background: selected ? 'var(--color-brand-subtle)' : 'var(--color-bg-tertiary)',
        border: `1px solid ${selected ? 'var(--color-brand)' : 'var(--color-border-default)'}`,
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer', transition: 'all var(--transition-fast)',
        transform: hovered ? 'translateX(4px)' : 'none',
        boxShadow: selected ? '0 0 0 1px var(--color-brand)' : 'none',
      }}
    >
      <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
        <div style={{ width: 20, height: 20, borderRadius: '4px 0 0 4px', background: theme.colors.primary, border: '1px solid rgba(255,255,255,0.1)' }} />
        <div style={{ width: 20, height: 20, background: theme.colors.background, border: '1px solid rgba(255,255,255,0.1)' }} />
        <div style={{ width: 20, height: 20, borderRadius: '0 4px 4px 0', background: theme.colors.text, border: '1px solid rgba(255,255,255,0.1)' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {theme.name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>
          {theme.spacing} · {theme.radius}
        </div>
      </div>
      {selected && <Check size={16} color="var(--color-brand)" />}
    </div>
  );
};

const ColorRow: React.FC<{
  label: string; value: string; onChange: (v: string) => void;
}> = ({ label, value, onChange }) => (
  <div>
    <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
      {label}
    </label>
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: 36, height: 36, borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border-default)', cursor: 'pointer',
          padding: 2, background: 'var(--color-bg-tertiary)',
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mep-input"
        style={{
          flex: 1, height: 36, padding: '0 12px',
          background: 'var(--color-bg-tertiary)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-text-primary)',
          fontSize: '0.875rem', fontFamily: 'var(--font-mono)',
          outline: 'none', transition: 'all var(--transition-fast)',
        }}
      />
    </div>
  </div>
);
