import React, { useState, useRef, useEffect } from 'react';
import { Check, Plus, MoreVertical, Trash2, Copy, ChevronRight, Scan } from 'lucide-react';
import { useMessageStore } from '../../store/messageStore';
import { defaultThemes, defaultTextStyles, gradientPresets } from '../../data/defaults';
import type { ThemeConfig, TextStyleKey, TextStyle, Padding } from '../../types/message';
import type { BackgroundConfig } from '../../types/message';
import { parsePadding, isUniformPadding, uniformPaddingValue } from '../../types/message';
import { Select, Input } from '../../ui';

let themeIdCounter = 100;

const defaultThemeState = [...defaultThemes];

export function useThemeManager() {
  const message = useMessageStore((s) => s.message);
  const setTheme = useMessageStore((s) => s.setTheme);

  const [themes, setThemes] = useState<ThemeConfig[]>(() => [...defaultThemeState]);
  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    const msgId = message?.theme.id;
    if (msgId && defaultThemeState.some((t) => t.id === msgId)) return msgId;
    return defaultThemeState[0].id;
  });

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
        textStyles: { ...defaultTextStyles },
      },
      spacing: 'normal',
      emailPadding: 0,
      sectionPadding: 0,
      componentPadding: 0,
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

  const activeTheme = themes.find((t) => t.id === activeThemeId) ?? themes[0];

  const updateTheme = (themeId: string, updates: Partial<ThemeConfig>) => {
    setThemes((prev) =>
      prev.map((t) => (t.id === themeId ? { ...t, ...updates } : t))
    );
    if (themeId === activeThemeId) {
      const current = themes.find((t) => t.id === themeId) ?? activeTheme;
      setTheme({ ...current, ...updates });
    }
  };

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

function StyleSection({
  title,
  preview,
  children,
  defaultOpen,
}: {
  title: string;
  preview: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div
      className={!open ? 'mep-card-hover' : undefined}
      style={{
        background: 'var(--color-bg-tertiary)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 6,
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          padding: '14px 14px 14px 16px',
          gap: 12,
          width: '100%',
          background: 'none',
          border: 'none',
          textAlign: 'left',
          fontFamily: 'inherit',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--color-text-tertiary)',
            letterSpacing: '0.02em',
            marginBottom: 10,
            fontFamily: 'var(--font-display)',
          }}>
            {title}
          </div>
          {preview}
        </div>
        <ChevronRight
          size={16}
          style={{
            flexShrink: 0,
            color: 'var(--color-text-muted)',
            transition: 'transform 0.2s ease',
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          }}
        />
      </button>
      {open && (
        <div style={{
          padding: '0 16px 16px',
          borderTop: '1px solid var(--color-border-default)',
          paddingTop: 14,
        }}>
          {children}
        </div>
      )}
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

  const updateTypography = (key: 'headlineFont' | 'bodyFont', value: string) => {
    onUpdate({ typography: { ...theme.typography, [key]: value } });
  };

  const textStyles = theme.typography.textStyles ?? defaultTextStyles;

  const updateTextStyle = (styleKey: TextStyleKey, field: keyof TextStyle, value: number) => {
    const updated = {
      ...textStyles,
      [styleKey]: { ...textStyles[styleKey], [field]: value },
    };
    onUpdate({ typography: { ...theme.typography, textStyles: updated } });
  };

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Theme name */}
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
          transition: 'var(--transition-fast)',
        }}
      />

      {/* Themes preview card */}
      <div style={{
        background: 'var(--color-bg-tertiary)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 6,
        padding: '14px 16px',
      }}>
        <div style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--color-text-tertiary)',
          letterSpacing: '0.02em',
          marginBottom: 12,
          fontFamily: 'var(--font-display)',
        }}>
          Themes
        </div>
        <div style={{
          background: 'transparent',
          borderRadius: parseInt(theme.radius) || 8,
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: 'none',
          overflow: 'hidden',
        }}>
          <span style={{
            fontSize: 28,
            fontWeight: 700,
            color: theme.colors.text,
            fontFamily: theme.typography.headlineFont,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            flexShrink: 0,
          }}>
            Aa
          </span>
          <div style={{ display: 'flex', flexShrink: 0 }}>
            {[theme.colors.secondary, theme.colors.background, theme.colors.text].map((c, i) => (
              <div key={i} style={{
                width: 24,
                height: 24,
                borderRadius: i === 0 ? '5px 0 0 5px' : i === 2 ? '0 5px 5px 0' : 0,
                background: c,
                border: '1px solid rgba(255,255,255,0.12)',
              }} />
            ))}
          </div>
          <div style={{
            background: theme.colors.primary,
            color: theme.colors.text,
            fontSize: 9,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: Math.max(2, (parseInt(theme.radius) || 8) / 2),
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            fontFamily: theme.typography.bodyFont,
            flexShrink: 0,
          }}>
            BUTTON
          </div>
        </div>
      </div>

      {/* Fonts */}
      <StyleSection
        title="Fonts"
        preview={
          <div>
            <div style={{
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              fontFamily: theme.typography.headlineFont,
              lineHeight: 1.3,
              marginBottom: 4,
            }}>
              Heading
            </div>
            <div style={{
              fontSize: 13,
              color: 'var(--color-text-secondary)',
              fontFamily: theme.typography.bodyFont,
              lineHeight: 1.4,
            }}>
              This is your paragraph.
            </div>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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

          <div style={{
            borderTop: '1px solid var(--color-border-default)',
            paddingTop: 12,
          }}>
            <TypeScaleGroup
              groupLabel="Heading"
              entries={headingStyleEntries}
              textStyles={textStyles}
              font={theme.typography.headlineFont}
              onStyleChange={updateTextStyle}
            />
            <TypeScaleGroup
              groupLabel="Body"
              entries={bodyStyleEntries}
              textStyles={textStyles}
              font={theme.typography.bodyFont}
              onStyleChange={updateTextStyle}
              style={{ marginTop: 8 }}
            />
          </div>
        </div>
      </StyleSection>

      {/* Colors */}
      <StyleSection
        title="Colors"
        preview={
          <div style={{ display: 'flex' }}>
            {([
              { c: theme.colors.primary, label: 'Primary' },
              { c: theme.colors.secondary, label: 'Secondary' },
              { c: theme.colors.background, label: 'Background' },
              { c: theme.colors.text, label: 'Text' },
            ]).map((item, i) => (
              <div
                key={i}
                title={item.label}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: i === 0 ? '6px 0 0 6px' : i === 3 ? '0 6px 6px 0' : 0,
                  background: item.c,
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              />
            ))}
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ColorRow label="Primary" value={theme.colors.primary} onChange={(v) => updateColor('primary', v)} />
          <ColorRow label="Background" value={theme.colors.background} onChange={(v) => updateColor('background', v)} />
          <ColorRow label="Text" value={theme.colors.text} onChange={(v) => updateColor('text', v)} />
          <ColorRow label="Secondary text" value={theme.colors.secondary} onChange={(v) => updateColor('secondary', v)} />
        </div>
      </StyleSection>

      {/* Email Background */}
      <StyleSection
        title="Email Background"
        preview={
          <div style={{
            width: 32, height: 32, borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.12)',
            background: theme.background.value,
          }} />
        }
      >
        <EmailBackgroundControl
          value={theme.background}
          onChange={(bg) => onUpdate({ background: bg })}
        />
      </StyleSection>

      {/* Spacing */}
      <StyleSection
        title="Spacing"
        preview={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{
              fontSize: 12,
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-family)',
              textTransform: 'capitalize',
            }}>
              {theme.spacing}
            </span>
            <span style={{ width: 1, height: 12, background: 'var(--color-border-default)' }} />
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-family)' }}>
              E:{uniformPaddingValue(theme.emailPadding)} S:{uniformPaddingValue(theme.sectionPadding)} C:{uniformPaddingValue(theme.componentPadding)}
            </span>
          </div>
        }
      >
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
          <PaddingControl
            label="Email padding"
            value={theme.emailPadding ?? 0}
            onChange={(v) => onUpdate({ emailPadding: v })}
          />
          <PaddingControl
            label="Section padding"
            value={theme.sectionPadding ?? 0}
            onChange={(v) => onUpdate({ sectionPadding: v })}
          />
          <PaddingControl
            label="Component padding"
            value={theme.componentPadding ?? 0}
            onChange={(v) => onUpdate({ componentPadding: v })}
          />
        </div>
      </StyleSection>

      {/* Image Block */}
      <StyleSection
        title="Image Block"
        preview={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-family)' }}>
              {theme.radius} radius
            </span>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input
            label="Image radius"
            fullWidth
            value={theme.radius}
            onChange={(e) => onUpdate({ radius: e.target.value })}
            placeholder="e.g. 8px"
          />
        </div>
      </StyleSection>

      {/* Radius */}
      <StyleSection
        title="Radius"
        preview={
          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-family)' }}>
            {theme.radius}
          </span>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input
            label="Border radius"
            fullWidth
            value={theme.radius}
            onChange={(e) => onUpdate({ radius: e.target.value })}
            placeholder="e.g. 8px"
          />
        </div>
      </StyleSection>
    </div>
  );
}

const headingStyleEntries: [TextStyleKey, string][] = [
  ['display', 'Display'],
  ['headline', 'Headline'],
  ['subheadline', 'Subheadline'],
  ['title', 'Title'],
  ['bodyLarge', 'Body (Large)'],
];

const bodyStyleEntries: [TextStyleKey, string][] = [
  ['body', 'Body'],
  ['label', 'Label'],
  ['legal', 'Legal'],
];

function TypeScaleGroup({
  groupLabel,
  entries,
  textStyles,
  font,
  onStyleChange,
  style: containerStyle,
}: {
  groupLabel: string;
  entries: [TextStyleKey, string][];
  textStyles: Record<TextStyleKey, TextStyle>;
  font: string;
  onStyleChange: (key: TextStyleKey, field: keyof TextStyle, value: number) => void;
  style?: React.CSSProperties;
}) {
  return (
    <div style={containerStyle}>
      <div style={{
        fontSize: 10,
        fontWeight: 600,
        color: 'var(--color-text-muted)',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        marginBottom: 4,
        fontFamily: 'var(--font-display)',
      }}>
        {groupLabel}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {entries.map(([key, label]) => (
          <FontStyleRow
            key={key}
            label={label}
            style={textStyles[key]}
            font={font}
            onChange={(field, value) => onStyleChange(key, field, value)}
          />
        ))}
      </div>
    </div>
  );
}

const weightOptions: { value: number; label: string }[] = [
  { value: 100, label: 'Thin' },
  { value: 200, label: 'Extra Light' },
  { value: 300, label: 'Light' },
  { value: 400, label: 'Regular' },
  { value: 500, label: 'Medium' },
  { value: 600, label: 'Semi Bold' },
  { value: 700, label: 'Bold' },
  { value: 800, label: 'Extra Bold' },
  { value: 900, label: 'Black' },
];


function FontStyleRow({
  label,
  style,
  font,
  onChange,
}: {
  label: string;
  style: TextStyle;
  font: string;
  onChange: (field: keyof TextStyle, value: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const previewSize = Math.min(style.fontSize, 22);

  return (
    <div style={{
      borderBottom: '1px solid var(--color-border-default)',
    }}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'inherit',
        }}
      >
        <span style={{
          flex: 1,
          fontSize: previewSize,
          fontWeight: style.fontWeight,
          fontFamily: font,
          color: 'var(--color-text-primary)',
          lineHeight: 1.3,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {label}
        </span>
        <span style={{
          fontSize: 11,
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-family)',
          fontWeight: 400,
          flexShrink: 0,
        }}>
          {style.fontSize}px
        </span>
        <ChevronRight
          size={12}
          style={{
            flexShrink: 0,
            color: 'var(--color-text-muted)',
            transition: 'transform 0.15s ease',
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {expanded && (
        <div style={{
          paddingBottom: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                fontSize: 10,
                color: 'var(--color-text-muted)',
                marginBottom: 3,
                fontFamily: 'var(--font-family)',
              }}>
                Size
              </label>
              <input
                type="number"
                value={style.fontSize}
                onChange={(e) => onChange('fontSize', Math.max(8, Number(e.target.value) || 12))}
                className="mep-input"
                style={{
                  width: '100%',
                  height: 30,
                  padding: '0 6px',
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 6,
                  color: 'var(--color-text-primary)',
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  textAlign: 'center',
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ flex: 1.5 }}>
              <label style={{
                display: 'block',
                fontSize: 10,
                color: 'var(--color-text-muted)',
                marginBottom: 3,
                fontFamily: 'var(--font-family)',
              }}>
                Weight
              </label>
              <select
                value={style.fontWeight}
                onChange={(e) => onChange('fontWeight', Number(e.target.value))}
                style={{
                  width: '100%',
                  height: 30,
                  padding: '0 6px',
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 6,
                  color: 'var(--color-text-primary)',
                  fontSize: 12,
                  fontFamily: 'var(--font-family)',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 6px center',
                  paddingRight: 22,
                }}
              >
                {weightOptions.map((w) => (
                  <option key={w.value} value={w.value}>
                    {w.label} ({w.value})
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                fontSize: 10,
                color: 'var(--color-text-muted)',
                marginBottom: 3,
                fontFamily: 'var(--font-family)',
              }}>
                Line H
              </label>
              <input
                type="number"
                value={style.lineHeight}
                onChange={(e) => onChange('lineHeight', Math.max(1, Number(e.target.value) || style.fontSize))}
                className="mep-input"
                style={{
                  width: '100%',
                  height: 30,
                  padding: '0 6px',
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 6,
                  color: 'var(--color-text-primary)',
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  textAlign: 'center',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>
      )}
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
      className="mep-panel-item"
      data-active={isActive || undefined}
      onClick={onSelect}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        background: isActive ? 'var(--color-brand-subtle)' : 'transparent',
        border: isActive ? '1px solid var(--color-brand)' : '1px solid transparent',
        borderRadius: 12,
        cursor: 'pointer',
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
        <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', visibility: isActive ? 'visible' : 'hidden' }}>Active</div>
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


function ThemeStepperBtn({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  const [h, setH] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: !disabled && h ? 'var(--color-bg-hover)' : 'var(--color-bg-tertiary)',
        border: !disabled && h ? '1px solid var(--color-border-strong)' : '1px solid var(--color-border-default)',
        color: disabled ? 'var(--color-text-muted)' : h ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
        cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 18,
        opacity: disabled ? 0.4 : 1,
        transition: 'var(--transition-fast)',
      }}
    >
      {children}
    </button>
  );
}

function ThemeStepperInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      className="mep-input"
      style={{
        width: 40, height: 36, borderRadius: 8,
        border: '1px solid var(--color-border-default)', background: 'var(--color-bg-tertiary)',
        color: 'var(--color-text-primary)', fontSize: 14, textAlign: 'center',
        outline: 'none', fontFamily: 'var(--font-family)',
        transition: 'var(--transition-fast)',
      }}
    />
  );
}

const SIDE_LABELS = ['T', 'R', 'B', 'L'] as const;

function PaddingControl({ label, value, onChange }: { label: string; value: Padding; onChange: (v: Padding) => void }) {
  const uniform = isUniformPadding(value);
  const [expanded, setExpanded] = useState(!uniform);
  const sides = parsePadding(value);

  const toggleLink = () => {
    if (expanded) {
      onChange(sides[0]);
      setExpanded(false);
    } else {
      setExpanded(true);
      if (typeof value === 'number') onChange([value, value, value, value]);
    }
  };

  const updateUniform = (v: number) => onChange(Math.max(0, v));

  const updateSide = (idx: number, v: number) => {
    const next: [number, number, number, number] = [...sides];
    next[idx] = Math.max(0, v);
    onChange(next);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <label style={{
          fontSize: '0.75rem',
          fontFamily: 'var(--font-display)',
          color: 'var(--color-text-secondary)',
        }}>
          {label}
        </label>
        <button
          type="button"
          onClick={toggleLink}
          title={expanded ? 'Link all sides' : 'Unlink sides'}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: expanded ? 'var(--color-brand)' : 'var(--color-text-muted)',
            padding: 2, display: 'flex', alignItems: 'center',
            transition: 'color var(--transition-fast)',
          }}
        >
          <Scan size={13} />
        </button>
      </div>
      {!expanded ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThemeStepperBtn onClick={() => updateUniform(uniformPaddingValue(value) - 1)} disabled={uniformPaddingValue(value) <= 0}>‹</ThemeStepperBtn>
          <ThemeStepperInput value={uniformPaddingValue(value)} onChange={(v) => updateUniform(v || 0)} />
          <ThemeStepperBtn onClick={() => updateUniform(uniformPaddingValue(value) + 1)}>›</ThemeStepperBtn>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {SIDE_LABELS.map((lbl, i) => (
            <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 10, color: 'var(--color-text-muted)', width: 12, textAlign: 'center', fontFamily: 'var(--font-family)' }}>{lbl}</span>
              <input
                type="number"
                value={sides[i]}
                onChange={(e) => updateSide(i, parseFloat(e.target.value) || 0)}
                className="mep-input"
                style={{
                  width: '100%', height: 30, borderRadius: 6,
                  border: '1px solid var(--color-border-default)', background: 'var(--color-bg-tertiary)',
                  color: 'var(--color-text-primary)', fontSize: 12, textAlign: 'center',
                  outline: 'none', fontFamily: 'var(--font-family)',
                  transition: 'var(--transition-fast)',
                }}
              />
            </div>
          ))}
        </div>
      )}
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

function isGradientValue(v: string) {
  return v.startsWith('linear-gradient(') || v.startsWith('radial-gradient(');
}

const bgTabStyle = (active: boolean): React.CSSProperties => ({
  flex: 1,
  padding: '5px 0',
  fontSize: 11,
  fontWeight: 600,
  fontFamily: 'var(--font-family)',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  background: active ? 'var(--color-bg-hover)' : 'transparent',
  color: active ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
  transition: 'var(--transition-fast)',
});

function EmailBackgroundControl({ value, onChange }: {
  value: BackgroundConfig;
  onChange: (bg: BackgroundConfig) => void;
}) {
  const isGrad = isGradientValue(value.value);
  const mode: 'solid' | 'gradient' = isGrad ? 'gradient' : 'solid';

  const switchMode = (m: 'solid' | 'gradient') => {
    if (m === mode) return;
    if (m === 'gradient') {
      onChange({ type: 'gradient', value: gradientPresets[0].value });
    } else {
      onChange({ type: 'solid', value: '#000000' });
    }
  };

  const activePreset = isGrad ? gradientPresets.find((p) => p.value === value.value) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 2, padding: 2, background: 'var(--color-bg-tertiary)', borderRadius: 7, border: '1px solid var(--color-border-default)' }}>
        <button type="button" onClick={() => switchMode('solid')} style={bgTabStyle(mode === 'solid')}>Solid</button>
        <button type="button" onClick={() => switchMode('gradient')} style={bgTabStyle(mode === 'gradient')}>Gradient</button>
      </div>
      {mode === 'solid' ? (
        <ColorRow
          label="Color"
          value={value.value}
          onChange={(v) => onChange({ type: 'solid', value: v })}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            height: 48, borderRadius: 6, border: '1px solid var(--color-border-default)',
            background: value.value,
          }} />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 6,
          }}>
            {gradientPresets.map((preset) => {
              const isActive = preset.value === value.value;
              return (
                <button
                  key={preset.id}
                  type="button"
                  title={preset.name}
                  onClick={() => onChange({ type: 'gradient', value: preset.value })}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: 6,
                    border: isActive ? '2px solid var(--color-brand)' : '1px solid var(--color-border-default)',
                    background: preset.value,
                    cursor: 'pointer',
                    padding: 0,
                    outline: isActive ? '1px solid var(--color-brand)' : 'none',
                    outlineOffset: 1,
                    transition: 'var(--transition-fast)',
                  }}
                />
              );
            })}
          </div>
          {activePreset && (
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-family)', textAlign: 'center' }}>
              {activePreset.name}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
