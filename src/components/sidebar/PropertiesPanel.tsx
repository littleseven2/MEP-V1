import { useMessageStore } from '../../store/messageStore';
import type {
  Section,
  MessageComponent,
  SectionHydration,
  BackgroundConfig,
  TextBlockSettings,
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
                    <button type="button" style={arrowBtnStyle(isFirst)} disabled={isFirst} onClick={() => moveUp(key)}>▲</button>
                    <button type="button" style={arrowBtnStyle(isLast)} disabled={isLast} onClick={() => moveDown(key)}>▼</button>
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
                <button
                  key={c}
                  type="button"
                  onClick={() => update({ ...settings, columns: c, layout: c === 3 ? 'schedules' : settings.layout })}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    border: settings.columns === c ? '2px solid var(--color-brand)' : '1px solid var(--color-border-default)',
                    background: settings.columns === c ? 'var(--color-brand-subtle)' : 'var(--color-bg-tertiary)',
                    color: settings.columns === c ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
              Items
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <button
                type="button"
                onClick={() => {
                  if (settings.items.length > 1) {
                    update({ ...settings, items: settings.items.slice(0, -1), itemCount: settings.items.length - 1 });
                  }
                }}
                disabled={settings.items.length <= 1}
                style={{
                  width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border-default)',
                  color: settings.items.length <= 1 ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
                  cursor: settings.items.length <= 1 ? 'not-allowed' : 'pointer', fontSize: 18,
                  opacity: settings.items.length <= 1 ? 0.4 : 1,
                }}
              >
                ‹
              </button>
              <input type="number" min={1} value={settings.items.length}
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
                style={{ width: 40, height: 36, borderRadius: 8, border: '1px solid var(--color-border-default)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)', fontSize: 14, textAlign: 'center', outline: 'none', fontFamily: 'var(--font-family)' }}
              />
              <button
                type="button"
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
                style={{
                  width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border-default)',
                  color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: 18,
                }}
              >
                ›
              </button>
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
              <button type="button" onClick={() => update({ ...settings, padding: Math.max(0, (settings.padding ?? 0) - 1) })}
                disabled={(settings.padding ?? 0) <= 0}
                style={{
                  width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border-default)',
                  color: (settings.padding ?? 0) <= 0 ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
                  cursor: (settings.padding ?? 0) <= 0 ? 'not-allowed' : 'pointer', fontSize: 18,
                  opacity: (settings.padding ?? 0) <= 0 ? 0.4 : 1,
                }}>‹</button>
              <input type="number" value={settings.padding ?? 0}
                onChange={(e) => update({ ...settings, padding: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                style={{ width: 40, height: 36, borderRadius: 8, border: '1px solid var(--color-border-default)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)', fontSize: 14, textAlign: 'center', outline: 'none', fontFamily: 'var(--font-family)' }}
              />
              <button type="button" onClick={() => update({ ...settings, padding: (settings.padding ?? 0) + 1 })}
                style={{
                  width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border-default)',
                  color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: 18,
                }}>›</button>
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
          <div>
            <label style={{ display: 'block', textTransform: 'none', fontSize: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
              Background Radius
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {(['TL', 'TR', 'BL', 'BR'] as const).map((corner, idx) => {
                const radii = Array.isArray(settings.backgroundRadius) ? settings.backgroundRadius : [0, 0, 0, 0];
                return (
                  <div key={corner} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 10, color: 'var(--color-text-muted)', width: 18, flexShrink: 0 }}>{corner}</span>
                    <input type="number" value={radii[idx]}
                      onChange={(e) => {
                        const newRadii = [...radii] as [number, number, number, number];
                        newRadii[idx] = Math.max(0, parseInt(e.target.value, 10) || 0);
                        update({ ...settings, backgroundRadius: newRadii });
                      }}
                      style={{ width: '100%', height: 36, borderRadius: 8, border: '1px solid var(--color-border-default)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)', fontSize: 14, textAlign: 'center', outline: 'none', fontFamily: 'var(--font-family)' }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </PanelSection>
    </>
  );
}

function ComponentProperties({ component, sectionId }: { component: MessageComponent; sectionId: string }) {
  if (component.settings.type === 'text-block') {
    return <TextBlockProperties component={component} sectionId={sectionId} />;
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

export function PropertiesPanel() {
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
  } else if (section) {
    component = undefined;
  }

  if (!section && !component) {
    return (
      <div
        style={{
          padding: 24,
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: 14,
        }}
      >
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
