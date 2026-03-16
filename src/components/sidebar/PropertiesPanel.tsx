import { useState, useRef, type CSSProperties } from 'react';
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight,
  Link, Quote, List, ListOrdered,
  IndentDecrease, IndentIncrease, RemoveFormatting,
  Type, Highlighter, Baseline, ChevronDown,
  GripVertical, ChevronRight, Link2, Unlink2,
  Megaphone, Tags, Radio, Timer,
  Heading, PenLine, Database, Grid3X3,
  Image, MousePointerClick, Hash,
  Play, Film, Tv, Music, Gamepad2, Clapperboard,
  Star, Heart, Bookmark, Award, Trophy, Gem,
  Clock, Calendar, Bell, Zap, Flame, Sparkles,
  User, Users, Globe, MapPin, Compass, Navigation,
  Download, Share2, ExternalLink, Eye, Search,
  CheckCircle, Info, AlertCircle, Shield, Lock, Unlock,
} from 'lucide-react';
import { useMessageStore } from '../../store/messageStore';
import type {
  Section,
  MessageComponent,
  SectionHydration,
  BackgroundConfig,
  TextBlockSettings,
  RichTextSettings,
  MediaSettings,
  CTASettings,
  GridSettings,
  ListSettings,
  ListItem,
  ListItemStyle,
  ListColumns,
  GridCellStyle,
  ListThumbnailIcon,
  LinkedValues,
  LinkedValue,
  MarqueeConfig,
  ComponentCallout,
  ComponentMetadata,
  ComponentLiveBadge,
  ComponentCountdown,
  CountdownVariant,
  AttachmentKey,
  Padding,
} from '../../types/message';
import { parsePadding, isUniformPadding, uniformPaddingValue } from '../../types/message';
import {
  contentTypes,
  intentOptions,
  packageTypes,
  gradientPresets,
} from '../../data/defaults';
import { entityVariables, themeVariables } from '../../data/variables';
import { Select, Toggle, LinkedField, LinkedWrapper } from '../../ui';

const THUMBNAIL_ICONS: { icon: ListThumbnailIcon; label: string; Component: React.ComponentType<{ size?: number }> }[] = [
  { icon: 'play', label: 'Play', Component: Play },
  { icon: 'film', label: 'Film', Component: Film },
  { icon: 'tv', label: 'TV', Component: Tv },
  { icon: 'music', label: 'Music', Component: Music },
  { icon: 'gamepad-2', label: 'Gamepad', Component: Gamepad2 },
  { icon: 'clapperboard', label: 'Clapperboard', Component: Clapperboard },
  { icon: 'star', label: 'Star', Component: Star },
  { icon: 'heart', label: 'Heart', Component: Heart },
  { icon: 'bookmark', label: 'Bookmark', Component: Bookmark },
  { icon: 'award', label: 'Award', Component: Award },
  { icon: 'trophy', label: 'Trophy', Component: Trophy },
  { icon: 'gem', label: 'Gem', Component: Gem },
  { icon: 'clock', label: 'Clock', Component: Clock },
  { icon: 'calendar', label: 'Calendar', Component: Calendar },
  { icon: 'bell', label: 'Bell', Component: Bell },
  { icon: 'zap', label: 'Zap', Component: Zap },
  { icon: 'flame', label: 'Flame', Component: Flame },
  { icon: 'sparkles', label: 'Sparkles', Component: Sparkles },
  { icon: 'user', label: 'User', Component: User },
  { icon: 'users', label: 'Users', Component: Users },
  { icon: 'globe', label: 'Globe', Component: Globe },
  { icon: 'map-pin', label: 'Map Pin', Component: MapPin },
  { icon: 'compass', label: 'Compass', Component: Compass },
  { icon: 'navigation', label: 'Navigation', Component: Navigation },
  { icon: 'download', label: 'Download', Component: Download },
  { icon: 'share-2', label: 'Share', Component: Share2 },
  { icon: 'external-link', label: 'External', Component: ExternalLink },
  { icon: 'link', label: 'Link', Component: Link },
  { icon: 'eye', label: 'Eye', Component: Eye },
  { icon: 'search', label: 'Search', Component: Search },
  { icon: 'check-circle', label: 'Check', Component: CheckCircle },
  { icon: 'info', label: 'Info', Component: Info },
  { icon: 'alert-circle', label: 'Alert', Component: AlertCircle },
  { icon: 'shield', label: 'Shield', Component: Shield },
  { icon: 'lock', label: 'Lock', Component: Lock },
  { icon: 'unlock', label: 'Unlock', Component: Unlock },
];

function PropertyGroup({
  title,
  preview,
  children,
  defaultOpen = false,
}: {
  title: string;
  preview?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

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
          padding: '12px 12px 12px 14px',
          gap: 10,
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
            fontFamily: 'var(--font-family)',
            marginBottom: !open && preview ? 6 : 0,
          }}>
            {title}
          </div>
          {!open && preview && (
            <div style={{
              fontSize: 12,
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-family)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {preview}
            </div>
          )}
        </div>
        <ChevronRight
          size={14}
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
          padding: '0 14px 14px',
          borderTop: '1px solid var(--color-border-default)',
          paddingTop: 12,
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

function ContentCard({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={!open ? 'mep-card-hover' : undefined} style={{
      background: 'var(--color-bg-tertiary)',
      border: '1px solid var(--color-border-default)',
      borderRadius: 6,
      overflow: 'hidden',
    }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 10px',
        }}
      >
        {icon && (
          <div style={{
            width: 24, height: 24, borderRadius: 5,
            background: 'var(--color-bg-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-text-secondary)',
            flexShrink: 0,
          }}>
            {icon}
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 4,
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 0,
          }}
        >
          <span style={{
            flex: 1,
            fontSize: 12,
            fontWeight: 500,
            fontFamily: 'var(--font-family)',
            color: 'var(--color-text-primary)',
            userSelect: 'none',
            textAlign: 'left',
          }}>
            {title}
          </span>
          <ChevronRight
            size={11}
            style={{
              flexShrink: 0,
              color: 'var(--color-text-muted)',
              transform: open ? 'rotate(90deg)' : 'none',
              transition: 'transform 0.15s ease',
            }}
          />
        </button>
      </div>
      {open && (
        <div style={{
          padding: '0 10px 10px',
          borderTop: '1px solid var(--color-border-default)',
          paddingTop: 10,
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h3 style={{
      fontFamily: 'var(--font-family)',
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--color-text-tertiary)',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      margin: 0,
      padding: '8px 0 2px',
    }}>
      {title}
    </h3>
  );
}

function StepperBtn({ onClick, disabled, children, style }: { onClick: () => void; disabled?: boolean; children: React.ReactNode; style?: CSSProperties }) {
  const [h, setH] = useState(false);
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
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function StepperInput({ value, onChange, style }: { value: number; onChange: (v: number) => void; style?: CSSProperties }) {
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
        ...style,
      }}
    />
  );
}

const SIDE_LABELS = ['T', 'R', 'B', 'L'] as const;

function PaddingControl({ label = 'Padding', value, onChange }: { label?: string; value: Padding; onChange: (v: Padding) => void }) {
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

  const updateSide = (idx: number, v: number) => {
    const next: [number, number, number, number] = [...sides];
    next[idx] = Math.max(0, v);
    onChange(next);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <label style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)' }}>{label}</label>
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
          {expanded ? <Unlink2 size={13} /> : <Link2 size={13} />}
        </button>
      </div>
      {!expanded ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StepperBtn onClick={() => onChange(Math.max(0, uniformPaddingValue(value) - 1))} disabled={uniformPaddingValue(value) <= 0}>‹</StepperBtn>
          <StepperInput value={uniformPaddingValue(value)} onChange={(v) => onChange(Math.max(0, v || 0))} />
          <StepperBtn onClick={() => onChange(uniformPaddingValue(value) + 1)}>›</StepperBtn>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {SIDE_LABELS.map((lbl, i) => (
            <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 10, color: 'var(--color-text-muted)', width: 12, textAlign: 'center', fontFamily: 'var(--font-family)' }}>{lbl}</span>
              <StepperInput
                value={sides[i]}
                onChange={(v) => updateSide(i, v || 0)}
                style={{ width: '100%', height: 30, fontSize: 12, borderRadius: 6 }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


function isGradientValue(value: string): boolean {
  return value.startsWith('linear-gradient(') || value.startsWith('radial-gradient(');
}

const bgModeStyle = (active: boolean): CSSProperties => ({
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

function BackgroundControl({ value, onChange, label = 'Background' }: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  const isGrad = isGradientValue(value);

  const mode: 'solid' | 'gradient' = isGrad ? 'gradient' : 'solid';

  const switchMode = (m: 'solid' | 'gradient') => {
    if (m === mode) return;
    if (m === 'gradient') {
      onChange(gradientPresets[0].value);
    } else {
      onChange('#000000');
    }
  };

  const activePreset = isGrad ? gradientPresets.find((p) => p.value === value) : null;

  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>{label}</label>
      <div style={{ display: 'flex', gap: 2, padding: 2, background: 'var(--color-bg-tertiary)', borderRadius: 7, border: '1px solid var(--color-border-default)', marginBottom: 8 }}>
        <button type="button" onClick={() => switchMode('solid')} style={bgModeStyle(mode === 'solid')}>Solid</button>
        <button type="button" onClick={() => switchMode('gradient')} style={bgModeStyle(mode === 'gradient')}>Gradient</button>
      </div>
      {mode === 'solid' ? (
        <LinkedField
          value={value}
          onChange={onChange}
          onLink={() => {}}
          variables={themeVariables.filter((v) => v.valueType === 'color')}
          type="color"
          placeholder="transparent"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            height: 48, borderRadius: 6, border: '1px solid var(--color-border-default)',
            background: value,
          }} />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 6,
          }}>
            {gradientPresets.map((preset) => {
              const isActive = preset.value === value;
              return (
                <button
                  key={preset.id}
                  type="button"
                  title={preset.name}
                  onClick={() => onChange(preset.value)}
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

function ComponentStyleControls({ padding, backgroundColor, backgroundRadius, strokeColor, strokeWidth, onUpdate, title = 'Style', linked, onLink, imageRadius, onImageRadiusUpdate }: {
  padding: Padding;
  backgroundColor: string;
  backgroundRadius: [number, number, number, number];
  strokeColor: string;
  strokeWidth: number;
  onUpdate: (vals: { padding?: Padding; backgroundColor?: string; backgroundRadius?: [number, number, number, number]; strokeColor?: string; strokeWidth?: number }) => void;
  title?: string;
  linked?: LinkedValues;
  onLink?: (fieldKey: string, lv: LinkedValue) => void;
  imageRadius?: number;
  onImageRadiusUpdate?: (v: number) => void;
}) {
  const colorVars = themeVariables.filter((v) => v.valueType === 'color');
  const numberVars = [...themeVariables.filter((v) => v.valueType === 'text')];
  const previewParts: string[] = [];
  const padVal = uniformPaddingValue(padding);
  if (padVal > 0) previewParts.push(isUniformPadding(padding) ? `pad ${padVal}` : `pad ${parsePadding(padding).join('/')}`);
  if (backgroundColor !== 'transparent' && !isGradientValue(backgroundColor)) previewParts.push(`bg ${backgroundColor}`);
  if (isGradientValue(backgroundColor)) previewParts.push('gradient');
  if (strokeWidth > 0) previewParts.push(`stroke ${strokeWidth}`);
  if (imageRadius !== undefined && imageRadius !== 8) previewParts.push(`radius ${imageRadius}`);

  return (
    <PropertyGroup title={title} preview={previewParts.length ? previewParts.join(' · ') : 'Default'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {imageRadius !== undefined && onImageRadiusUpdate && (
          <LinkedWrapper
            label="Image radius"
            linked={linked?.['mediaRadius']}
            onLink={(lv) => onLink?.('mediaRadius', lv)}
            variables={numberVars}
            currentValue={String(imageRadius)}
            onValueFromVariable={(v) => onImageRadiusUpdate(parseInt(v) || 0)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StepperBtn onClick={() => onImageRadiusUpdate(Math.max(0, imageRadius - 1))} disabled={imageRadius <= 0}>‹</StepperBtn>
              <StepperInput value={imageRadius} onChange={(v) => onImageRadiusUpdate(Math.max(0, v || 0))} />
              <StepperBtn onClick={() => onImageRadiusUpdate(imageRadius + 1)}>›</StepperBtn>
            </div>
          </LinkedWrapper>
        )}
        <PaddingControl value={padding} onChange={(v) => onUpdate({ padding: v })} />
        <BackgroundControl
          value={backgroundColor}
          onChange={(v) => onUpdate({ backgroundColor: v })}
        />
        <RadiusControl
          radii={backgroundRadius}
          onChange={(r) => onUpdate({ backgroundRadius: r })}
        />
        <LinkedField
          label="Stroke color"
          value={strokeColor}
          linked={linked?.['strokeColor']}
          onChange={(v) => onUpdate({ strokeColor: v })}
          onLink={(lv) => onLink?.('strokeColor', lv)}
          variables={colorVars}
          type="color"
          placeholder="transparent"
        />
        <LinkedWrapper
          label="Stroke weight"
          linked={linked?.['strokeWidth']}
          onLink={(lv) => onLink?.('strokeWidth', lv)}
          variables={numberVars}
          currentValue={String(strokeWidth)}
          onValueFromVariable={(v) => onUpdate({ strokeWidth: parseInt(v) || 0 })}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StepperBtn onClick={() => onUpdate({ strokeWidth: Math.max(0, strokeWidth - 1) })} disabled={strokeWidth <= 0}>‹</StepperBtn>
            <StepperInput value={strokeWidth} onChange={(v) => onUpdate({ strokeWidth: Math.max(0, v || 0) })} />
            <StepperBtn onClick={() => onUpdate({ strokeWidth: strokeWidth + 1 })}>›</StepperBtn>
          </div>
        </LinkedWrapper>
      </div>
    </PropertyGroup>
  );
}

type PropsTab = 'content' | 'style';

function TabSwitcher({ tab, onTabChange }: { tab: PropsTab; onTabChange: (t: PropsTab) => void }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border-default)', marginBottom: 8 }}>
      {(['content', 'style'] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onTabChange(t)}
          style={{
            flex: 1, height: 36,
            border: 'none',
            borderBottom: tab === t ? '2px solid var(--color-brand)' : '2px solid transparent',
            background: 'transparent',
            color: tab === t ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-family)',
            cursor: 'pointer', transition: 'var(--transition-fast)',
            textTransform: 'capitalize',
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function SectionProperties({ section, tab }: { section: Section; tab: PropsTab }) {
  const updateSection = useMessageStore((s) => s.updateSection);

  const updateHydration = (updates: Partial<SectionHydration>) => {
    updateSection(section.id, {
      hydration: { ...section.hydration, ...updates },
    });
  };

  const updateBackground = (updates: Partial<BackgroundConfig>) => {
    updateSection(section.id, {
      background: { ...section.background, ...updates },
    });
  };

  if (tab === 'content') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <SectionHeader title="Content" />
          <PropertyGroup title="Data Hydration" defaultOpen preview={`${section.hydration.source} · ${section.hydration.contentType || 'Any'}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Select
                label="Source"
                options={[
                  { value: 'query', label: 'Query' },
                  { value: 'collection', label: 'Collection' },
                  { value: 'merchandised-title', label: 'Merchandised Title' },
                  { value: 'custom', label: 'Custom' },
                ]}
                value={section.hydration.source}
                onChange={(v) => updateHydration({ source: v as SectionHydration['source'] })}
              />
              <Select
                label="Content Type"
                options={contentTypes}
                value={section.hydration.contentType || ''}
                onChange={(v) => updateHydration({ contentType: v })}
              />
              <Select
                label="Intent"
                options={intentOptions}
                value={section.hydration.intent || ''}
                onChange={(v) => updateHydration({ intent: v })}
              />
              <Select
                label="Package Type"
                options={packageTypes}
                value={section.hydration.packageType || ''}
                onChange={(v) => updateHydration({ packageType: v })}
              />
            </div>
          </PropertyGroup>
        </div>
        <AttachmentsSection target={section} targetType="section" />
      </div>
    );
  }

  const colorVars = themeVariables.filter((v) => v.valueType === 'color');
  const numberVars = themeVariables.filter((v) => v.valueType === 'number');
  const bgVal = section.background.value;
  const bgPreview = isGradientValue(bgVal) ? 'gradient' : bgVal !== 'transparent' ? bgVal : 'Default';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <PropertyGroup title="Visual" defaultOpen preview={bgPreview}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <BackgroundControl
            value={section.background.value}
            onChange={(v) => updateBackground({ value: v, type: isGradientValue(v) ? 'gradient' : 'solid' })}
          />
          <PaddingControl value={section.padding ?? 0} onChange={(v) => updateSection(section.id, { padding: v })} />
          <RadiusControl
            radii={section.backgroundRadius ?? [0, 0, 0, 0]}
            onChange={(r) => updateSection(section.id, { backgroundRadius: r })}
          />
          <LinkedField
            label="Stroke color"
            value={section.strokeColor ?? 'transparent'}
            onChange={(v) => updateSection(section.id, { strokeColor: v })}
            onLink={() => {}}
            variables={colorVars}
            type="color"
            placeholder="transparent"
          />
          <LinkedWrapper
            label="Stroke weight"
            variables={numberVars}
            onLink={() => {}}
            currentValue={String(section.strokeWidth ?? 0)}
            onValueFromVariable={(v) => updateSection(section.id, { strokeWidth: parseInt(v) || 0 })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StepperBtn onClick={() => updateSection(section.id, { strokeWidth: Math.max(0, (section.strokeWidth ?? 0) - 1) })} disabled={(section.strokeWidth ?? 0) <= 0}>‹</StepperBtn>
              <StepperInput value={section.strokeWidth ?? 0} onChange={(v) => updateSection(section.id, { strokeWidth: Math.max(0, v || 0) })} />
              <StepperBtn onClick={() => updateSection(section.id, { strokeWidth: (section.strokeWidth ?? 0) + 1 })}>›</StepperBtn>
            </div>
          </LinkedWrapper>
        </div>
      </PropertyGroup>
    </div>
  );
}

function TextBlockProperties({ component, sectionId, tab }: { component: MessageComponent; sectionId: string; tab: PropsTab }) {
  const updateComponentSettings = useMessageStore((s) => s.updateComponentSettings);
  const updateComponent = useMessageStore((s) => s.updateComponent);
  const settings = component.settings.type === 'text-block' ? component.settings.settings : null;
  if (!settings) return null;

  const linked = component.linkedValues ?? {};
  const setLinked = (fieldKey: string, lv: LinkedValue) => {
    updateComponent(sectionId, component.id, { linkedValues: { ...linked, [fieldKey]: lv } });
  };

  const update = (s: TextBlockSettings) =>
    updateComponentSettings(sectionId, component.id, { type: 'text-block', settings: s });


  const labels: Record<string, string> = { eyebrow: 'Eyebrow', headline: 'Headline', body: 'Body', link: 'CTA Link' };
  const icons: Record<string, React.ReactNode> = { eyebrow: <Type size={14} />, headline: <Heading size={14} />, body: <AlignLeft size={14} />, link: <Link2 size={14} /> };

  const fieldVarMap: Record<string, string> = { eyebrow: 'eyebrow', headline: 'headline', body: 'body' };
  const textVars = entityVariables.filter((v) => v.valueType === 'text');

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleDragStart = (idx: number) => {
    dragItem.current = idx;
    setDragIdx(idx);
  };
  const handleDragEnter = (idx: number) => {
    dragOverItem.current = idx;
    setDragOverIdx(idx);
  };
  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const newOrder = [...settings.order];
      const [removed] = newOrder.splice(dragItem.current, 1);
      newOrder.splice(dragOverItem.current, 0, removed);
      update({ ...settings, order: newOrder });
    }
    dragItem.current = null;
    dragOverItem.current = null;
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const getDropLine = (idx: number): 'above' | 'below' | null => {
    if (dragIdx === null || dragOverIdx === null || dragIdx === dragOverIdx) return null;
    if (idx === dragOverIdx) return dragIdx < dragOverIdx ? 'below' : 'above';
    return null;
  };

  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  if (tab === 'content') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {settings.order.filter(k => k !== 'callout').map((key, idx) => {
          const fieldKey = fieldVarMap[key] ?? key;
          const isEnabled = (settings[key] as { enabled: boolean }).enabled;
          const isDragging = dragIdx === idx;
          const dropLine = getDropLine(idx);
          const isExpanded = expandedKeys.has(key) && isEnabled;

          return (
            <div key={key} style={{ position: 'relative' }}>
              {dropLine === 'above' && (
                <div style={{ position: 'absolute', top: -1, left: 10, right: 10, height: 2, background: 'var(--color-brand)', borderRadius: 1, zIndex: 2 }} />
              )}
              <div
                className={!isExpanded ? 'mep-card-hover' : undefined}
                style={{
                  background: 'var(--color-bg-tertiary)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 6,
                  overflow: 'hidden',
                  opacity: isDragging ? 0.4 : 1,
                  transition: 'var(--transition-fast)',
                }}
              >
                <div
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragEnter={() => handleDragEnter(idx)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 10px',
                    cursor: 'grab',
                  }}
                >
                  <GripVertical size={12} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                  <div style={{
                    width: 24, height: 24, borderRadius: 5,
                    background: isEnabled ? 'var(--color-brand)' : 'var(--color-bg-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isEnabled ? '#fff' : 'var(--color-text-secondary)',
                    flexShrink: 0, transition: 'var(--transition-fast)',
                  }}>
                    {icons[key]}
                  </div>
                  <button
                    type="button"
                    onClick={() => { const next = new Set(expandedKeys); if (isExpanded) next.delete(key); else next.add(key); setExpandedKeys(next); }}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', gap: 4,
                      background: 'none', border: 'none', cursor: isEnabled ? 'pointer' : 'default',
                      padding: 0,
                    }}
                  >
                    <span style={{
                      fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-family)',
                      color: isEnabled ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                      userSelect: 'none',
                    }}>
                      {labels[key]}
                    </span>
                    {isEnabled && (
                      <ChevronRight size={11} style={{
                        color: 'var(--color-text-muted)',
                        transform: isExpanded ? 'rotate(90deg)' : 'none',
                        transition: 'transform 0.15s ease',
                      }} />
                    )}
                  </button>
                  <Toggle
                    label=""
                    size="sm"
                    checked={isEnabled}
                    onChange={(v) => {
                      if (key === 'link') update({ ...settings, link: { ...settings.link, enabled: v } });
                      else update({ ...settings, [key]: { ...(settings[key] as { enabled: boolean; text: string }), enabled: v } });
                    }}
                  />
                </div>
                {isExpanded && key !== 'link' && (
                  <div style={{
                    padding: '0 10px 10px',
                    borderTop: '1px solid var(--color-border-default)',
                    paddingTop: 10,
                  }}>
                    <LinkedField
                      value={(settings[key] as { text: string }).text}
                      linked={linked[fieldKey]}
                      onChange={(v) => update({ ...settings, [key]: { ...(settings[key] as { enabled: boolean; text: string }), text: v } })}
                      onLink={(lv) => setLinked(fieldKey, lv)}
                      variables={textVars}
                      placeholder={labels[key]}
                    />
                  </div>
                )}
                {isExpanded && key === 'link' && (
                  <div style={{
                    padding: '0 10px 10px',
                    borderTop: '1px solid var(--color-border-default)',
                    paddingTop: 10,
                    display: 'flex', flexDirection: 'column', gap: 8,
                  }}>
                    <LinkedField
                      label="Link text"
                      value={settings.link.text}
                      linked={linked['link.text']}
                      onChange={(v) => update({ ...settings, link: { ...settings.link, text: v } })}
                      onLink={(lv) => setLinked('link.text', lv)}
                      variables={entityVariables.filter((v) => v.valueType === 'text')}
                      placeholder="Link text"
                    />
                    <LinkedField
                      label="URL"
                      value={settings.link.url}
                      linked={linked['link.url']}
                      onChange={(v) => update({ ...settings, link: { ...settings.link, url: v } })}
                      onLink={(lv) => setLinked('link.url', lv)}
                      variables={entityVariables.filter((v) => v.valueType === 'url' || v.valueType === 'text')}
                      placeholder="URL"
                    />
                  </div>
                )}
              </div>
              {dropLine === 'below' && (
                <div style={{ position: 'absolute', bottom: -1, left: 10, right: 10, height: 2, background: 'var(--color-brand)', borderRadius: 1, zIndex: 2 }} />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <PropertyGroup title="Layout" preview={`Align: ${settings.alignment ?? 'left'}`}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
            Alignment
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['left', 'center', 'right'] as const).map((a) => (
              <StepperBtn
                key={a}
                onClick={() => update({ ...settings, alignment: a })}
                style={(settings.alignment ?? 'left') === a ? {
                  border: '2px solid var(--color-brand)',
                  background: 'var(--color-brand-subtle)',
                  color: 'var(--color-brand)',
                  fontSize: 12,
                  flex: 1,
                } : { fontSize: 12, flex: 1 }}
              >
                {a === 'left' ? <AlignLeft size={14} /> : a === 'center' ? <AlignCenter size={14} /> : <AlignRight size={14} />}
              </StepperBtn>
            ))}
          </div>
        </div>
      </PropertyGroup>
      <ComponentStyleControls
        padding={settings.padding ?? 0}
        backgroundColor={settings.backgroundColor ?? 'transparent'}
        backgroundRadius={settings.backgroundRadius ?? [0, 0, 0, 0]}
        strokeColor={settings.strokeColor ?? 'transparent'}
        strokeWidth={settings.strokeWidth ?? 0}
        onUpdate={(v) => update({ ...settings, ...v })}
        linked={linked}
        onLink={setLinked}
      />
    </div>
  );
}

function RichTextProperties({ component, sectionId, tab }: { component: MessageComponent; sectionId: string; tab: PropsTab }) {
  const updateComponentSettings = useMessageStore((s) => s.updateComponentSettings);
  const updateComponent = useMessageStore((s) => s.updateComponent);
  const settings = component.settings.type === 'rich-text' ? component.settings.settings : null;
  const [headingOpen, setHeadingOpen] = useState(false);
  const [textColorOpen, setTextColorOpen] = useState(false);
  const [highlightOpen, setHighlightOpen] = useState(false);
  if (!settings) return null;

  const linked = component.linkedValues ?? {};
  const setLinked = (fieldKey: string, lv: LinkedValue) => {
    updateComponent(sectionId, component.id, { linkedValues: { ...linked, [fieldKey]: lv } });
  };

  const update = (s: RichTextSettings) =>
    updateComponentSettings(sectionId, component.id, { type: 'rich-text', settings: s });

  const execCommand = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
  };

  const toolbarBtnStyle = (active?: boolean): React.CSSProperties => ({
    width: 32, height: 32, borderRadius: 6,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: active ? 'var(--color-brand-subtle)' : 'var(--color-bg-tertiary)',
    border: active ? '1px solid var(--color-brand)' : '1px solid var(--color-border-default)',
    color: active ? 'var(--color-brand)' : 'var(--color-text-secondary)',
    cursor: 'pointer', padding: 0,
    transition: 'var(--transition-fast)',
  });


  const headingOptions = [
    { label: 'Paragraph', tag: 'p' },
    { label: 'Heading 1', tag: 'h1' },
    { label: 'Heading 2', tag: 'h2' },
    { label: 'Heading 3', tag: 'h3' },
    { label: 'Heading 4', tag: 'h4' },
    { label: 'Heading 5', tag: 'h5' },
    { label: 'Heading 6', tag: 'h6' },
  ];

  const presetColors = ['#ffffff', '#e50914', '#ff6b6b', '#ffa726', '#ffee58', '#66bb6a', '#42a5f5', '#ab47bc', '#999999', '#000000'];
  const highlightColors = ['transparent', '#e50914', '#ff6b6b', '#ffa726', '#ffee58', '#66bb6a', '#42a5f5', '#ab47bc', '#333333', '#666666'];

  if (tab === 'content') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <ContentCard title="Text Structure" icon={<Heading size={14} />} defaultOpen>
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <button
              type="button"
              className="mep-select"
              onClick={() => setHeadingOpen(!headingOpen)}
              style={{
                width: '100%', height: 36, borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 10px',
                background: 'var(--color-bg-tertiary)',
                border: '1px solid var(--color-border-default)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family)', fontSize: 13, cursor: 'pointer',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Type size={14} style={{ opacity: 0.5 }} />
                Heading / Paragraph
              </span>
              <ChevronDown size={14} style={{ opacity: 0.5 }} />
            </button>
            {headingOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
                background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border-default)',
                borderRadius: 8, overflow: 'hidden', zIndex: 1000, boxShadow: 'var(--shadow-lg)',
              }}>
                {headingOptions.map((opt) => (
                  <button
                    key={opt.tag}
                    type="button"
                    onClick={() => {
                      execCommand('formatBlock', `<${opt.tag}>`);
                      setHeadingOpen(false);
                    }}
                    style={{
                      width: '100%', padding: '8px 12px', border: 'none',
                      background: 'transparent', color: 'var(--color-text-primary)',
                      fontFamily: 'var(--font-family)', fontSize: opt.tag === 'p' ? 13 : opt.tag === 'h1' ? 18 : opt.tag === 'h2' ? 16 : 14,
                      fontWeight: opt.tag === 'p' ? 400 : 600,
                      cursor: 'pointer', textAlign: 'left',
                    }}
                    className="mep-toolbar-btn"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </ContentCard>

        <ContentCard title="Content Editing" icon={<PenLine size={14} />} defaultOpen>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <button type="button" className="mep-toolbar-btn" style={toolbarBtnStyle()} onClick={() => execCommand('bold')} title="Bold (⌘B)">
              <Bold size={14} />
            </button>
            <button type="button" className="mep-toolbar-btn" style={toolbarBtnStyle()} onClick={() => execCommand('italic')} title="Italic (⌘I)">
              <Italic size={14} />
            </button>
            <button type="button" className="mep-toolbar-btn" style={toolbarBtnStyle()} onClick={() => execCommand('underline')} title="Underline (⌘U)">
              <Underline size={14} />
            </button>
            <button type="button" className="mep-toolbar-btn" style={toolbarBtnStyle()} onClick={() => execCommand('strikeThrough')} title="Strikethrough">
              <Strikethrough size={14} />
            </button>

            <button type="button" className="mep-toolbar-btn" style={toolbarBtnStyle()} onClick={() => {
              const url = prompt('Enter link URL:');
              if (url) execCommand('createLink', url);
            }} title="Insert link">
              <Link size={14} />
            </button>

            <button type="button" className="mep-toolbar-btn" style={toolbarBtnStyle()} onClick={() => execCommand('formatBlock', '<blockquote>')} title="Blockquote">
              <Quote size={14} />
            </button>

            <button type="button" className="mep-toolbar-btn" style={toolbarBtnStyle()} onClick={() => execCommand('insertUnorderedList')} title="Bulleted list">
              <List size={14} />
            </button>
            <button type="button" className="mep-toolbar-btn" style={toolbarBtnStyle()} onClick={() => execCommand('insertOrderedList')} title="Numbered list">
              <ListOrdered size={14} />
            </button>

            <button type="button" className="mep-toolbar-btn" style={toolbarBtnStyle()} onClick={() => execCommand('outdent')} title="Decrease indent">
              <IndentDecrease size={14} />
            </button>
            <button type="button" className="mep-toolbar-btn" style={toolbarBtnStyle()} onClick={() => execCommand('indent')} title="Increase indent">
              <IndentIncrease size={14} />
            </button>

            <button type="button" className="mep-toolbar-btn" style={toolbarBtnStyle()} onClick={() => execCommand('removeFormat')} title="Clear formatting">
              <RemoveFormatting size={14} />
            </button>
          </div>
        </ContentCard>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <PropertyGroup title="Text Appearance" preview={`${settings.alignment ?? 'left'} · ${settings.color}`}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
          <div style={{ position: 'relative' }}>
            <button type="button" className="mep-toolbar-btn" style={toolbarBtnStyle()} onClick={() => { setTextColorOpen(!textColorOpen); setHighlightOpen(false); }} title="Text color">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Baseline size={14} />
                <div style={{ width: 12, height: 3, borderRadius: 1, background: settings.color }} />
              </div>
            </button>
            {textColorOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 6,
                background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border-default)',
                borderRadius: 8, padding: 8, zIndex: 1000, boxShadow: 'var(--shadow-lg)',
                display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, width: 160,
              }}>
                {presetColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { execCommand('foreColor', c); setTextColorOpen(false); }}
                    style={{
                      width: 26, height: 26, borderRadius: 4, border: c === '#ffffff' ? '1px solid var(--color-border-default)' : '1px solid transparent',
                      background: c, cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <button type="button" className="mep-toolbar-btn" style={toolbarBtnStyle()} onClick={() => { setHighlightOpen(!highlightOpen); setTextColorOpen(false); }} title="Highlight color">
              <Highlighter size={14} />
            </button>
            {highlightOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 6,
                background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border-default)',
                borderRadius: 8, padding: 8, zIndex: 1000, boxShadow: 'var(--shadow-lg)',
                display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, width: 160,
              }}>
                {highlightColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { execCommand('hiliteColor', c); setHighlightOpen(false); }}
                    style={{
                      width: 26, height: 26, borderRadius: 4,
                      border: c === 'transparent' ? '2px dashed var(--color-border-default)' : '1px solid transparent',
                      background: c === 'transparent' ? 'var(--color-bg-secondary)' : c, cursor: 'pointer',
                    }}
                    title={c === 'transparent' ? 'Remove highlight' : c}
                  />
                ))}
              </div>
            )}
          </div>

          <button type="button" className="mep-toolbar-btn" style={toolbarBtnStyle()} onClick={() => {
            const size = prompt('Font size (1-7):', '3');
            if (size) execCommand('fontSize', size);
          }} title="Font size">
            <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-family)' }}>Aa</span>
          </button>

          <button type="button" className="mep-toolbar-btn" style={toolbarBtnStyle(settings.alignment === 'left')} onClick={() => { update({ ...settings, alignment: 'left' }); execCommand('justifyLeft'); }} title="Align left">
            <AlignLeft size={14} />
          </button>
          <button type="button" className="mep-toolbar-btn" style={toolbarBtnStyle(settings.alignment === 'center')} onClick={() => { update({ ...settings, alignment: 'center' }); execCommand('justifyCenter'); }} title="Align center">
            <AlignCenter size={14} />
          </button>
          <button type="button" className="mep-toolbar-btn" style={toolbarBtnStyle(settings.alignment === 'right')} onClick={() => { update({ ...settings, alignment: 'right' }); execCommand('justifyRight'); }} title="Align right">
            <AlignRight size={14} />
          </button>
        </div>
      </PropertyGroup>
      <PropertyGroup title="Typography" preview={`${settings.fontSize}px · ${settings.lineHeight} lh`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <LinkedWrapper
            label="Font size"
            linked={linked['fontSize']}
            onLink={(lv) => setLinked('fontSize', lv)}
            variables={themeVariables}
            currentValue={String(settings.fontSize)}
            onValueFromVariable={(v) => update({ ...settings, fontSize: parseInt(v) || 16 })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StepperBtn onClick={() => update({ ...settings, fontSize: Math.max(10, settings.fontSize - 1) })} disabled={settings.fontSize <= 10}>‹</StepperBtn>
              <StepperInput value={settings.fontSize} onChange={(v) => update({ ...settings, fontSize: Math.max(10, v || 16) })} />
              <StepperBtn onClick={() => update({ ...settings, fontSize: settings.fontSize + 1 })}>›</StepperBtn>
            </div>
          </LinkedWrapper>
          <LinkedWrapper
            label="Line height"
            linked={linked['lineHeight']}
            onLink={(lv) => setLinked('lineHeight', lv)}
            variables={themeVariables}
            currentValue={String(settings.lineHeight)}
            onValueFromVariable={(v) => update({ ...settings, lineHeight: parseFloat(v) || 1.6 })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StepperBtn onClick={() => update({ ...settings, lineHeight: Math.max(1, +(settings.lineHeight - 0.1).toFixed(1)) })} disabled={settings.lineHeight <= 1}>‹</StepperBtn>
              <StepperInput value={settings.lineHeight} onChange={(v) => update({ ...settings, lineHeight: Math.max(1, v || 1.6) })} style={{ width: 48 }} />
              <StepperBtn onClick={() => update({ ...settings, lineHeight: +(settings.lineHeight + 0.1).toFixed(1) })}>›</StepperBtn>
            </div>
          </LinkedWrapper>
          <LinkedField
            label="Text color"
            value={settings.color}
            linked={linked['color']}
            onChange={(v) => update({ ...settings, color: v })}
            onLink={(lv) => setLinked('color', lv)}
            variables={themeVariables.filter((v) => v.valueType === 'color')}
            type="color"
            placeholder="#ffffff"
          />
        </div>
      </PropertyGroup>
      <ComponentStyleControls
        padding={settings.padding}
        backgroundColor={settings.backgroundColor}
        backgroundRadius={settings.backgroundRadius}
        strokeColor={settings.strokeColor ?? 'transparent'}
        strokeWidth={settings.strokeWidth ?? 0}
        onUpdate={(v) => update({ ...settings, ...v })}
        linked={linked}
        onLink={setLinked}
      />
    </div>
  );
}

function MediaProperties({ component, sectionId, tab }: { component: MessageComponent; sectionId: string; tab: PropsTab }) {
  const updateComponentSettings = useMessageStore((s) => s.updateComponentSettings);
  const updateComponent = useMessageStore((s) => s.updateComponent);
  const settings = component.settings.type === 'media' ? component.settings.settings : null;
  if (!settings) return null;

  const linked = component.linkedValues ?? {};
  const setLinked = (fieldKey: string, lv: LinkedValue) => {
    updateComponent(sectionId, component.id, { linkedValues: { ...linked, [fieldKey]: lv } });
  };

  const update = (s: MediaSettings) =>
    updateComponentSettings(sectionId, component.id, { type: 'media', settings: s });

  if (tab === 'content') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <ContentCard title="Data" icon={<Database size={14} />} defaultOpen>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <LinkedField
              label="Source URL"
              value={settings.url}
              linked={linked['url']}
              onChange={(v) => update({ ...settings, url: v })}
              onLink={(lv) => setLinked('url', lv)}
              variables={entityVariables.filter((v) => v.valueType === 'url' || v.valueType === 'text')}
              placeholder="Auto-populated from entity"
            />
            <LinkedField
              label="Custom URL override"
              value={settings.customUrl ?? ''}
              linked={linked['customUrl']}
              onChange={(v) => update({ ...settings, customUrl: v })}
              onLink={(lv) => setLinked('customUrl', lv)}
              variables={entityVariables.filter((v) => v.valueType === 'url')}
              placeholder="Optional custom URL"
            />
          </div>
        </ContentCard>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <PropertyGroup title="Layout" preview={settings.format}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <LinkedWrapper
            linked={linked['format']}
            onLink={(lv) => setLinked('format', lv)}
            variables={entityVariables}
            currentValue={settings.format}
            onValueFromVariable={(v) => update({ ...settings, format: v as MediaSettings['format'] })}
          >
            <Select
              label="Artwork format"
              options={[
                { value: 'poster', label: 'Poster' },
                { value: 'poster-art', label: 'Poster Art' },
                { value: 'banner', label: 'Banner' },
                { value: 'banner-art', label: 'Banner Art' },
                { value: 'hero', label: 'Hero' },
                { value: 'hero-art', label: 'Hero Art' },
                { value: 'thumbnail', label: 'Thumbnail' },
                { value: 'video', label: 'Video' },
              ]}
              value={settings.format}
              onChange={(v) => update({ ...settings, format: v as MediaSettings['format'] })}
            />
          </LinkedWrapper>
        </div>
      </PropertyGroup>
      <ComponentStyleControls
        padding={settings.padding ?? 0}
        backgroundColor={settings.backgroundColor ?? 'transparent'}
        backgroundRadius={settings.backgroundRadius ?? [0, 0, 0, 0]}
        strokeColor={settings.strokeColor ?? 'transparent'}
        strokeWidth={settings.strokeWidth ?? 0}
        onUpdate={(v) => update({ ...settings, ...v })}
        linked={linked}
        onLink={setLinked}
        imageRadius={settings.mediaRadius ?? 8}
        onImageRadiusUpdate={(v) => update({ ...settings, mediaRadius: v })}
      />
      <MarqueeControls
        marquee={settings.marquee ?? { enabled: false, text: 'Marquee', position: 'below' }}
        onChange={(m) => update({ ...settings, marquee: m })}
        linked={linked}
        onLink={setLinked}
      />
    </div>
  );
}

function CTAProperties({ component, sectionId, tab }: { component: MessageComponent; sectionId: string; tab: PropsTab }) {
  const updateComponentSettings = useMessageStore((s) => s.updateComponentSettings);
  const updateComponent = useMessageStore((s) => s.updateComponent);
  const settings = component.settings.type === 'cta' ? component.settings.settings : null;
  if (!settings) return null;

  const linked = component.linkedValues ?? {};
  const setLinked = (fieldKey: string, lv: LinkedValue) => {
    updateComponent(sectionId, component.id, { linkedValues: { ...linked, [fieldKey]: lv } });
  };

  const update = (s: CTASettings) =>
    updateComponentSettings(sectionId, component.id, { type: 'cta', settings: s });

  const updateButton = (index: number, updates: Partial<CTASettings['buttons'][0]>) => {
    const buttons = [...settings.buttons];
    buttons[index] = { ...buttons[index], ...updates };
    update({ ...settings, buttons });
  };

  const addButton = () => {
    if (settings.buttons.length >= 2) return;
    const n = settings.buttons.length + 1;
    update({
      ...settings,
      buttons: [...settings.buttons, {
        enabled: true,
        text: `Button ${n}`,
        url: '',
        style: 'secondary' as const,
        fillColor: 'transparent',
        borderColor: '#888888',
        textColor: '#ffffff',
      }],
    });
  };

  const removeButton = (index: number) => {
    if (settings.buttons.length <= 1) return;
    update({ ...settings, buttons: settings.buttons.filter((_, i) => i !== index) });
  };

  const [expandedBtns, setExpandedBtns] = useState<Set<number>>(new Set([0]));

  if (tab === 'content') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {settings.buttons.map((btn, i) => {
          const isExpanded = expandedBtns.has(i);
          return (
            <div
              key={i}
              className={!isExpanded ? 'mep-card-hover' : undefined}
              style={{
                background: 'var(--color-bg-tertiary)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 6,
                overflow: 'hidden',
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px',
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 5,
                  background: 'var(--color-bg-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-text-secondary)',
                  flexShrink: 0,
                }}>
                  <MousePointerClick size={14} />
                </div>
                <button
                  type="button"
                    onClick={() => { const next = new Set(expandedBtns); if (isExpanded) next.delete(i); else next.add(i); setExpandedBtns(next); }}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', gap: 4,
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <span style={{
                    fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-family)',
                    color: 'var(--color-text-primary)',
                    userSelect: 'none',
                  }}>
                    Button {i + 1}
                  </span>
                  <ChevronRight size={11} style={{
                    color: 'var(--color-text-muted)',
                    transform: isExpanded ? 'rotate(90deg)' : 'none',
                    transition: 'transform 0.15s ease',
                  }} />
                </button>
                {settings.buttons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeButton(i)}
                    style={{
                      background: 'none', border: 'none', color: 'var(--color-text-muted)',
                      cursor: 'pointer', fontSize: 14, padding: '0 4px', lineHeight: 1,
                      flexShrink: 0,
                    }}
                    title="Remove button"
                  >×</button>
                )}
              </div>
              {isExpanded && (
                <div style={{
                  padding: '0 10px 10px',
                  borderTop: '1px solid var(--color-border-default)',
                  paddingTop: 10,
                  display: 'flex', flexDirection: 'column', gap: 8,
                }}>
                  <LinkedField
                    label="Text"
                    value={btn.text}
                    linked={linked[`btn.${i}.text`]}
                    onChange={(v) => updateButton(i, { text: v })}
                    onLink={(lv) => setLinked(`btn.${i}.text`, lv)}
                    variables={entityVariables.filter((v) => v.valueType === 'text')}
                    placeholder="Button text"
                  />
                  <LinkedField
                    label="URL"
                    value={btn.url}
                    linked={linked[`btn.${i}.url`]}
                    onChange={(v) => updateButton(i, { url: v })}
                    onLink={(lv) => setLinked(`btn.${i}.url`, lv)}
                    variables={entityVariables.filter((v) => v.valueType === 'url' || v.valueType === 'text')}
                    placeholder="URL"
                  />
                </div>
              )}
            </div>
          );
        })}
        {settings.buttons.length < 2 && (
          <button
            type="button"
            onClick={addButton}
            style={{
              width: '100%', height: 36, borderRadius: 8,
              border: '1px dashed var(--color-border-default)',
              background: 'transparent', color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-family)', fontSize: 13, cursor: 'pointer',
              transition: 'var(--transition-fast)',
            }}
          >
            + Add button
          </button>
        )}
      </div>
    );
  }

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)', marginBottom: 4 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <PropertyGroup title="Layout" preview={settings.layout === '2-side-by-side' ? 'Side by side' : 'Stacked'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={labelStyle}>Format</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {([
                { value: 'stacked', label: 'Stacked' },
                { value: 'side-by-side', label: 'Side by side' },
              ] as const).map((opt) => (
                <StepperBtn
                  key={opt.value}
                  onClick={() => update({ ...settings, layout: opt.value === 'stacked' ? '2-stacked' : '2-side-by-side' })}
                  style={(settings.layout === '2-side-by-side' ? opt.value === 'side-by-side' : opt.value === 'stacked') ? {
                    border: '2px solid var(--color-brand)',
                    background: 'var(--color-brand-subtle)',
                    color: 'var(--color-brand)',
                    fontSize: 12,
                    flex: 1,
                  } : { fontSize: 12, flex: 1 }}
                >
                  {opt.label}
                </StepperBtn>
              ))}
            </div>
          </div>
        </div>
      </PropertyGroup>
      <PropertyGroup title="Button Style" preview={`${settings.buttons.length} button${settings.buttons.length > 1 ? 's' : ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {settings.buttons.map((btn, i) => (
            <div key={i} style={{ padding: 12, background: 'var(--color-bg-secondary)', borderRadius: 8 }}>
              <div style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}>
                  Button {i + 1}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <LinkedField
                  label="Fill color"
                  value={btn.fillColor}
                  linked={linked[`btn.${i}.fillColor`]}
                  onChange={(v) => updateButton(i, { fillColor: v })}
                  onLink={(lv) => setLinked(`btn.${i}.fillColor`, lv)}
                  variables={themeVariables.filter((v) => v.valueType === 'color')}
                  type="color"
                  placeholder="transparent"
                />
                <LinkedField
                  label="Stroke color"
                  value={btn.borderColor}
                  linked={linked[`btn.${i}.borderColor`]}
                  onChange={(v) => updateButton(i, { borderColor: v })}
                  onLink={(lv) => setLinked(`btn.${i}.borderColor`, lv)}
                  variables={themeVariables.filter((v) => v.valueType === 'color')}
                  type="color"
                  placeholder="transparent"
                />
                <LinkedField
                  label="Text color"
                  value={btn.textColor}
                  linked={linked[`btn.${i}.textColor`]}
                  onChange={(v) => updateButton(i, { textColor: v })}
                  onLink={(lv) => setLinked(`btn.${i}.textColor`, lv)}
                  variables={themeVariables.filter((v) => v.valueType === 'color')}
                  type="color"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          ))}
        </div>
      </PropertyGroup>
      <ComponentStyleControls
        padding={settings.padding ?? 0}
        backgroundColor={settings.backgroundColor ?? 'transparent'}
        backgroundRadius={settings.backgroundRadius ?? [0, 0, 0, 0]}
        strokeColor={settings.strokeColor ?? 'transparent'}
        strokeWidth={settings.strokeWidth ?? 0}
        onUpdate={(v) => update({ ...settings, ...v })}
        linked={linked}
        onLink={setLinked}
      />
    </div>
  );
}

function GridProperties({ component, sectionId, tab }: { component: MessageComponent; sectionId: string; tab: PropsTab }) {
  const updateComponentSettings = useMessageStore((s) => s.updateComponentSettings);
  const updateComponent = useMessageStore((s) => s.updateComponent);
  const settings = component.settings.type === 'grid' ? component.settings.settings : null;
  if (!settings) return null;

  const linked = component.linkedValues ?? {};
  const setLinked = (fieldKey: string, lv: LinkedValue) => {
    updateComponent(sectionId, component.id, { linkedValues: { ...linked, [fieldKey]: lv } });
  };

  const update = (s: GridSettings) =>
    updateComponentSettings(sectionId, component.id, { type: 'grid', settings: s });

  const mode = settings.splitMode ?? 'row';
  const rows = settings.rows ?? [3, 3];
  const cols = settings.cols ?? [2, 2, 2];

  const setMode = (m: 'row' | 'column') => update({ ...settings, splitMode: m });

  const setRowCount = (n: number) => {
    const v = Math.max(1, Math.min(10, n));
    const cur = settings.rows ?? [3, 3];
    if (v > cur.length) {
      update({ ...settings, rows: [...cur, ...Array(v - cur.length).fill(cur[cur.length - 1] ?? 3)] });
    } else {
      update({ ...settings, rows: cur.slice(0, v) });
    }
  };
  const setRowCols = (idx: number, c: number) => {
    const next = [...rows];
    next[idx] = Math.max(1, Math.min(6, c));
    update({ ...settings, rows: next });
  };

  const setColCount = (n: number) => {
    const v = Math.max(1, Math.min(6, n));
    const cur = settings.cols ?? [2, 2, 2];
    if (v > cur.length) {
      update({ ...settings, cols: [...cur, ...Array(v - cur.length).fill(cur[cur.length - 1] ?? 2)] });
    } else {
      update({ ...settings, cols: cur.slice(0, v) });
    }
  };
  const setColRows = (idx: number, r: number) => {
    const next = [...cols];
    next[idx] = Math.max(1, Math.min(10, r));
    update({ ...settings, cols: next });
  };

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)', marginBottom: 4 };

  if (tab === 'content') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <ContentCard title="Grid Data" icon={<Grid3X3 size={14} />} defaultOpen>
          <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-family)' }}>
            Grid cells are populated from entity data. Select cells on the canvas to configure individual content.
          </p>
        </ContentCard>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <PropertyGroup title="Grid Layout" preview={`${mode} · ${mode === 'row' ? rows.length + ' rows' : cols.length + ' cols'}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={labelStyle}>Define by</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['row', 'column'] as const).map((m) => (
                <StepperBtn
                  key={m}
                  onClick={() => setMode(m)}
                  style={mode === m ? {
                    border: '2px solid var(--color-brand)',
                    background: 'var(--color-brand-subtle)',
                    color: 'var(--color-brand)',
                    fontSize: 12,
                    flex: 1,
                  } : { fontSize: 12, flex: 1 }}
                >
                  {m}
                </StepperBtn>
              ))}
            </div>
          </div>
          {mode === 'row' ? (
            <>
              <div>
                <label style={labelStyle}>Rows</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <StepperBtn onClick={() => setRowCount(rows.length - 1)} disabled={rows.length <= 1}>‹</StepperBtn>
                  <StepperInput value={rows.length} onChange={setRowCount} />
                  <StepperBtn onClick={() => setRowCount(rows.length + 1)}>›</StepperBtn>
                </div>
              </div>
              {rows.map((c, idx) => (
                <div key={idx}>
                  <label style={labelStyle}>Row {idx + 1} columns</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StepperBtn onClick={() => setRowCols(idx, c - 1)} disabled={c <= 1}>‹</StepperBtn>
                    <StepperInput value={c} onChange={(v) => setRowCols(idx, v)} />
                    <StepperBtn onClick={() => setRowCols(idx, c + 1)} disabled={c >= 6}>›</StepperBtn>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <div>
                <label style={labelStyle}>Columns</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <StepperBtn onClick={() => setColCount(cols.length - 1)} disabled={cols.length <= 1}>‹</StepperBtn>
                  <StepperInput value={cols.length} onChange={setColCount} />
                  <StepperBtn onClick={() => setColCount(cols.length + 1)} disabled={cols.length >= 6}>›</StepperBtn>
                </div>
              </div>
              {cols.map((r, idx) => (
                <div key={idx}>
                  <label style={labelStyle}>Column {idx + 1} rows</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StepperBtn onClick={() => setColRows(idx, r - 1)} disabled={r <= 1}>‹</StepperBtn>
                    <StepperInput value={r} onChange={(v) => setColRows(idx, v)} />
                    <StepperBtn onClick={() => setColRows(idx, r + 1)}>›</StepperBtn>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </PropertyGroup>
      <PropertyGroup title="Spacing" preview={`Gap: ${settings.gap ?? 8}px`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={labelStyle}>Gap</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StepperBtn onClick={() => update({ ...settings, gap: Math.max(0, (settings.gap ?? 8) - 1) })} disabled={(settings.gap ?? 8) <= 0}>‹</StepperBtn>
              <StepperInput value={settings.gap ?? 8} onChange={(v) => update({ ...settings, gap: Math.max(0, v || 0) })} />
              <StepperBtn onClick={() => update({ ...settings, gap: (settings.gap ?? 8) + 1 })}>›</StepperBtn>
            </div>
          </div>
        </div>
      </PropertyGroup>
      <GridCellStyleSection settings={settings} update={update} />
      <ComponentStyleControls
        title="Grid Style"
        padding={settings.padding ?? 0}
        backgroundColor={settings.backgroundColor ?? 'transparent'}
        backgroundRadius={settings.backgroundRadius ?? [0, 0, 0, 0]}
        strokeColor={settings.strokeColor ?? 'transparent'}
        strokeWidth={settings.strokeWidth ?? 0}
        onUpdate={(v) => update({ ...settings, ...v })}
        linked={linked}
        onLink={setLinked}
      />
      <MarqueeControls
        marquee={settings.marquee ?? { enabled: false, text: 'Marquee', position: 'below' }}
        onChange={(m) => update({ ...settings, marquee: m })}
        linked={linked}
        onLink={setLinked}
      />
    </div>
  );
}

function GridCellStyleSection({ settings, update }: { settings: GridSettings; update: (s: GridSettings) => void }) {
  const defaultCellStyle: GridCellStyle = { padding: 0, backgroundColor: 'transparent', backgroundRadius: [0, 0, 0, 0], strokeColor: 'transparent', strokeWidth: 0, imageRadius: settings.cellStyle?.imageRadius ?? settings.itemRadius ?? 8 };
  const wholeStyle: GridCellStyle = settings.cellStyle ?? defaultCellStyle;

  return (
    <PropertyGroup title="Cell style" preview={`radius ${wholeStyle.imageRadius ?? 8}px`}>
      <ItemStyleControls
        style={wholeStyle}
        onChange={(s) => update({ ...settings, cellStyle: s as GridCellStyle })}
      />
    </PropertyGroup>
  );
}

function RadiusControl({ radii, onChange }: { radii: [number, number, number, number]; onChange: (r: [number, number, number, number]) => void }) {
  const allSame = radii[0] === radii[1] && radii[1] === radii[2] && radii[2] === radii[3];
  const [individual, setIndividual] = useState(!allSame);
  const universalValue = radii[0];

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 36, borderRadius: 8,
    border: '1px solid var(--color-border-default)', background: 'var(--color-bg-tertiary)',
    color: 'var(--color-text-primary)', fontSize: 14, textAlign: 'center',
    outline: 'none', fontFamily: 'var(--font-family)',
    transition: 'var(--transition-fast)',
  };

  return (
    <div>
      <label style={{ display: 'block', textTransform: 'none', fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
        Background Radius
      </label>
      {!individual ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StepperBtn onClick={() => { const v = Math.max(0, universalValue - 1); onChange([v, v, v, v]); }} disabled={universalValue <= 0}>‹</StepperBtn>
          <StepperInput value={universalValue} onChange={(v) => { const val = Math.max(0, v || 0); onChange([val, val, val, val]); }} />
          <StepperBtn onClick={() => { const v = universalValue + 1; onChange([v, v, v, v]); }}>›</StepperBtn>
          <StepperBtn onClick={() => setIndividual(true)} style={individual ? { background: 'var(--color-brand-subtle)', border: '1px solid var(--color-brand)', color: 'var(--color-brand)', fontSize: 11, fontWeight: 600 } : { fontSize: 11, fontWeight: 600 }}>⊞</StepperBtn>
        </div>
      ) : (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {(['TL', 'TR', 'BL', 'BR'] as const).map((corner, idx) => (
              <div key={corner} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 10, color: 'var(--color-text-muted)', width: 18, flexShrink: 0 }}>{corner}</span>
                <input type="number" className="mep-input" value={radii[idx]}
                  onChange={(e) => {
                    const newRadii = [...radii] as [number, number, number, number];
                    newRadii[idx] = Math.max(0, parseInt(e.target.value, 10) || 0);
                    onChange(newRadii);
                  }}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
          <button type="button" onClick={() => { setIndividual(false); onChange([radii[0], radii[0], radii[0], radii[0]]); }}
            style={{ marginTop: 6, background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: 11, cursor: 'pointer', padding: 0, transition: 'var(--transition-fast)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
          >
            ← Uniform
          </button>
        </div>
      )}
    </div>
  );
}

function ListItemIconPicker({ settings, update }: { settings: ListSettings; update: (s: ListSettings) => void }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const globalIcon = settings.thumbnailIcon ?? 'play';

  const updateItemIcon = (idx: number, icon: ListThumbnailIcon | undefined) => {
    const items = [...settings.items];
    items[idx] = { ...items[idx], thumbnailIcon: icon };
    update({ ...settings, items });
  };

  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)', marginBottom: 6 }}>Item icons</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {settings.items.map((item, idx) => {
          const currentIcon = item.thumbnailIcon ?? globalIcon;
          const isExpanded = expandedIdx === idx;
          const IconComp = THUMBNAIL_ICONS.find((t) => t.icon === currentIcon)?.Component ?? Play;

          return (
            <div key={idx} style={{
              borderRadius: 6,
              border: isExpanded ? '1px solid var(--color-border-default)' : '1px solid transparent',
              background: isExpanded ? 'var(--color-bg-tertiary)' : undefined,
              transition: 'var(--transition-fast)',
            }}>
              <button
                type="button"
                onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '6px 8px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  borderRadius: 6, fontFamily: 'inherit',
                }}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'var(--color-brand-subtle)',
                  border: '1.5px solid var(--color-brand)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-brand)',
                  flexShrink: 0, transition: 'var(--transition-fast)',
                }}>
                  <IconComp size={12} />
                </div>
                <span style={{
                  flex: 1, textAlign: 'left',
                  fontSize: 11, fontWeight: 500, fontFamily: 'var(--font-family)',
                  color: 'var(--color-text-primary)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {item.title}
                </span>
                <ChevronRight size={10} style={{
                  flexShrink: 0, color: 'var(--color-text-muted)',
                  transform: isExpanded ? 'rotate(90deg)' : 'none',
                  transition: 'transform 0.15s ease',
                }} />
              </button>
              {isExpanded && (
                <div style={{ padding: '4px 8px 8px' }}>
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2,
                    maxHeight: 140, overflowY: 'auto',
                  }}>
                    {THUMBNAIL_ICONS.map(({ icon, label, Component: IC }) => (
                      <button
                        key={icon}
                        type="button"
                        title={label}
                        onClick={() => { updateItemIcon(idx, icon); setExpandedIdx(null); }}
                        style={{
                          width: '100%', aspectRatio: '1', borderRadius: 5,
                          border: currentIcon === icon ? '1.5px solid var(--color-brand)' : '1px solid transparent',
                          background: currentIcon === icon ? 'var(--color-brand-subtle)' : 'var(--color-bg-secondary)',
                          color: currentIcon === icon ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'var(--transition-fast)',
                        }}
                      >
                        <IC size={13} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ListProperties({ component, sectionId, tab }: { component: MessageComponent; sectionId: string; tab: PropsTab }) {
  const updateComponentSettings = useMessageStore((s) => s.updateComponentSettings);
  const updateComponent = useMessageStore((s) => s.updateComponent);
  const settings = component.settings.type === 'list' ? component.settings.settings : null;
  if (!settings) return null;

  const linked = component.linkedValues ?? {};
  const setLinked = (fieldKey: string, lv: LinkedValue) => {
    updateComponent(sectionId, component.id, { linkedValues: { ...linked, [fieldKey]: lv } });
  };

  const update = (s: ListSettings) =>
    updateComponentSettings(sectionId, component.id, { type: 'list', settings: s });

  const listElements: { key: string; label: string; icon: React.ReactNode; checked: boolean; onChange: (v: boolean) => void }[] = [
    { key: 'thumbnail', label: 'Thumbnail', icon: <Image size={14} />, checked: settings.showThumbnail, onChange: (v) => update({ ...settings, showThumbnail: v }) },
    { key: 'title', label: 'Title', icon: <Heading size={14} />, checked: settings.showTitle ?? true, onChange: (v) => update({ ...settings, showTitle: v }) },
    { key: 'subtitle', label: 'Subtitle', icon: <Type size={14} />, checked: settings.showSubtitle ?? true, onChange: (v) => update({ ...settings, showSubtitle: v }) },
    { key: 'metadata', label: 'Metadata / CTA', icon: <Tags size={14} />, checked: settings.showMetadata ?? true, onChange: (v) => update({ ...settings, showMetadata: v }) },
  ];

  if (tab === 'content') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {listElements.map((el) => (
          <div
            key={el.key}
            className="mep-card-hover"
            style={{
              background: 'var(--color-bg-tertiary)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 6,
              overflow: 'hidden',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 10px',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 5,
                background: el.checked ? 'var(--color-brand)' : 'var(--color-bg-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: el.checked ? '#fff' : 'var(--color-text-secondary)',
                flexShrink: 0, transition: 'var(--transition-fast)',
              }}>
                {el.icon}
              </div>
              <span style={{
                flex: 1,
                fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-family)',
                color: el.checked ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                userSelect: 'none',
              }}>
                {el.label}
              </span>
              <Toggle
                label=""
                size="sm"
                checked={el.checked}
                onChange={el.onChange}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <PropertyGroup title="List Layout" preview={`${settings.layout} · ${settings.columns} col`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <LinkedWrapper
            linked={linked['layout']}
            onLink={(lv) => setLinked('layout', lv)}
            variables={entityVariables}
            currentValue={settings.layout}
          >
            <Select
              label="Format"
              options={settings.columns === 3
                ? [{ value: 'schedules', label: 'Top' }]
                : [
                    { value: 'episodes', label: 'Left' },
                    { value: 'chapters', label: 'Right' },
                    { value: 'schedules', label: 'Top' },
                  ]
              }
              value={settings.layout}
              onChange={(v) => update({ ...settings, layout: v as ListSettings['layout'] })}
            />
          </LinkedWrapper>
          <LinkedWrapper
            label="Columns"
            linked={linked['columns']}
            onLink={(lv) => setLinked('columns', lv)}
            variables={entityVariables}
            currentValue={String(settings.columns)}
          >
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              {([1, 2, 3] as ListColumns[]).map((c) => (
                <StepperBtn
                  key={c}
                  onClick={() => update({ ...settings, columns: c, layout: c === 3 ? 'schedules' : settings.layout })}
                  style={settings.columns === c ? {
                    border: '2px solid var(--color-brand)',
                    background: 'var(--color-brand-subtle)',
                    color: 'var(--color-brand)',
                    fontSize: 14,
                  } : { fontSize: 14 }}
                >
                  {c}
                </StepperBtn>
              ))}
            </div>
          </LinkedWrapper>
          <LinkedWrapper
            linked={linked['showDivider']}
            onLink={(lv) => setLinked('showDivider', lv)}
            variables={themeVariables}
            currentValue={String(settings.showDivider)}
          >
            <Toggle
              label="Show divider"
              checked={settings.showDivider}
              onChange={(v) => update({ ...settings, showDivider: v })}
            />
          </LinkedWrapper>
          {settings.layout === 'schedules' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                Text alignment
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['left', 'center'] as const).map((a) => (
                  <StepperBtn
                    key={a}
                    onClick={() => update({ ...settings, textAlign: a })}
                    style={(settings.textAlign ?? 'left') === a ? {
                      border: '2px solid var(--color-brand)',
                      background: 'var(--color-brand-subtle)',
                      color: 'var(--color-brand)',
                      fontSize: 12,
                      flex: 1,
                    } : { fontSize: 12, flex: 1 }}
                  >
                    {a === 'left' ? <AlignLeft size={14} /> : <AlignCenter size={14} />}
                  </StepperBtn>
                ))}
              </div>
            </div>
          )}
        </div>
      </PropertyGroup>
      {settings.showThumbnail && (
        <PropertyGroup title="Thumbnail" preview={`${(settings.thumbnailType ?? 'image') === 'icon' ? settings.thumbnailIcon ?? 'play' : 'image'} · ${settings.thumbnailRadius ?? 8}px`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)', marginBottom: 6 }}>Type</label>
              <div style={{ display: 'flex', gap: 2, padding: 2, background: 'var(--color-bg-tertiary)', borderRadius: 7, border: '1px solid var(--color-border-default)', marginBottom: 8 }}>
                {(['image', 'icon'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => update({ ...settings, thumbnailType: t })}
                    style={{
                      ...bgModeStyle((settings.thumbnailType ?? 'image') === t),
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                      textTransform: 'capitalize',
                    }}
                  >
                    {t === 'image' ? <Image size={13} /> : <Sparkles size={13} />}
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {(settings.thumbnailType ?? 'image') === 'icon' && (
              <ListItemIconPicker settings={settings} update={update} />
            )}
            {(settings.thumbnailType ?? 'image') === 'icon' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Toggle
                  label="Circle background"
                  checked={settings.iconCircleBackground ?? false}
                  onChange={(v) => update({ ...settings, iconCircleBackground: v })}
                />
                {(settings.iconCircleBackground ?? false) && (
                  <BackgroundControl
                    label="Circle color"
                    value={settings.iconCircleColor ?? '#E50914'}
                    onChange={(v) => update({ ...settings, iconCircleColor: v })}
                  />
                )}
              </div>
            )}
            <LinkedWrapper
              label="Thumbnail radius"
              linked={linked['thumbnailRadius']}
              onLink={(lv) => setLinked('thumbnailRadius', lv)}
              variables={themeVariables.filter((v) => v.valueType === 'text')}
              currentValue={String(settings.thumbnailRadius ?? 8)}
              onValueFromVariable={(v) => update({ ...settings, thumbnailRadius: parseInt(v) || 8 })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <StepperBtn onClick={() => update({ ...settings, thumbnailRadius: Math.max(0, (settings.thumbnailRadius ?? 8) - 1) })} disabled={(settings.thumbnailRadius ?? 8) <= 0}>‹</StepperBtn>
                <StepperInput value={settings.thumbnailRadius ?? 8} onChange={(v) => update({ ...settings, thumbnailRadius: Math.max(0, v || 0) })} />
                <StepperBtn onClick={() => update({ ...settings, thumbnailRadius: (settings.thumbnailRadius ?? 8) + 1 })}>›</StepperBtn>
              </div>
            </LinkedWrapper>
          </div>
        </PropertyGroup>
      )}
      <ComponentStyleControls
        title="List style"
        padding={settings.padding ?? 0}
        backgroundColor={settings.backgroundColor ?? 'transparent'}
        backgroundRadius={settings.backgroundRadius ?? [0, 0, 0, 0]}
        strokeColor={settings.strokeColor ?? 'transparent'}
        strokeWidth={settings.strokeWidth ?? 0}
        onUpdate={(v) => update({ ...settings, ...v })}
        linked={linked}
        onLink={setLinked}
      />
      <ListItemStyleSection settings={settings} update={update} />
    </div>
  );
}

type CellStyle = ListItemStyle | GridCellStyle;

function ItemStyleControls({ style, onChange, label }: {
  style: CellStyle;
  onChange: (s: CellStyle) => void;
  label?: string;
}) {
  const labelStyle: CSSProperties = { display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)', marginBottom: 4 };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {label && <div style={{ ...labelStyle, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 0 }}>{label}</div>}
      {'imageRadius' in style && (
        <div>
          <label style={labelStyle}>Image radius</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StepperBtn onClick={() => onChange({ ...style, imageRadius: Math.max(0, ((style as GridCellStyle).imageRadius ?? 8) - 1) })} disabled={((style as GridCellStyle).imageRadius ?? 8) <= 0}>‹</StepperBtn>
            <StepperInput value={(style as GridCellStyle).imageRadius ?? 8} onChange={(v) => onChange({ ...style, imageRadius: Math.max(0, v || 0) })} />
            <StepperBtn onClick={() => onChange({ ...style, imageRadius: ((style as GridCellStyle).imageRadius ?? 8) + 1 })}>›</StepperBtn>
          </div>
        </div>
      )}
      <PaddingControl value={style.padding} onChange={(v) => onChange({ ...style, padding: v })} />
      <div>
        <label style={labelStyle}>Background color</label>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 0,
          height: 36, borderRadius: 8,
          background: 'var(--color-bg-tertiary)',
          border: '1px solid var(--color-border-default)',
          overflow: 'hidden',
        }}>
          <input
            type="color"
            className="mep-color-picker"
            value={style.backgroundColor === 'transparent' ? '#000000' : style.backgroundColor}
            onChange={(e) => onChange({ ...style, backgroundColor: e.target.value })}
            style={{ marginLeft: 0 }}
          />
          <input
            type="text"
            value={style.backgroundColor}
            onChange={(e) => onChange({ ...style, backgroundColor: e.target.value })}
            placeholder="transparent"
            className="mep-input"
            style={{
              flex: 1, height: '100%', border: 'none', background: 'transparent',
              color: 'var(--color-text-primary)', fontFamily: 'var(--font-family)',
              fontSize: 13, padding: '0 8px', outline: 'none', minWidth: 0,
            }}
          />
        </div>
      </div>
      <RadiusControl
        radii={style.backgroundRadius}
        onChange={(r) => onChange({ ...style, backgroundRadius: r })}
      />
      <div>
        <label style={labelStyle}>Stroke color</label>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 0,
          height: 36, borderRadius: 8,
          background: 'var(--color-bg-tertiary)',
          border: '1px solid var(--color-border-default)',
          overflow: 'hidden',
        }}>
          <input
            type="color"
            className="mep-color-picker"
            value={(style.strokeColor ?? 'transparent') === 'transparent' ? '#000000' : style.strokeColor}
            onChange={(e) => onChange({ ...style, strokeColor: e.target.value })}
            style={{ marginLeft: 0 }}
          />
          <input
            type="text"
            value={style.strokeColor ?? 'transparent'}
            onChange={(e) => onChange({ ...style, strokeColor: e.target.value })}
            placeholder="transparent"
            className="mep-input"
            style={{
              flex: 1, height: '100%', border: 'none', background: 'transparent',
              color: 'var(--color-text-primary)', fontFamily: 'var(--font-family)',
              fontSize: 13, padding: '0 8px', outline: 'none', minWidth: 0,
            }}
          />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Stroke weight</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StepperBtn onClick={() => onChange({ ...style, strokeWidth: Math.max(0, (style.strokeWidth ?? 0) - 1) })} disabled={(style.strokeWidth ?? 0) <= 0}>‹</StepperBtn>
          <StepperInput value={style.strokeWidth ?? 0} onChange={(v) => onChange({ ...style, strokeWidth: Math.max(0, v || 0) })} />
          <StepperBtn onClick={() => onChange({ ...style, strokeWidth: (style.strokeWidth ?? 0) + 1 })}>›</StepperBtn>
        </div>
      </div>
    </div>
  );
}

function ListItemStyleSection({ settings, update }: { settings: ListSettings; update: (s: ListSettings) => void }) {
  const mode = settings.itemStyleMode ?? 'whole';
  const wholeStyle: ListItemStyle = settings.itemStyle ?? { padding: 0, backgroundColor: 'transparent', backgroundRadius: [0, 0, 0, 0], strokeColor: 'transparent', strokeWidth: 0 };
  const defaultItemStyle: ListItemStyle = { padding: 0, backgroundColor: 'transparent', backgroundRadius: [0, 0, 0, 0], strokeColor: 'transparent', strokeWidth: 0 };

  const setMode = (m: 'whole' | 'individual') => {
    if (m === 'individual' && mode === 'whole') {
      const items = settings.items.map((it) => ({
        ...it,
        style: it.style ?? { ...wholeStyle },
      }));
      update({ ...settings, itemStyleMode: 'individual', items });
    } else {
      update({ ...settings, itemStyleMode: m });
    }
  };

  const updateItemStyle = (idx: number, style: ListItemStyle) => {
    const items = [...settings.items];
    items[idx] = { ...items[idx], style };
    update({ ...settings, items });
  };

  return (
    <PropertyGroup title="Item style" preview={mode === 'individual' ? `${settings.items.length} items` : 'Uniform'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['whole', 'individual'] as const).map((m) => (
            <StepperBtn
              key={m}
              onClick={() => setMode(m)}
              style={mode === m ? {
                border: '2px solid var(--color-brand)',
                background: 'var(--color-brand-subtle)',
                color: 'var(--color-brand)',
                fontSize: 12,
                flex: 1,
              } : { fontSize: 12, flex: 1 }}
            >
              {m}
            </StepperBtn>
          ))}
        </div>

        {mode === 'whole' ? (
          <ItemStyleControls
            style={wholeStyle}
            onChange={(s) => update({ ...settings, itemStyle: s })}
          />
        ) : (
          settings.items.map((item, idx) => (
            <div key={idx} style={{
              borderTop: idx > 0 ? '1px solid var(--color-border-default)' : 'none',
              paddingTop: idx > 0 ? 12 : 0,
            }}>
              <ItemStyleControls
                label={`Item ${idx + 1}`}
                style={item.style ?? defaultItemStyle}
                onChange={(s) => updateItemStyle(idx, s)}
              />
            </div>
          ))
        )}
      </div>
    </PropertyGroup>
  );
}

function MarqueeControls({ marquee, onChange, linked, onLink }: { marquee: MarqueeConfig; onChange: (m: MarqueeConfig) => void; linked?: Record<string, LinkedValue>; onLink?: (key: string, value: LinkedValue) => void }) {
  return (
    <PropertyGroup title="Marquee" preview={marquee.enabled ? `"${marquee.text}" · ${marquee.position ?? 'below'}` : 'Off'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Toggle
          label="Show marquee"
          checked={marquee.enabled}
          onChange={(v) => onChange({ ...marquee, enabled: v })}
        />
        {marquee.enabled && (
          <>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                Position
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['above', 'below'] as const).map((pos) => (
                  <StepperBtn
                    key={pos}
                    onClick={() => onChange({ ...marquee, position: pos })}
                    style={(marquee.position ?? 'below') === pos ? {
                      border: '2px solid var(--color-brand)',
                      background: 'var(--color-brand-subtle)',
                      color: 'var(--color-brand)',
                      fontSize: 12,
                      flex: 1,
                    } : { fontSize: 12, flex: 1 }}
                  >
                    {pos === 'above' ? 'Top' : 'Bottom'}
                  </StepperBtn>
                ))}
              </div>
            </div>
            <LinkedField
              label="Text"
              value={marquee.text}
              linked={linked?.['marqueeText']}
              onChange={(v) => onChange({ ...marquee, text: v })}
              onLink={(lv) => onLink?.('marqueeText', lv)}
              variables={entityVariables.filter((v) => v.valueType === 'text')}
              placeholder="Marquee text"
            />
          </>
        )}
      </div>
    </PropertyGroup>
  );
}

// --------------- Inline Attachments Section ---------------

const DEFAULT_ATTACHMENT_ORDER: AttachmentKey[] = ['callout', 'metadata', 'liveBadge', 'countdown'];

const defaultCallout: ComponentCallout = {
  enabled: false, text: '2023 Oscar Winner', variant: 'A', position: 'above',
};
const defaultMetadata: ComponentMetadata = {
  enabled: false, items: ['Category', 'Genre', 'Year', 'Episodes', 'Rating'], position: 'below',
};
const defaultLiveBadge: ComponentLiveBadge = {
  enabled: false, label: 'Live', value: '--', position: 'above',
};
const defaultCountdown: ComponentCountdown = {
  enabled: false, variant: 'A', days: '21', hours: '3', minutes: '47', message: 'Starts in 3 days', imageUrl: '', position: 'above',
};

const attachmentMeta: Record<AttachmentKey, { icon: React.ReactNode; label: string }> = {
  callout: { icon: <Megaphone size={16} />, label: 'Callout' },
  metadata: { icon: <Tags size={16} />, label: 'Metadata' },
  liveBadge: { icon: <Radio size={16} />, label: 'Live Badge' },
  countdown: { icon: <Timer size={16} />, label: 'Countdown' },
};

const calloutVariantDescriptions: Record<string, string> = {
  A: 'Inline',
  B: 'Stacked sm',
  C: 'Stacked md',
  D: 'Stacked lg',
};

function AttachmentsSection({ target, targetType, sectionId }: {
  target: MessageComponent | Section;
  targetType: 'component' | 'section';
  sectionId?: string;
}) {
  const updateComponent = useMessageStore((s) => s.updateComponent);
  const updateSection = useMessageStore((s) => s.updateSection);

  const order: AttachmentKey[] = target.attachmentOrder ?? DEFAULT_ATTACHMENT_ORDER;
  const callout: ComponentCallout = target.callout ?? defaultCallout;
  const metadata: ComponentMetadata = target.metadata ?? defaultMetadata;
  const liveBadge: ComponentLiveBadge = target.liveBadge ?? defaultLiveBadge;
  const countdown: ComponentCountdown = target.countdown ?? defaultCountdown;

  const [expandedAttachments, setExpandedAttachments] = useState<Set<AttachmentKey>>(new Set());

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const applyUpdate = (updates: Partial<MessageComponent> | Partial<Section>) => {
    if (targetType === 'component' && sectionId) {
      updateComponent(sectionId, target.id, updates as Partial<MessageComponent>);
    } else {
      updateSection(target.id, updates as Partial<Section>);
    }
  };

  const isEnabled = (key: AttachmentKey) => {
    if (key === 'callout') return callout.enabled;
    if (key === 'metadata') return metadata.enabled;
    if (key === 'liveBadge') return liveBadge.enabled;
    if (key === 'countdown') return countdown.enabled;
    return false;
  };

  const toggleAttachment = (key: AttachmentKey) => {
    if (key === 'callout') applyUpdate({ callout: { ...callout, enabled: !callout.enabled } });
    else if (key === 'metadata') applyUpdate({ metadata: { ...metadata, enabled: !metadata.enabled } });
    else if (key === 'liveBadge') applyUpdate({ liveBadge: { ...liveBadge, enabled: !liveBadge.enabled } });
    else if (key === 'countdown') applyUpdate({ countdown: { ...countdown, enabled: !countdown.enabled } });
  };

  const handleDragStart = (idx: number) => { dragItem.current = idx; setDragIdx(idx); };
  const handleDragEnter = (idx: number) => { dragOverItem.current = idx; setDragOverIdx(idx); };
  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const newOrder = [...order];
      const [removed] = newOrder.splice(dragItem.current, 1);
      newOrder.splice(dragOverItem.current, 0, removed);
      applyUpdate({ attachmentOrder: newOrder });
    }
    dragItem.current = null; dragOverItem.current = null;
    setDragIdx(null); setDragOverIdx(null);
  };

  const getDropLine = (idx: number): 'above' | 'below' | null => {
    if (dragIdx === null || dragOverIdx === null || dragIdx === dragOverIdx) return null;
    if (idx === dragOverIdx) return dragIdx < dragOverIdx ? 'below' : 'above';
    return null;
  };

  const renderConfig = (key: AttachmentKey) => {
    const positionButtons = (
      currentPos: 'above' | 'below',
      onChange: (pos: 'above' | 'below') => void,
    ) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 11, color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-family)' }}>Position</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['above', 'below'] as const).map((pos) => (
            <button
              key={pos}
              type="button"
              onClick={() => onChange(pos)}
              style={{
                flex: 1, height: 28, borderRadius: 6, fontSize: 11, fontWeight: 500,
                fontFamily: 'var(--font-family)', cursor: 'pointer',
                border: currentPos === pos ? '1.5px solid var(--color-brand)' : '1px solid var(--color-border-default)',
                background: currentPos === pos ? 'var(--color-brand-subtle)' : 'var(--color-bg-tertiary)',
                color: currentPos === pos ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                transition: 'var(--transition-fast)',
              }}
            >
              {pos === 'above' ? 'Above' : 'Below'}
            </button>
          ))}
        </div>
      </div>
    );

    const fieldInput = (label: string, value: string, onChange: (v: string) => void, placeholder?: string) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 11, color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-family)' }}>{label}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mep-input"
          style={{
            height: 30, borderRadius: 6,
            border: '1px solid var(--color-border-default)', background: 'var(--color-bg-tertiary)',
            color: 'var(--color-text-primary)', fontSize: 12, padding: '0 8px',
            outline: 'none', fontFamily: 'var(--font-family)', width: '100%',
          }}
        />
      </div>
    );

    if (key === 'callout') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--font-family)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>Variant</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              {(['A', 'B', 'C', 'D'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => applyUpdate({ callout: { ...callout, variant: v } })}
                  style={{
                    height: 28, borderRadius: 6,
                    border: callout.variant === v ? '1.5px solid var(--color-brand)' : '1px solid var(--color-border-default)',
                    background: callout.variant === v ? 'var(--color-brand-subtle)' : 'var(--color-bg-tertiary)',
                    color: callout.variant === v ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    fontSize: 11, fontFamily: 'var(--font-family)', fontWeight: 500,
                    cursor: 'pointer', transition: 'all var(--transition-fast)',
                  }}
                >
                  {v} · {calloutVariantDescriptions[v]}
                </button>
              ))}
            </div>
          </div>
          {fieldInput('Text', callout.text, (v) => applyUpdate({ callout: { ...callout, text: v } }), 'Callout text')}
          {positionButtons(callout.position, (p) => applyUpdate({ callout: { ...callout, position: p } }))}
        </div>
      );
    }
    if (key === 'metadata') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {fieldInput('Items (comma-separated)', metadata.items.join(', '), (v) =>
            applyUpdate({ metadata: { ...metadata, items: v.split(',').map((s) => s.trim()).filter(Boolean) } }),
            'Category, Genre, Year',
          )}
          {positionButtons(metadata.position, (p) => applyUpdate({ metadata: { ...metadata, position: p } }))}
        </div>
      );
    }
    if (key === 'liveBadge') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {fieldInput('Label', liveBadge.label, (v) => applyUpdate({ liveBadge: { ...liveBadge, label: v } }), 'Live')}
          {fieldInput('Value', liveBadge.value, (v) => applyUpdate({ liveBadge: { ...liveBadge, value: v } }), '--')}
          {positionButtons(liveBadge.position, (p) => applyUpdate({ liveBadge: { ...liveBadge, position: p } }))}
        </div>
      );
    }
    if (key === 'countdown') {
      const currentVariant: CountdownVariant = countdown.variant || 'A';
      const variantLabels: Record<CountdownVariant, string> = {
        A: 'Full (D:H:M)',
        B: 'Days & Hours',
        C: 'Days + Image',
        D: 'Image + Minutes',
        E: 'Text Message',
        F: 'Compact',
      };
      const showDays = ['A', 'B', 'C', 'F'].includes(currentVariant);
      const showHours = ['A', 'B', 'F'].includes(currentVariant);
      const showMinutes = ['A', 'D', 'F'].includes(currentVariant);
      const showMessage = currentVariant === 'E';
      const showImage = ['C', 'D'].includes(currentVariant);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-family)' }}>Variant</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
              {(['A', 'B', 'C', 'D', 'E', 'F'] as CountdownVariant[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => applyUpdate({ countdown: { ...countdown, variant: v } })}
                  style={{
                    height: 28, borderRadius: 6, fontSize: 10, fontWeight: 500,
                    fontFamily: 'var(--font-family)', cursor: 'pointer',
                    border: currentVariant === v ? '1.5px solid var(--color-brand)' : '1px solid var(--color-border-default)',
                    background: currentVariant === v ? 'var(--color-brand-subtle)' : 'var(--color-bg-tertiary)',
                    color: currentVariant === v ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                    transition: 'var(--transition-fast)',
                    padding: '0 4px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {variantLabels[v]}
                </button>
              ))}
            </div>
          </div>
          {(showDays || showHours || showMinutes) && (
            <div style={{ display: 'grid', gridTemplateColumns: [showDays, showHours, showMinutes].filter(Boolean).length === 3 ? '1fr 1fr 1fr' : [showDays, showHours, showMinutes].filter(Boolean).length === 2 ? '1fr 1fr' : '1fr', gap: 6 }}>
              {showDays && fieldInput('Days', countdown.days, (v) => applyUpdate({ countdown: { ...countdown, days: v } }))}
              {showHours && fieldInput('Hours', countdown.hours, (v) => applyUpdate({ countdown: { ...countdown, hours: v } }))}
              {showMinutes && fieldInput('Min', countdown.minutes, (v) => applyUpdate({ countdown: { ...countdown, minutes: v } }))}
            </div>
          )}
          {showMessage && fieldInput('Message', countdown.message || '', (v) => applyUpdate({ countdown: { ...countdown, message: v } }), 'Starts in 3 days')}
          {showImage && fieldInput('Image URL', countdown.imageUrl || '', (v) => applyUpdate({ countdown: { ...countdown, imageUrl: v } }), 'https://...')}
          {positionButtons(countdown.position, (p) => applyUpdate({ countdown: { ...countdown, position: p } }))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <SectionHeader title="Attachments" />
      {order.map((key, idx) => {
        const meta = attachmentMeta[key];
        const active = isEnabled(key);
        const isDragging = dragIdx === idx;
        const dropLine = getDropLine(idx);
        const isExpanded = expandedAttachments.has(key) && active;

        return (
          <div key={key} style={{ position: 'relative' }}>
            {dropLine === 'above' && (
              <div style={{ position: 'absolute', top: -1, left: 10, right: 10, height: 2, background: 'var(--color-brand)', borderRadius: 1, zIndex: 2 }} />
            )}
            <div
              className={!isExpanded ? 'mep-card-hover' : undefined}
              style={{
                background: 'var(--color-bg-tertiary)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 6,
                overflow: 'hidden',
                opacity: isDragging ? 0.4 : 1,
                transition: 'var(--transition-fast)',
              }}
            >
              <div
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragEnter={() => handleDragEnter(idx)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 10px',
                  cursor: 'grab',
                }}
              >
                <GripVertical size={12} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                <div style={{
                  width: 24, height: 24, borderRadius: 5,
                  background: active ? 'var(--color-brand)' : 'var(--color-bg-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: active ? '#fff' : 'var(--color-text-secondary)',
                  flexShrink: 0, transition: 'var(--transition-fast)',
                }}>
                  {meta.icon}
                </div>
                <button
                  type="button"
                  onClick={() => { const next = new Set(expandedAttachments); if (isExpanded) next.delete(key); else next.add(key); setExpandedAttachments(next); }}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', gap: 4,
                    background: 'none', border: 'none', cursor: active ? 'pointer' : 'default',
                    padding: 0,
                  }}
                >
                  <span style={{
                    fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-family)',
                    color: active ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                    userSelect: 'none',
                  }}>
                    {meta.label}
                  </span>
                  {active && (
                    <ChevronRight size={11} style={{
                      color: 'var(--color-text-muted)',
                      transform: isExpanded ? 'rotate(90deg)' : 'none',
                      transition: 'transform 0.15s ease',
                    }} />
                  )}
                </button>
                <Toggle
                  label=""
                  size="sm"
                  checked={active}
                  onChange={() => toggleAttachment(key)}
                />
              </div>
              {isExpanded && (
                <div style={{
                  padding: '0 10px 10px',
                  borderTop: '1px solid var(--color-border-default)',
                  paddingTop: 10,
                  animation: 'fadeIn 0.15s ease',
                }}>
                  {renderConfig(key)}
                </div>
              )}
            </div>
            {dropLine === 'below' && (
              <div style={{ position: 'absolute', bottom: -1, left: 10, right: 10, height: 2, background: 'var(--color-brand)', borderRadius: 1, zIndex: 2 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ListDataSection({ component, sectionId }: { component: MessageComponent; sectionId: string }) {
  const updateComponentSettings = useMessageStore((s) => s.updateComponentSettings);
  const updateComponent = useMessageStore((s) => s.updateComponent);
  const settings = component.settings.type === 'list' ? component.settings.settings : null;
  if (!settings) return null;

  const linked = component.linkedValues ?? {};
  const setLinked = (fieldKey: string, lv: LinkedValue) => {
    updateComponent(sectionId, component.id, { linkedValues: { ...linked, [fieldKey]: lv } });
  };

  const update = (s: ListSettings) =>
    updateComponentSettings(sectionId, component.id, { type: 'list', settings: s });

  const [dataExpanded, setDataExpanded] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <SectionHeader title="Data" />
      <div
        className={!dataExpanded ? 'mep-card-hover' : undefined}
        style={{
          background: 'var(--color-bg-tertiary)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        <button
          type="button"
          onClick={() => setDataExpanded(!dataExpanded)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 10px',
            width: '100%',
            background: 'none', border: 'none', cursor: 'pointer',
            textAlign: 'left', fontFamily: 'inherit',
          }}
        >
          <div style={{
            width: 24, height: 24, borderRadius: 5,
            background: 'var(--color-bg-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-text-secondary)',
            flexShrink: 0,
          }}>
            <Hash size={14} />
          </div>
          <span style={{
            flex: 1,
            fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-family)',
            color: 'var(--color-text-primary)',
            userSelect: 'none',
          }}>
            Items
          </span>
          <ChevronRight size={11} style={{
            flexShrink: 0,
            color: 'var(--color-text-muted)',
            transform: dataExpanded ? 'rotate(90deg)' : 'none',
            transition: 'transform 0.15s ease',
          }} />
        </button>
        {dataExpanded && (
          <div style={{
            padding: '0 10px 10px',
            borderTop: '1px solid var(--color-border-default)',
            paddingTop: 10,
          }}>
            <LinkedWrapper
              label="Count"
              linked={linked['itemCount']}
              onLink={(lv) => setLinked('itemCount', lv)}
              variables={entityVariables}
              currentValue={String(settings.items.length)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <StepperBtn
                  onClick={() => {
                    if (settings.items.length > 1) {
                      update({ ...settings, items: settings.items.slice(0, -1), itemCount: settings.items.length - 1 });
                    }
                  }}
                  disabled={settings.items.length <= 1}
                >‹</StepperBtn>
                <input type="number" className="mep-input" min={1} value={settings.items.length}
                  onChange={(e) => {
                    const target = Math.max(1, parseInt(e.target.value, 10) || 1);
                    if (target > settings.items.length) {
                      const newItems = [...settings.items];
                      const last = settings.items[settings.items.length - 1];
                      for (let j = settings.items.length; j < target; j++) {
                        const ni: ListItem = { title: `Episode ${j + 1}`, subtitle: last?.subtitle || 'Subtitle', metadata: last?.metadata || 'CTA' };
                        if (settings.itemStyleMode === 'individual') {
                          ni.style = last?.style ?? { ...settings.itemStyle ?? { padding: 0, backgroundColor: 'transparent', backgroundRadius: [0, 0, 0, 0], strokeColor: 'transparent', strokeWidth: 0 } };
                        }
                        newItems.push(ni);
                      }
                      update({ ...settings, items: newItems, itemCount: target });
                    } else if (target < settings.items.length) {
                      update({ ...settings, items: settings.items.slice(0, target), itemCount: target });
                    }
                  }}
                  style={{ width: 40, height: 36, borderRadius: 8, border: '1px solid var(--color-border-default)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)', fontSize: 14, textAlign: 'center', outline: 'none', fontFamily: 'var(--font-family)', transition: 'var(--transition-fast)' }}
                />
                <StepperBtn
                  onClick={() => {
                    const n = settings.items.length + 1;
                    const last = settings.items[settings.items.length - 1];
                    const ni: ListItem = {
                      title: `Episode ${n}`,
                      subtitle: last?.subtitle || 'Subtitle',
                      metadata: last?.metadata || 'CTA',
                    };
                    if (settings.itemStyleMode === 'individual') {
                      ni.style = last?.style ?? { ...settings.itemStyle ?? { padding: 0, backgroundColor: 'transparent', backgroundRadius: [0, 0, 0, 0], strokeColor: 'transparent', strokeWidth: 0 } };
                    }
                    update({
                      ...settings,
                      items: [...settings.items, ni],
                      itemCount: n,
                    });
                  }}
                >›</StepperBtn>
              </div>
            </LinkedWrapper>
          </div>
        )}
      </div>
    </div>
  );
}

// --------------- Component Properties ---------------

function ComponentProperties({ component, sectionId, tab }: { component: MessageComponent; sectionId: string; tab: PropsTab }) {
  let typeSpecificContent: React.ReactNode = null;
  if (component.settings.type === 'text-block') {
    typeSpecificContent = <TextBlockProperties component={component} sectionId={sectionId} tab={tab} />;
  } else if (component.settings.type === 'rich-text') {
    typeSpecificContent = <RichTextProperties component={component} sectionId={sectionId} tab={tab} />;
  } else if (component.settings.type === 'media') {
    typeSpecificContent = <MediaProperties component={component} sectionId={sectionId} tab={tab} />;
  } else if (component.settings.type === 'cta') {
    typeSpecificContent = <CTAProperties component={component} sectionId={sectionId} tab={tab} />;
  } else if (component.settings.type === 'grid') {
    typeSpecificContent = <GridProperties component={component} sectionId={sectionId} tab={tab} />;
  } else if (component.settings.type === 'list') {
    typeSpecificContent = <ListProperties component={component} sectionId={sectionId} tab={tab} />;
  }

  if (tab === 'content') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <SectionHeader title="Content" />
          {typeSpecificContent}
        </div>
        {component.settings.type === 'list' && (
          <ListDataSection component={component} sectionId={sectionId} />
        )}
        <AttachmentsSection target={component} targetType="component" sectionId={sectionId} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {typeSpecificContent}
    </div>
  );
}

export function PropertiesPanel({ mode }: { mode?: 'section' | 'component' }) {
  const message = useMessageStore((s) => s.message);
  const selectedSectionId = useMessageStore((s) => s.selectedSectionId);
  const selectedComponentId = useMessageStore((s) => s.selectedComponentId);
  const [tab, setTab] = useState<PropsTab>('content');

  if (!message) return null;

  let section = message.sections.find((s) => s.id === selectedSectionId);
  let component: MessageComponent | undefined;
  if (selectedComponentId) {
    for (const s of message.sections) {
      component = s.components.find((c) => c.id === selectedComponentId);
      if (component) {
        section = s;
        break;
      }
    }
  }

  if (mode === 'section') {
    if (!section) {
      return (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
          Select a section to configure its properties.
        </div>
      );
    }
    return (
      <div style={{ padding: 20 }}>
        <TabSwitcher tab={tab} onTabChange={setTab} />
        <SectionProperties section={section} tab={tab} />
      </div>
    );
  }

  if (mode === 'component') {
    if (!component || !section) {
      return (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
          Select a component to configure its properties.
        </div>
      );
    }
    return (
      <div style={{ padding: 20 }}>
        <TabSwitcher tab={tab} onTabChange={setTab} />
        <ComponentProperties component={component} sectionId={section.id} tab={tab} />
      </div>
    );
  }

  if (!section && !component) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
        Select a section or component...
      </div>
    );
  }

  if (component && section) {
    return (
      <div style={{ padding: 20 }}>
        <TabSwitcher tab={tab} onTabChange={setTab} />
        <ComponentProperties component={component} sectionId={section.id} tab={tab} />
      </div>
    );
  }

  if (section) {
    return (
      <div style={{ padding: 20 }}>
        <TabSwitcher tab={tab} onTabChange={setTab} />
        <SectionProperties section={section} tab={tab} />
      </div>
    );
  }

  return null;
}
