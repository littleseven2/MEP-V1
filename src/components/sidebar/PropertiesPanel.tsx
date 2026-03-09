import { useState, type CSSProperties } from 'react';
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight,
  Link, Quote, List, ListOrdered,
  IndentDecrease, IndentIncrease, RemoveFormatting,
  Type, Highlighter, Baseline, ChevronDown,
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
  LinkedValues,
  LinkedValue,
} from '../../types/message';
import {
  contentTypes,
  intentOptions,
  packageTypes,
} from '../../data/defaults';
import { entityVariables, themeVariables, allVariables } from '../../data/variables';
import { Select, Toggle, Input, LinkedField, LinkedWrapper } from '../../ui';

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

function ComponentStyleControls({ padding, backgroundColor, backgroundRadius, strokeColor, strokeWidth, onUpdate, title = 'Style', linked, onLink }: {
  padding: number;
  backgroundColor: string;
  backgroundRadius: [number, number, number, number];
  strokeColor: string;
  strokeWidth: number;
  onUpdate: (vals: { padding?: number; backgroundColor?: string; backgroundRadius?: [number, number, number, number]; strokeColor?: string; strokeWidth?: number }) => void;
  title?: string;
  linked?: LinkedValues;
  onLink?: (fieldKey: string, lv: LinkedValue) => void;
}) {
  const colorVars = themeVariables.filter((v) => v.valueType === 'color');
  const numberVars = [...themeVariables.filter((v) => v.valueType === 'text')];
  return (
    <PanelSection title={title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <LinkedWrapper
          label="Padding"
          linked={linked?.['padding']}
          onLink={(lv) => onLink?.('padding', lv)}
          variables={numberVars}
          currentValue={String(padding)}
          onValueFromVariable={(v) => onUpdate({ padding: parseInt(v) || 0 })}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StepperBtn onClick={() => onUpdate({ padding: Math.max(0, padding - 1) })} disabled={padding <= 0}>‹</StepperBtn>
            <StepperInput value={padding} onChange={(v) => onUpdate({ padding: Math.max(0, v || 0) })} />
            <StepperBtn onClick={() => onUpdate({ padding: padding + 1 })}>›</StepperBtn>
          </div>
        </LinkedWrapper>
        <LinkedField
          label="Background color"
          value={backgroundColor}
          linked={linked?.['backgroundColor']}
          onChange={(v) => onUpdate({ backgroundColor: v })}
          onLink={(lv) => onLink?.('backgroundColor', lv)}
          variables={colorVars}
          type="color"
          placeholder="transparent"
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
    </PanelSection>
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
      </>
    );
  }

  const colorVars = themeVariables.filter((v) => v.valueType === 'color');
  const numberVars = themeVariables.filter((v) => v.valueType === 'number');

  return (
    <>
      <PanelSection title="Visual">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <LinkedField
            label="Background color"
            value={section.background.value}
            onChange={(v) => updateBackground({ value: v })}
            onLink={() => {}}
            variables={colorVars}
            type="color"
            placeholder="transparent"
          />
          <LinkedWrapper
            label="Padding"
            variables={numberVars}
            onLink={() => {}}
            currentValue={String(section.padding ?? 0)}
            onValueFromVariable={(v) => updateSection(section.id, { padding: parseInt(v) || 0 })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StepperBtn onClick={() => updateSection(section.id, { padding: Math.max(0, (section.padding ?? 0) - 1) })} disabled={(section.padding ?? 0) <= 0}>‹</StepperBtn>
              <StepperInput value={section.padding ?? 0} onChange={(v) => updateSection(section.id, { padding: Math.max(0, v || 0) })} />
              <StepperBtn onClick={() => updateSection(section.id, { padding: (section.padding ?? 0) + 1 })}>›</StepperBtn>
            </div>
          </LinkedWrapper>
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
      </PanelSection>
    </>
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

  const fieldVarMap: Record<string, string> = { eyebrow: 'eyebrow', headline: 'headline', body: 'body' };
  const textVars = entityVariables.filter((v) => v.valueType === 'text');

  const arrowBtnStyle = (disabled: boolean): React.CSSProperties => ({
    width: 22, height: 22, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent', border: '1px solid var(--color-border-default)',
    color: disabled ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
    cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 12, opacity: disabled ? 0.4 : 1, padding: 0,
    transition: 'var(--transition-fast)',
  });

  if (tab === 'content') {
    return (
      <PanelSection title="Content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {settings.order.map((key, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === settings.order.length - 1;
            const fieldKey = fieldVarMap[key] ?? key;

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
                  <LinkedField
                    value={(settings[key] as { text: string }).text}
                    linked={linked[fieldKey]}
                    onChange={(v) => update({ ...settings, [key]: { ...(settings[key] as { enabled: boolean; text: string }), text: v } })}
                    onLink={(lv) => setLinked(fieldKey, lv)}
                    variables={textVars}
                    placeholder={labels[key]}
                  />
                )}
                {key === 'link' && settings.link.enabled && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
            );
          })}
        </div>
      </PanelSection>
    );
  }

  return (
    <>
      <PanelSection title="Layout">
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
      </PanelSection>
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
    </>
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
      <>
        <PanelSection title="Text Structure">
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
        </PanelSection>

        <PanelSection title="Content Editing">
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
        </PanelSection>
      </>
    );
  }

  return (
    <>
      <PanelSection title="Text Appearance">
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
      </PanelSection>
      <PanelSection title="Typography">
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
      </PanelSection>
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
    </>
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
      <>
        <PanelSection title="Elements">
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
        </PanelSection>
        <PanelSection title="Data">
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
        </PanelSection>
      </>
    );
  }

  return (
    <>
      <PanelSection title="Layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <LinkedWrapper
            linked={linked['alignment']}
            onLink={(lv) => setLinked('alignment', lv)}
            variables={themeVariables}
            currentValue={settings.alignment}
          >
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
          </LinkedWrapper>
          <LinkedWrapper
            linked={linked['isInteractive']}
            onLink={(lv) => setLinked('isInteractive', lv)}
            variables={entityVariables}
            currentValue={String(settings.isInteractive)}
          >
            <Toggle
              label="Interactive"
              checked={settings.isInteractive}
              onChange={(v) => update({ ...settings, isInteractive: v })}
            />
          </LinkedWrapper>
          <LinkedWrapper
            label="Image radius"
            linked={linked['mediaRadius']}
            onLink={(lv) => setLinked('mediaRadius', lv)}
            variables={themeVariables.filter((v) => v.valueType === 'text')}
            currentValue={String(settings.mediaRadius ?? 8)}
            onValueFromVariable={(v) => update({ ...settings, mediaRadius: parseInt(v) || 8 })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StepperBtn onClick={() => update({ ...settings, mediaRadius: Math.max(0, (settings.mediaRadius ?? 8) - 1) })} disabled={(settings.mediaRadius ?? 8) <= 0}>‹</StepperBtn>
              <StepperInput value={settings.mediaRadius ?? 8} onChange={(v) => update({ ...settings, mediaRadius: Math.max(0, v || 0) })} />
              <StepperBtn onClick={() => update({ ...settings, mediaRadius: (settings.mediaRadius ?? 8) + 1 })}>›</StepperBtn>
            </div>
          </LinkedWrapper>
        </div>
      </PanelSection>
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
    </>
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
    const n = settings.buttons.length + 1;
    update({
      ...settings,
      buttons: [...settings.buttons, {
        enabled: true,
        text: `Button ${n}`,
        url: '',
        style: 'secondary' as const,
        fillColor: '#333333',
        borderColor: '#333333',
        textColor: '#ffffff',
      }],
    });
  };

  const removeButton = (index: number) => {
    if (settings.buttons.length <= 1) return;
    update({ ...settings, buttons: settings.buttons.filter((_, i) => i !== index) });
  };

  if (tab === 'content') {
    return (
      <PanelSection title="Elements">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {settings.buttons.map((btn, i) => (
            <div key={i} style={{ padding: 12, background: 'var(--color-bg-tertiary)', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <Toggle
                  label={`Button ${i + 1}`}
                  checked={btn.enabled ?? true}
                  onChange={(v) => updateButton(i, { enabled: v })}
                />
                {settings.buttons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeButton(i)}
                    style={{
                      background: 'none', border: 'none', color: 'var(--color-text-muted)',
                      cursor: 'pointer', fontSize: 16, padding: '0 4px', lineHeight: 1,
                    }}
                    title="Remove button"
                  >×</button>
                )}
              </div>
              {(btn.enabled ?? true) && (
                <>
                  <LinkedField
                    label="Text"
                    value={btn.text}
                    linked={linked[`btn.${i}.text`]}
                    onChange={(v) => updateButton(i, { text: v })}
                    onLink={(lv) => setLinked(`btn.${i}.text`, lv)}
                    variables={entityVariables.filter((v) => v.valueType === 'text')}
                    placeholder="Button text"
                  />
                  <div style={{ marginTop: 8 }}>
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
                </>
              )}
            </div>
          ))}
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
        </div>
      </PanelSection>
    );
  }

  return (
    <>
      <PanelSection title="Button Style">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {settings.buttons.map((btn, i) => (
            <LinkedField
              key={i}
              label={`Button ${i + 1} fill`}
              value={btn.fillColor}
              linked={linked[`btn.${i}.fillColor`]}
              onChange={(v) => updateButton(i, { fillColor: v })}
              onLink={(lv) => setLinked(`btn.${i}.fillColor`, lv)}
              variables={themeVariables.filter((v) => v.valueType === 'color')}
              type="color"
              placeholder="#E50914"
            />
          ))}
        </div>
      </PanelSection>
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
    </>
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
      <PanelSection title="Grid Data">
        <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-family)' }}>
          Grid cells are populated from entity data. Select cells on the canvas to configure individual content.
        </p>
      </PanelSection>
    );
  }

  return (
    <>
      <PanelSection title="Grid Layout">
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
      </PanelSection>
      <PanelSection title="Spacing">
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
      </PanelSection>
      <GridCellStyleSection settings={settings} update={update} />
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
    </>
  );
}

function GridCellStyleSection({ settings, update }: { settings: GridSettings; update: (s: GridSettings) => void }) {
  const defaultCellStyle: GridCellStyle = { padding: 0, backgroundColor: 'transparent', backgroundRadius: [0, 0, 0, 0], strokeColor: 'transparent', strokeWidth: 0, imageRadius: settings.cellStyle?.imageRadius ?? settings.itemRadius ?? 8 };
  const wholeStyle: GridCellStyle = settings.cellStyle ?? defaultCellStyle;

  return (
    <PanelSection title="Cell style">
      <ItemStyleControls
        style={wholeStyle}
        onChange={(s) => update({ ...settings, cellStyle: s as GridCellStyle })}
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

  if (tab === 'content') {
    return (
      <>
        <PanelSection title="Elements">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Toggle
              label="Thumbnail"
              checked={settings.showThumbnail}
              onChange={(v) => update({ ...settings, showThumbnail: v })}
            />
            <Toggle
              label="Title"
              checked={settings.showTitle ?? true}
              onChange={(v) => update({ ...settings, showTitle: v })}
            />
            <Toggle
              label="Subtitle"
              checked={settings.showSubtitle ?? true}
              onChange={(v) => update({ ...settings, showSubtitle: v })}
            />
            <Toggle
              label="Metadata / CTA"
              checked={settings.showMetadata ?? true}
              onChange={(v) => update({ ...settings, showMetadata: v })}
            />
          </div>
        </PanelSection>
        <PanelSection title="Data">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <LinkedWrapper
              label="Items"
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
        </PanelSection>
      </>
    );
  }

  return (
    <>
      <PanelSection title="List Layout">
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
        </div>
      </PanelSection>
      {settings.showThumbnail && (
        <PanelSection title="Thumbnail">
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
        </PanelSection>
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
    </>
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
      <div>
        <label style={labelStyle}>Padding</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StepperBtn onClick={() => onChange({ ...style, padding: Math.max(0, style.padding - 1) })} disabled={style.padding <= 0}>‹</StepperBtn>
          <StepperInput value={style.padding} onChange={(v) => onChange({ ...style, padding: Math.max(0, v || 0) })} />
          <StepperBtn onClick={() => onChange({ ...style, padding: style.padding + 1 })}>›</StepperBtn>
        </div>
      </div>
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
    <PanelSection title="Item style">
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
    </PanelSection>
  );
}

function ComponentProperties({ component, sectionId, tab }: { component: MessageComponent; sectionId: string; tab: PropsTab }) {
  if (component.settings.type === 'text-block') {
    return <TextBlockProperties component={component} sectionId={sectionId} tab={tab} />;
  }
  if (component.settings.type === 'rich-text') {
    return <RichTextProperties component={component} sectionId={sectionId} tab={tab} />;
  }
  if (component.settings.type === 'media') {
    return <MediaProperties component={component} sectionId={sectionId} tab={tab} />;
  }
  if (component.settings.type === 'cta') {
    return <CTAProperties component={component} sectionId={sectionId} tab={tab} />;
  }
  if (component.settings.type === 'grid') {
    return <GridProperties component={component} sectionId={sectionId} tab={tab} />;
  }
  if (component.settings.type === 'list') {
    return <ListProperties component={component} sectionId={sectionId} tab={tab} />;
  }
  return null;
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
