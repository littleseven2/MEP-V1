import { useState, type CSSProperties } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Link } from 'lucide-react';
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
  ListColumns,
} from '../../types/message';
import {
  contentTypes,
  intentOptions,
  packageTypes,
} from '../../data/defaults';
import { Select, Toggle, Input } from '../../ui';

function PanelSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      padding: '16px 0',
      borderBottom: '1px solid var(--color-border-default)',
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

function SectionProperties({ section }: { section: Section }) {
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

  return (
    <>
      <PanelSection title="Data Hydration">
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
      </PanelSection>
      <PanelSection title="Visual">
        <Select
          label="Background"
          options={[
            { value: 'solid', label: 'Solid' },
            { value: 'gradient', label: 'Gradient' },
            { value: 'blur', label: 'Blur' },
            { value: 'image', label: 'Image' },
          ]}
          value={section.background.type}
          onChange={(v) => updateBackground({ type: v as BackgroundConfig['type'] })}
        />
      </PanelSection>
      <PanelSection title="Settings">
        <div style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>
          {section.isPrimary ? 'This is the primary section' : 'Use the ★ control to set as primary'}
        </div>
      </PanelSection>
    </>
  );
}

function TextBlockProperties({ component, sectionId }: { component: MessageComponent; sectionId: string }) {
  const updateComponentSettings = useMessageStore((s) => s.updateComponentSettings);
  const settings = component.settings.type === 'text-block' ? component.settings.settings : null;
  if (!settings) return null;

  const update = (s: TextBlockSettings) =>
    updateComponentSettings(sectionId, component.id, { type: 'text-block', settings: s });

  const moveUp = (key: string) => {
    const idx = settings.order.indexOf(key as typeof settings.order[number]);
    if (idx <= 0) return;
    const newOrder = [...settings.order];
    [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
    update({ ...settings, order: newOrder });
  };

  const moveDown = (key: string) => {
    const idx = settings.order.indexOf(key as typeof settings.order[number]);
    if (idx < 0 || idx >= settings.order.length - 1) return;
    const newOrder = [...settings.order];
    [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
    update({ ...settings, order: newOrder });
  };

  const labels: Record<string, string> = { eyebrow: 'Eyebrow', headline: 'Headline', body: 'Body', link: 'CTA Link' };

  const arrowBtnStyle = (disabled: boolean): React.CSSProperties => ({
    width: 22, height: 22, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent', border: '1px solid var(--color-border-default)',
    color: disabled ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
    cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 12, opacity: disabled ? 0.4 : 1, padding: 0,
    transition: 'var(--transition-fast)',
  });

  return (
    <>
      <PanelSection title="Content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {settings.order.map((key, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === settings.order.length - 1;

            return (
              <div key={key}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button type="button" className="mep-toolbar-btn" style={arrowBtnStyle(isFirst)} disabled={isFirst} onClick={() => moveUp(key)}>▲</button>
                    <button type="button" className="mep-toolbar-btn" style={arrowBtnStyle(isLast)} disabled={isLast} onClick={() => moveDown(key)}>▼</button>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Toggle
                      label={labels[key]}
                      checked={(settings[key] as { enabled: boolean }).enabled}
                      onChange={(v) => {
                        if (key === 'link') update({ ...settings, link: { ...settings.link, enabled: v } });
                        else update({ ...settings, [key]: { ...(settings[key] as { enabled: boolean; text: string }), enabled: v } });
                      }}
                    />
                  </div>
                </div>
                {(settings[key] as { enabled: boolean }).enabled && key !== 'link' && (
                  <Input
                    value={(settings[key] as { text: string }).text}
                    onChange={(e) => update({ ...settings, [key]: { ...(settings[key] as { enabled: boolean; text: string }), text: e.target.value } })}
                    placeholder={labels[key]}
                  />
                )}
                {key === 'link' && settings.link.enabled && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Input
                      value={settings.link.text}
                      onChange={(e) => update({ ...settings, link: { ...settings.link, text: e.target.value } })}
                      placeholder="Link text"
                    />
                    <Input
                      value={settings.link.url}
                      onChange={(e) => update({ ...settings, link: { ...settings.link, url: e.target.value } })}
                      placeholder="URL"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </PanelSection>
    </>
  );
}

function RichTextProperties({ component, sectionId }: { component: MessageComponent; sectionId: string }) {
  const updateComponentSettings = useMessageStore((s) => s.updateComponentSettings);
  const settings = component.settings.type === 'rich-text' ? component.settings.settings : null;
  if (!settings) return null;

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

  return (
    <>
      <PanelSection title="Formatting">
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
          <div style={{ width: 1, height: 32, background: 'var(--color-border-default)', margin: '0 4px' }} />
          <button type="button" className="mep-toolbar-btn" style={toolbarBtnStyle(settings.alignment === 'left')} onClick={() => update({ ...settings, alignment: 'left' })} title="Align left">
            <AlignLeft size={14} />
          </button>
          <button type="button" className="mep-toolbar-btn" style={toolbarBtnStyle(settings.alignment === 'center')} onClick={() => update({ ...settings, alignment: 'center' })} title="Align center">
            <AlignCenter size={14} />
          </button>
          <button type="button" className="mep-toolbar-btn" style={toolbarBtnStyle(settings.alignment === 'right')} onClick={() => update({ ...settings, alignment: 'right' })} title="Align right">
            <AlignRight size={14} />
          </button>
          <div style={{ width: 1, height: 32, background: 'var(--color-border-default)', margin: '0 4px' }} />
          <button type="button" className="mep-toolbar-btn" style={toolbarBtnStyle()} onClick={() => {
            const url = prompt('Enter link URL:');
            if (url) execCommand('createLink', url);
          }} title="Insert link">
            <Link size={14} />
          </button>
        </div>
      </PanelSection>
      <PanelSection title="Style">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
              Font size
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StepperBtn onClick={() => update({ ...settings, fontSize: Math.max(10, settings.fontSize - 1) })} disabled={settings.fontSize <= 10}>‹</StepperBtn>
              <StepperInput value={settings.fontSize} onChange={(v) => update({ ...settings, fontSize: Math.max(10, v || 16) })} />
              <StepperBtn onClick={() => update({ ...settings, fontSize: settings.fontSize + 1 })}>›</StepperBtn>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
              Line height
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StepperBtn onClick={() => update({ ...settings, lineHeight: Math.max(1, +(settings.lineHeight - 0.1).toFixed(1)) })} disabled={settings.lineHeight <= 1}>‹</StepperBtn>
              <StepperInput value={settings.lineHeight} onChange={(v) => update({ ...settings, lineHeight: Math.max(1, v || 1.6) })} style={{ width: 48 }} />
              <StepperBtn onClick={() => update({ ...settings, lineHeight: +(settings.lineHeight + 0.1).toFixed(1) })}>›</StepperBtn>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
              Text color
            </label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="color"
                value={settings.color}
                onChange={(e) => update({ ...settings, color: e.target.value })}
                style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--color-border-default)', background: 'var(--color-bg-tertiary)', cursor: 'pointer', padding: 2 }}
              />
              <Input
                value={settings.color}
                onChange={(e) => update({ ...settings, color: e.target.value })}
                placeholder="#ffffff"
                style={{ flex: 1 }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
              Padding
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StepperBtn onClick={() => update({ ...settings, padding: Math.max(0, settings.padding - 1) })} disabled={settings.padding <= 0}>‹</StepperBtn>
              <StepperInput value={settings.padding} onChange={(v) => update({ ...settings, padding: Math.max(0, v || 0) })} />
              <StepperBtn onClick={() => update({ ...settings, padding: settings.padding + 1 })}>›</StepperBtn>
            </div>
          </div>
        </div>
      </PanelSection>
    </>
  );
}

function MediaProperties({ component, sectionId }: { component: MessageComponent; sectionId: string }) {
  const updateComponentSettings = useMessageStore((s) => s.updateComponentSettings);
  const settings = component.settings.type === 'media' ? component.settings.settings : null;
  if (!settings) return null;

  const update = (s: MediaSettings) =>
    updateComponentSettings(sectionId, component.id, { type: 'media', settings: s });

  return (
    <PanelSection title="Media">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Select
          label="Format"
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
        <Select
          label="Alignment"
          options={[
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ]}
          value={settings.alignment}
          onChange={(v) => update({ ...settings, alignment: v as MediaSettings['alignment'] })}
        />
        <Toggle
          label="Interactive"
          checked={settings.isInteractive}
          onChange={(v) => update({ ...settings, isInteractive: v })}
        />
      </div>
    </PanelSection>
  );
}

function CTAProperties({ component, sectionId }: { component: MessageComponent; sectionId: string }) {
  const updateComponentSettings = useMessageStore((s) => s.updateComponentSettings);
  const settings = component.settings.type === 'cta' ? component.settings.settings : null;
  if (!settings) return null;

  const update = (s: CTASettings) =>
    updateComponentSettings(sectionId, component.id, { type: 'cta', settings: s });

  const updateButton = (index: number, updates: Partial<CTASettings['buttons'][0]>) => {
    const buttons = [...settings.buttons];
    buttons[index] = { ...buttons[index], ...updates };
    update({ ...settings, buttons });
  };

  return (
    <PanelSection title="CTA Buttons">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {settings.buttons.map((btn, i) => (
          <div key={i} style={{ padding: 12, background: 'var(--color-bg-tertiary)', borderRadius: 8 }}>
            <Input
              label="Text"
              value={btn.text}
              onChange={(e) => updateButton(i, { text: e.target.value })}
            />
            <Input
              label="URL"
              value={btn.url}
              onChange={(e) => updateButton(i, { url: e.target.value })}
              style={{ marginTop: 8 }}
            />
            <Input
              label="Fill"
              type="color"
              value={btn.fillColor}
              onChange={(e) => updateButton(i, { fillColor: e.target.value })}
              style={{ marginTop: 8 }}
            />
          </div>
        ))}
      </div>
    </PanelSection>
  );
}

function GridProperties({ component, sectionId }: { component: MessageComponent; sectionId: string }) {
  const updateComponentSettings = useMessageStore((s) => s.updateComponentSettings);
  const settings = component.settings.type === 'grid' ? component.settings.settings : null;
  if (!settings) return null;

  const update = (s: GridSettings) =>
    updateComponentSettings(sectionId, component.id, { type: 'grid', settings: s });

  return (
    <PanelSection title="Grid">
      <Select
        label="Layout"
        options={[
          { value: '2-up', label: '2-up' },
          { value: '3-up', label: '3-up' },
          { value: '4-up', label: '4-up' },
          { value: '6-up', label: '6-up' },
          { value: '2x2', label: '2x2' },
          { value: '3x2', label: '3x2' },
          { value: '2x3', label: '2x3' },
        ]}
        value={settings.layout}
        onChange={(v) => update({ ...settings, layout: v as GridSettings['layout'] })}
      />
      <Toggle
        label="Spacing"
        checked={settings.spacing}
        onChange={(v) => update({ ...settings, spacing: v })}
        style={{ marginTop: 12 }}
      />
    </PanelSection>
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

function ListProperties({ component, sectionId }: { component: MessageComponent; sectionId: string }) {
  const updateComponentSettings = useMessageStore((s) => s.updateComponentSettings);
  const settings = component.settings.type === 'list' ? component.settings.settings : null;
  if (!settings) return null;

  const update = (s: ListSettings) =>
    updateComponentSettings(sectionId, component.id, { type: 'list', settings: s });

  const addItem = () => {
    const n = settings.items.length + 1;
    const last = settings.items[settings.items.length - 1];
    update({
      ...settings,
      items: [...settings.items, {
        title: `Episode ${n}`,
        subtitle: last?.subtitle || 'Subtitle',
        metadata: last?.metadata || 'CTA',
      }],
    });
  };

  const removeItem = (index: number) => {
    update({
      ...settings,
      items: settings.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index: number, updates: Partial<ListItem>) => {
    const items = [...settings.items];
    items[index] = { ...items[index], ...updates };
    update({ ...settings, items });
  };

  return (
    <>
      <PanelSection title="List">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
              Columns
            </label>
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
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
              Items
            </label>
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
                      newItems.push({ title: `Episode ${j + 1}`, subtitle: last?.subtitle || 'Subtitle', metadata: last?.metadata || 'CTA' });
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
                  update({
                    ...settings,
                    items: [...settings.items, {
                      title: `Episode ${n}`,
                      subtitle: last?.subtitle || 'Subtitle',
                      metadata: last?.metadata || 'CTA',
                    }],
                    itemCount: n,
                  });
                }}
              >›</StepperBtn>
            </div>
          </div>
          <Toggle
            label="Show divider"
            checked={settings.showDivider}
            onChange={(v) => update({ ...settings, showDivider: v })}
          />
          <Toggle
            label="Show thumbnail"
            checked={settings.showThumbnail}
            onChange={(v) => update({ ...settings, showThumbnail: v })}
          />
        </div>
      </PanelSection>
      <PanelSection title="Style">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', textTransform: 'none', fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
              Padding
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StepperBtn onClick={() => update({ ...settings, padding: Math.max(0, (settings.padding ?? 0) - 1) })} disabled={(settings.padding ?? 0) <= 0}>‹</StepperBtn>
              <StepperInput value={settings.padding ?? 0} onChange={(v) => update({ ...settings, padding: Math.max(0, v || 0) })} />
              <StepperBtn onClick={() => update({ ...settings, padding: (settings.padding ?? 0) + 1 })}>›</StepperBtn>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', textTransform: 'none', fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
              Background Color
            </label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="color"
                value={settings.backgroundColor === 'transparent' ? '#000000' : settings.backgroundColor}
                onChange={(e) => update({ ...settings, backgroundColor: e.target.value })}
                style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--color-border-default)', background: 'var(--color-bg-tertiary)', cursor: 'pointer', padding: 2 }}
              />
              <Input
                value={settings.backgroundColor ?? 'transparent'}
                onChange={(e) => update({ ...settings, backgroundColor: e.target.value })}
                placeholder="transparent"
                style={{ flex: 1 }}
              />
            </div>
          </div>
          <RadiusControl radii={Array.isArray(settings.backgroundRadius) ? settings.backgroundRadius : [0, 0, 0, 0]}
            onChange={(r) => update({ ...settings, backgroundRadius: r })} />
        </div>
      </PanelSection>
    </>
  );
}

function ComponentProperties({ component, sectionId }: { component: MessageComponent; sectionId: string }) {
  if (component.settings.type === 'text-block') {
    return <TextBlockProperties component={component} sectionId={sectionId} />;
  }
  if (component.settings.type === 'rich-text') {
    return <RichTextProperties component={component} sectionId={sectionId} />;
  }
  if (component.settings.type === 'media') {
    return <MediaProperties component={component} sectionId={sectionId} />;
  }
  if (component.settings.type === 'cta') {
    return <CTAProperties component={component} sectionId={sectionId} />;
  }
  if (component.settings.type === 'grid') {
    return <GridProperties component={component} sectionId={sectionId} />;
  }
  if (component.settings.type === 'list') {
    return <ListProperties component={component} sectionId={sectionId} />;
  }
  return null;
}

export function PropertiesPanel({ mode }: { mode?: 'section' | 'component' }) {
  const message = useMessageStore((s) => s.message);
  const selectedSectionId = useMessageStore((s) => s.selectedSectionId);
  const selectedComponentId = useMessageStore((s) => s.selectedComponentId);

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
    return <div style={{ padding: 20 }}><SectionProperties section={section} /></div>;
  }

  if (mode === 'component') {
    if (!component || !section) {
      return (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
          Select a component to configure its properties.
        </div>
      );
    }
    return <div style={{ padding: 20 }}><ComponentProperties component={component} sectionId={section.id} /></div>;
  }

  if (!section && !component) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
        Select a section or component...
      </div>
    );
  }

  if (component && section) {
    return <div style={{ padding: 20 }}><ComponentProperties component={component} sectionId={section.id} /></div>;
  }

  if (section) {
    return <div style={{ padding: 20 }}><SectionProperties section={section} /></div>;
  }

  return null;
}
