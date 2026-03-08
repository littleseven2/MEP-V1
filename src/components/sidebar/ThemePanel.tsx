import React, { useState, useRef, useEffect } from 'react';
import { Check, Plus, MoreVertical, Trash2, Copy } from 'lucide-react';
import { useMessageStore } from '../../store/messageStore';
import { defaultThemes } from '../../data/defaults';
import type { ThemeConfig } from '../../types/message';
import { Select, Input } from '../../ui';

let themeIdCounter = 100;

const defaultThemeState = [...defaultThemes];

export function useThemeManager() {
  const message = useMessageStore((s) => s.message);
  const setTheme = useMessageStore((s) => s.setTheme);

  const [themes, setThemes] = useState<ThemeConfig[]>(() => [...defaultThemeState]);
  const [activeThemeId, setActiveThemeId] = useState<string>(() => message?.theme.id ?? 'default-dark');

  const applyTheme = (theme: ThemeConfig) => {
    setActiveThemeId(theme.id);
    setTheme({ ...theme });
  };

  const selectTheme = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId);
    if (theme) applyTheme(theme);
  };

  const createNewTheme = () => {
    const newTheme: ThemeConfig = {
      id: `custom-${themeIdCounter++}`,
      name: 'New Theme',
      radius: '8px',
      colors: {
        primary: '#E54D4D',
        secondary: '#A0A0AB',
        background: '#0D0D0F',
        text: '#FFFFFF',
      },
      typography: {
        headlineFont: 'Inter',
        bodyFont: 'Inter',
      },
      spacing: 'normal',
      background: {
        type: 'solid',
        value: '#0D0D0F',
        opacity: 1,
      },
    };
    setThemes((prev) => [...prev, newTheme]);
    applyTheme(newTheme);
    return newTheme.id;
  };

  const deleteTheme = (themeId: string) => {
    if (themes.length <= 1) return;
    setThemes((prev) => prev.filter((t) => t.id !== themeId));
    if (activeThemeId === themeId) {
      const remaining = themes.filter((t) => t.id !== themeId);
      if (remaining.length > 0) applyTheme(remaining[0]);
    }
  };

  const duplicateTheme = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId);
    if (!theme) return;
    const dup: ThemeConfig = {
      ...JSON.parse(JSON.stringify(theme)),
      id: `custom-${themeIdCounter++}`,
      name: `${theme.name} Copy`,
    };
    setThemes((prev) => [...prev, dup]);
    applyTheme(dup);
    return dup.id;
  };

  const updateTheme = (themeId: string, updates: Partial<ThemeConfig>) => {
    setThemes((prev) =>
      prev.map((t) => (t.id === themeId ? { ...t, ...updates } : t))
    );
    if (themeId === activeThemeId) {
      const current = themes.find((t) => t.id === themeId);
      if (current) setTheme({ ...current, ...updates });
    }
  };

  const activeTheme = themes.find((t) => t.id === activeThemeId) ?? themes[0];

  return {
    themes,
    activeThemeId,
    activeTheme,
    selectTheme,
    createNewTheme,
    deleteTheme,
    duplicateTheme,
    updateTheme,
  };
}

export function ThemePanel({
  themes,
  activeThemeId,
  onSelect,
  onDelete,
  onDuplicate,
  onCreate,
}: {
  themes: ThemeConfig[];
  activeThemeId: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onCreate: () => void;
}) {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {themes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isActive={theme.id === activeThemeId}
            onSelect={() => onSelect(theme.id)}
            onDelete={themes.length > 1 ? () => onDelete(theme.id) : undefined}
            onDuplicate={() => onDuplicate(theme.id)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onCreate}
        style={{
          width: '100%',
          padding: '10px 16px',
          border: '2px dashed var(--color-border-default)',
          borderRadius: 10,
          background: 'transparent',
          color: 'var(--color-text-secondary)',
          fontFamily: 'var(--font-family)',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'var(--transition-fast)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginTop: 8,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-brand)';
          e.currentTarget.style.color = 'var(--color-brand)';
          e.currentTarget.style.background = 'var(--color-brand-subtle)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border-default)';
          e.currentTarget.style.color = 'var(--color-text-secondary)';
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <Plus size={14} />
        Create New Theme
      </button>
    </div>
  );
}

export function ThemePropertiesPanel({
  theme,
  onUpdate,
}: {
  theme: ThemeConfig;
  onUpdate: (updates: Partial<ThemeConfig>) => void;
}) {
  const updateColor = (key: keyof ThemeConfig['colors'], value: string) => {
    onUpdate({ colors: { ...theme.colors, [key]: value } });
  };

  const updateTypography = (key: keyof ThemeConfig['typography'], value: string) => {
    onUpdate({ typography: { ...theme.typography, [key]: value } });
  };

  return (
    <div style={{ padding: 20 }}>
      <input
        type="text"
        className="mep-input"
        value={theme.name}
        onChange={(e) => onUpdate({ name: e.target.value })}
        placeholder="Theme name"
        style={{
          width: '100%',
          height: 40,
          padding: '0 12px',
          background: 'var(--color-bg-tertiary)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-text-primary)',
          fontSize: 14,
          fontWeight: 500,
          fontFamily: 'var(--font-family)',
          outline: 'none',
          marginBottom: 16,
          transition: 'var(--transition-fast)',
        }}
      />

      <EditorSection title="Colors">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ColorRow label="Primary" value={theme.colors.primary} onChange={(v) => updateColor('primary', v)} />
          <ColorRow label="Background" value={theme.colors.background} onChange={(v) => updateColor('background', v)} />
          <ColorRow label="Text" value={theme.colors.text} onChange={(v) => updateColor('text', v)} />
          <ColorRow label="Secondary text" value={theme.colors.secondary} onChange={(v) => updateColor('secondary', v)} />
        </div>
      </EditorSection>

      <EditorSection title="Typography">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Select
            label="Heading font"
            options={[
              { value: 'Inter', label: 'Inter' },
              { value: 'Netflix Sans', label: 'Netflix Sans' },
              { value: 'Roboto', label: 'Roboto' },
              { value: 'Arial', label: 'Arial' },
            ]}
            value={theme.typography.headlineFont}
            onChange={(v) => updateTypography('headlineFont', v)}
          />
          <Select
            label="Body font"
            options={[
              { value: 'Inter', label: 'Inter' },
              { value: 'Netflix Sans', label: 'Netflix Sans' },
              { value: 'Roboto', label: 'Roboto' },
              { value: 'Arial', label: 'Arial' },
            ]}
            value={theme.typography.bodyFont}
            onChange={(v) => updateTypography('bodyFont', v)}
          />
        </div>
      </EditorSection>

      <EditorSection title="Spacing" last>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Select
            label="Content spacing"
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'normal', label: 'Normal' },
              { value: 'relaxed', label: 'Relaxed' },
            ]}
            value={theme.spacing}
            onChange={(v) => onUpdate({ spacing: v as ThemeConfig['spacing'] })}
          />
          <Input
            label="Border radius"
            fullWidth
            value={theme.radius}
            onChange={(e) => onUpdate({ radius: e.target.value })}
            placeholder="e.g. 8px"
          />
        </div>
      </EditorSection>
    </div>
  );
}

function ThemeCard({
  theme,
  isActive,
  onSelect,
  onDelete,
  onDuplicate,
}: {
  theme: ThemeConfig;
  isActive: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  onDuplicate: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        background: isActive ? 'var(--color-brand-subtle)' : 'var(--color-bg-tertiary)',
        border: `1px solid ${isActive ? 'var(--color-brand)' : 'var(--color-border-default)'}`,
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        transform: hovered ? 'translateX(4px)' : 'none',
        boxShadow: isActive ? '0 0 0 1px var(--color-brand)' : 'none',
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
        {isActive && (
          <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>Active</div>
        )}
      </div>
      {isActive && <Check size={16} color="var(--color-brand)" style={{ flexShrink: 0 }} />}

      <div ref={menuRef} style={{ position: 'relative', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
        <MenuBtn onClick={() => setMenuOpen(!menuOpen)} />
        {menuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 4,
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 8,
            padding: 4,
            minWidth: 130,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            zIndex: 100,
          }}>
            <DropdownItem icon={<Copy size={14} />} label="Duplicate" onClick={() => { setMenuOpen(false); onDuplicate(); }} />
            {onDelete && (
              <DropdownItem icon={<Trash2 size={14} />} label="Delete" variant="danger" onClick={() => { setMenuOpen(false); onDelete(); }} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MenuBtn({ onClick }: { onClick: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: 28,
        height: 28,
        background: h ? 'var(--color-bg-hover)' : 'transparent',
        border: 'none',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: h ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
        transition: 'var(--transition-fast)',
      }}
    >
      <MoreVertical size={16} />
    </button>
  );
}

function DropdownItem({ icon, label, onClick, variant }: { icon: React.ReactNode; label: string; onClick: () => void; variant?: 'danger' }) {
  const [h, setH] = useState(false);
  const isDanger = variant === 'danger';
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        borderRadius: 6,
        cursor: 'pointer',
        color: isDanger
          ? 'var(--color-error)'
          : h ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
        fontSize: 13,
        transition: 'var(--transition-fast)',
        border: 'none',
        background: h
          ? isDanger ? 'rgba(239, 68, 68, 0.1)' : 'var(--color-bg-tertiary)'
          : 'transparent',
        width: '100%',
        textAlign: 'left',
        fontFamily: 'var(--font-family)',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function EditorSection({ title, children, last }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{
      marginBottom: last ? 0 : 20,
      paddingBottom: last ? 0 : 16,
      borderBottom: last ? 'none' : '1px solid var(--color-border-default)',
    }}>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--color-text-tertiary)',
        textTransform: 'none',
        letterSpacing: 'var(--letter-spacing-wide)',
        marginBottom: 12,
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="color"
          className="mep-color-picker"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mep-input"
          style={{
            flex: 1, minWidth: 0, height: 36, padding: '0 12px',
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
}
