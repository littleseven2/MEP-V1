import { useRef, useEffect } from 'react';
import { useMessageStore } from '../../store/messageStore';
import type { MessageComponent, RichTextSettings } from '../../types/message';
import { posters } from '../../data/posters';

interface ComponentRendererProps {
  component: MessageComponent;
  sectionId: string;
}

function strokeStyle(color?: string, width?: number): React.CSSProperties {
  const w = width ?? 0;
  const c = color ?? 'transparent';
  if (!w || c === 'transparent') return {};
  return { border: `${w}px solid ${c}` };
}

function MediaPreview({ settings }: { settings: { alignment: string; mediaRadius?: number; padding?: number; backgroundColor?: string; backgroundRadius?: [number, number, number, number]; strokeColor?: string; strokeWidth?: number } }) {
  const r = settings.backgroundRadius ?? [0, 0, 0, 0];
  const imgRadius = settings.mediaRadius ?? 8;
  return (
    <div style={{
      padding: settings.padding ?? 0,
      background: settings.backgroundColor || 'transparent',
      borderRadius: `${r[0]}px ${r[1]}px ${r[2]}px ${r[3]}px`,
      ...strokeStyle(settings.strokeColor, settings.strokeWidth),
    }}>
      <div
        style={{
          width: '100%',
          aspectRatio: '16/9',
          borderRadius: imgRadius,
          overflow: 'hidden',
          position: 'relative',
          background: 'rgba(255,255,255,0.08)',
        }}
      >
        <img src={posters[0].image} alt={posters[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    </div>
  );
}

function TextBlockPreview({ settings }: { settings: { eyebrow: { enabled: boolean; text: string }; headline: { enabled: boolean; text: string }; body: { enabled: boolean; text: string }; link: { enabled: boolean; text: string; url: string }; order: ('eyebrow' | 'headline' | 'body' | 'link')[]; alignment?: 'left' | 'center' | 'right'; padding?: number; backgroundColor?: string; backgroundRadius?: [number, number, number, number]; strokeColor?: string; strokeWidth?: number } }) {
  const items = settings.order
    .filter((k) => (settings[k] as { enabled?: boolean })?.enabled)
    .map((k) => {
      const item = settings[k];
      if (k === 'eyebrow') return { type: 'eyebrow' as const, text: item.text };
      if (k === 'headline') return { type: 'headline' as const, text: item.text };
      if (k === 'body') return { type: 'body' as const, text: item.text };
      if (k === 'link') return { type: 'link' as const, text: item.text };
      return null;
    })
    .filter(Boolean) as { type: string; text: string }[];

  const eyebrowColor = 'rgba(255,255,255,0.9)';
  const headlineColor = '#fff';
  const bodyColor = 'rgba(255,255,255,0.65)';
  const linkColor = 'rgba(255,255,255,0.65)';

  const r = settings.backgroundRadius ?? [0, 0, 0, 0];

  const align = settings.alignment ?? 'left';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 4,
      textAlign: align,
      padding: settings.padding ?? 0,
      background: settings.backgroundColor || 'transparent',
      borderRadius: `${r[0]}px ${r[1]}px ${r[2]}px ${r[3]}px`,
      ...strokeStyle(settings.strokeColor, settings.strokeWidth),
    }}>
      {items?.map((item, i) => (
        <div key={i}>
          {item?.type === 'eyebrow' && (
            <p style={{ fontSize: 14, fontWeight: 500, lineHeight: '22px', color: eyebrowColor }}>
              {item.text}
            </p>
          )}
          {item?.type === 'headline' && (
            <p style={{ fontSize: 28, fontWeight: 700, lineHeight: '36px', color: headlineColor }}>
              {item.text}
            </p>
          )}
          {item?.type === 'body' && (
            <p style={{ fontSize: 16, fontWeight: 400, lineHeight: '24px', color: bodyColor }}>
              {item.text}
            </p>
          )}
          {item?.type === 'link' && (
            <a href="#" onClick={(e) => e.preventDefault()} style={{
              fontSize: 16, fontWeight: 400, lineHeight: '24px',
              color: linkColor, textDecoration: 'underline',
            }}>
              {item.text}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

function CTAPreview({ settings }: { settings: { buttons: { enabled?: boolean; text: string; fillColor: string; borderColor: string; textColor: string }[]; padding?: number; backgroundColor?: string; backgroundRadius?: [number, number, number, number]; strokeColor?: string; strokeWidth?: number } }) {
  const r = settings.backgroundRadius ?? [0, 0, 0, 0];
  const visibleButtons = settings.buttons.filter((btn) => btn.enabled ?? true);
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 8,
      padding: settings.padding ?? 0,
      background: settings.backgroundColor || 'transparent',
      borderRadius: `${r[0]}px ${r[1]}px ${r[2]}px ${r[3]}px`,
      ...strokeStyle(settings.strokeColor, settings.strokeWidth),
    }}>
      {visibleButtons.map((btn, i) => (
        <button
          key={i}
          type="button"
          style={{
            padding: '12px 24px',
            background: btn.fillColor,
            border: `1px solid ${btn.borderColor}`,
            color: btn.textColor,
            borderRadius: 24,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {btn.text}
        </button>
      ))}
    </div>
  );
}

function GridCell({ n, radius, cellStyle }: { n: number; radius: number; cellStyle?: { padding: number; backgroundColor: string; backgroundRadius: [number, number, number, number]; strokeColor: string; strokeWidth: number; imageRadius?: number } }) {
  const poster = posters[(n - 1) % posters.length];
  const cs = cellStyle;
  const csRadius = cs?.backgroundRadius ?? [0, 0, 0, 0];
  const imgRadius = cs?.imageRadius ?? radius;
  const hasCs = cs && (cs.padding > 0 || cs.backgroundColor !== 'transparent' || csRadius.some(v => v > 0) || (cs.strokeColor !== 'transparent' && cs.strokeWidth > 0));
  if (hasCs) {
    return (
      <div style={{
        padding: cs.padding,
        background: cs.backgroundColor || 'transparent',
        borderRadius: `${csRadius[0]}px ${csRadius[1]}px ${csRadius[2]}px ${csRadius[3]}px`,
        ...strokeStyle(cs.strokeColor, cs.strokeWidth),
      }}>
        <div style={{
          aspectRatio: '2/3',
          borderRadius: imgRadius,
          overflow: 'hidden',
          position: 'relative',
          background: 'rgba(255,255,255,0.08)',
        }}>
          <img src={poster.image} alt={poster.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      </div>
    );
  }
  return (
    <div style={{
      aspectRatio: '2/3',
      borderRadius: imgRadius,
      overflow: 'hidden',
      position: 'relative',
      background: 'rgba(255,255,255,0.08)',
    }}>
      <img src={poster.image} alt={poster.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
  );
}

function GridPreview({ settings }: { settings: { layout: string; items: { url?: string }[]; splitMode?: 'row' | 'column'; rows?: number[]; cols?: number[]; gap?: number; itemRadius?: number; cellStyleMode?: 'whole' | 'individual'; cellStyle?: { padding: number; backgroundColor: string; backgroundRadius: [number, number, number, number]; strokeColor: string; strokeWidth: number; imageRadius?: number }; cellStyles?: { padding: number; backgroundColor: string; backgroundRadius: [number, number, number, number]; strokeColor: string; strokeWidth: number; imageRadius?: number }[]; padding?: number; backgroundColor?: string; backgroundRadius?: [number, number, number, number]; strokeColor?: string; strokeWidth?: number } }) {
  const r = settings.backgroundRadius ?? [0, 0, 0, 0];
  const gapPx = settings.gap ?? 8;
  const radius = settings.itemRadius ?? 8;
  const mode = settings.splitMode ?? 'row';
  const csMode = settings.cellStyleMode ?? 'whole';
  const defaultCs = { padding: 0, backgroundColor: 'transparent', backgroundRadius: [0, 0, 0, 0] as [number, number, number, number], strokeColor: 'transparent', strokeWidth: 0 };
  const wholeCs = settings.cellStyle ?? defaultCs;
  const getCellStyle = (idx: number) => {
    if (csMode === 'individual' && settings.cellStyles && settings.cellStyles[idx]) return settings.cellStyles[idx];
    return wholeCs;
  };

  const containerStyle: React.CSSProperties = {
    padding: settings.padding ?? 0,
    background: settings.backgroundColor || 'transparent',
    borderRadius: `${r[0]}px ${r[1]}px ${r[2]}px ${r[3]}px`,
    ...strokeStyle(settings.strokeColor, settings.strokeWidth),
  };

  if (mode === 'column') {
    const cols = settings.cols ?? [2, 2, 2];
    let cellIdx = 0;
    return (
      <div style={{ ...containerStyle, display: 'flex', gap: gapPx, alignItems: 'stretch' }}>
        {cols.map((rowCount, colIdx) => (
          <div key={colIdx} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: gapPx }}>
            {Array.from({ length: rowCount }, () => ++cellIdx).map((n) => {
              const cs = getCellStyle(n - 1);
              const csR = cs.backgroundRadius;
              const imgR = ('imageRadius' in cs ? (cs as { imageRadius?: number }).imageRadius : undefined) ?? radius;
              const hasCs = cs.padding > 0 || cs.backgroundColor !== 'transparent' || csR.some(v => v > 0) || (cs.strokeColor !== 'transparent' && cs.strokeWidth > 0);
              const poster = posters[(n - 1) % posters.length];
              return hasCs ? (
                <div key={n} style={{
                  flex: 1, minHeight: 0,
                  padding: cs.padding,
                  background: cs.backgroundColor || 'transparent',
                  borderRadius: `${csR[0]}px ${csR[1]}px ${csR[2]}px ${csR[3]}px`,
                  ...strokeStyle(cs.strokeColor, cs.strokeWidth),
                  display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ flex: 1, borderRadius: imgR, overflow: 'hidden', background: 'rgba(255,255,255,0.08)', minHeight: 0 }}>
                    <img src={poster.image} alt={poster.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                </div>
              ) : (
                <div key={n} style={{
                  flex: 1,
                  borderRadius: imgR,
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.08)',
                  minHeight: 0,
                }}>
                  <img src={poster.image} alt={poster.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  const rows = settings.rows ?? [3, 3];
  let cellIdx = 0;
  return (
    <div style={{ ...containerStyle, display: 'flex', flexDirection: 'column', gap: gapPx }}>
      {rows.map((colCount, rowIdx) => (
        <div key={rowIdx} style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${colCount}, 1fr)`,
          gap: gapPx,
        }}>
          {Array.from({ length: colCount }, () => ++cellIdx).map((n) => (
            <GridCell key={n} n={n} radius={radius} cellStyle={getCellStyle(n - 1)} />
          ))}
        </div>
      ))}
    </div>
  );
}

function ListItemText({ item, showTitle = true, showSubtitle = true, showMetadata = true }: { item: { title: string; subtitle?: string; metadata?: string }; showTitle?: boolean; showSubtitle?: boolean; showMetadata?: boolean }) {
  return (
    <div>
      {showTitle && (
        <div style={{ fontWeight: 500, fontSize: 14, color: '#fff' }}>{item.title}</div>
      )}
      {showSubtitle && item.subtitle && (
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{item.subtitle}</div>
      )}
      {showMetadata && item.metadata && (
        <a href="#" onClick={(e) => e.preventDefault()} style={{
          display: 'inline-block', marginTop: 4, fontSize: 12, fontWeight: 500,
          color: 'rgba(255,255,255,0.8)', textDecoration: 'none',
        }}>{item.metadata}</a>
      )}
    </div>
  );
}

function ListThumbnail({ size = 60, index = 0, radius = 8 }: { size?: number; index?: number; radius?: number }) {
  const poster = posters[index % posters.length];
  return (
    <div style={{
      width: size, height: size,
      borderRadius: radius, flexShrink: 0, overflow: 'hidden',
      background: 'rgba(255,255,255,0.08)',
    }}>
      <img src={poster.image} alt={poster.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
  );
}

function ListPreview({ settings }: { settings: { layout: string; columns: number; showTitle?: boolean; showSubtitle?: boolean; showMetadata?: boolean; showThumbnail: boolean; showDivider: boolean; thumbnailRadius?: number; itemCount: 'all' | number; items: { title: string; subtitle?: string; metadata?: string; style?: { padding: number; backgroundColor: string; backgroundRadius: [number, number, number, number]; strokeColor?: string; strokeWidth?: number } }[]; itemStyleMode?: 'whole' | 'individual'; itemStyle?: { padding: number; backgroundColor: string; backgroundRadius: [number, number, number, number]; strokeColor?: string; strokeWidth?: number }; padding?: number; backgroundColor?: string; backgroundRadius?: [number, number, number, number]; strokeColor?: string; strokeWidth?: number } }) {
  const limit = settings.itemCount === 'all' ? settings.items.length : settings.itemCount;
  const items = settings.items.slice(0, limit);
  const isStacked = settings.layout === 'schedules';
  const sTitle = settings.showTitle ?? true;
  const sSub = settings.showSubtitle ?? true;
  const sMeta = settings.showMetadata ?? true;
  const bg = settings.backgroundColor ?? 'transparent';
  const dividerColor = 'rgba(255,255,255,0.15)';
  const thumbRadius = settings.thumbnailRadius ?? 8;
  const radii = settings.backgroundRadius ?? [0, 0, 0, 0];
  const styleMode = settings.itemStyleMode ?? 'whole';
  const wholeStyle = settings.itemStyle ?? { padding: 0, backgroundColor: 'transparent', backgroundRadius: [0, 0, 0, 0] as [number, number, number, number], strokeColor: 'transparent', strokeWidth: 0 };
  const noStyle = { padding: 0, backgroundColor: 'transparent', backgroundRadius: [0, 0, 0, 0] as [number, number, number, number], strokeColor: 'transparent', strokeWidth: 0 };

  const getItemStyle = (item: typeof items[0]) => {
    if (styleMode === 'individual') return item.style ?? noStyle;
    return wholeStyle;
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: settings.columns === 1 ? '1fr' : settings.columns === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
      gap: isStacked ? 12 : 16,
      padding: settings.padding ?? 0,
      background: bg,
      borderRadius: `${radii[0]}px ${radii[1]}px ${radii[2]}px ${radii[3]}px`,
      ...strokeStyle(settings.strokeColor, settings.strokeWidth),
    }}>
      {items.map((item, i) => {
        const divider = settings.showDivider;
        const iStyle = getItemStyle(item);
        const ir = iStyle.backgroundRadius;
        const itemWrap: React.CSSProperties = {
          padding: iStyle.padding || undefined,
          background: iStyle.backgroundColor || undefined,
          borderRadius: (ir[0] || ir[1] || ir[2] || ir[3]) ? `${ir[0]}px ${ir[1]}px ${ir[2]}px ${ir[3]}px` : undefined,
          ...strokeStyle(iStyle.strokeColor, iStyle.strokeWidth),
        };

        if (isStacked) {
          return (
            <div key={i} style={{
              ...itemWrap,
              display: 'flex', flexDirection: 'column', gap: 8,
              paddingBottom: iStyle.padding || (divider ? 12 : 0),
              borderBottom: divider ? `1px solid ${dividerColor}` : 'none',
            }}>
              {settings.showThumbnail && (
                <div style={{
                  width: '100%', aspectRatio: '16/9',
                  borderRadius: thumbRadius, overflow: 'hidden',
                  background: 'rgba(255,255,255,0.08)',
                }}>
                  <img src={posters[i % posters.length].image} alt={posters[i % posters.length].title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              )}
              <ListItemText item={item} showTitle={sTitle} showSubtitle={sSub} showMetadata={sMeta} />
            </div>
          );
        }

        const isRightAligned = settings.layout === 'chapters';

        return (
          <div key={i} style={{
            ...itemWrap,
            display: 'flex', gap: 12,
            justifyContent: isRightAligned ? 'space-between' : 'flex-start',
            alignItems: 'flex-start',
            paddingBottom: iStyle.padding || (divider ? 16 : 0),
            borderBottom: divider ? `1px solid ${dividerColor}` : 'none',
          }}>
            {isRightAligned ? (
              <>
                <ListItemText item={item} showTitle={sTitle} showSubtitle={sSub} showMetadata={sMeta} />
                {settings.showThumbnail && <ListThumbnail index={i} radius={thumbRadius} />}
              </>
            ) : (
              <>
                {settings.showThumbnail && <ListThumbnail index={i} radius={thumbRadius} />}
                <ListItemText item={item} showTitle={sTitle} showSubtitle={sSub} showMetadata={sMeta} />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RichTextPreview({ settings, componentId, sectionId }: { settings: RichTextSettings; componentId: string; sectionId: string }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const internalContent = useRef(settings.content);
  const updateComponentSettings = useMessageStore((s) => s.updateComponentSettings);
  const selectedComponentId = useMessageStore((s) => s.selectedComponentId);
  const isSelected = selectedComponentId === componentId;
  const wasSelected = useRef(false);

  useEffect(() => {
    if (!editorRef.current) return;
    if (!isSelected && internalContent.current !== settings.content) {
      editorRef.current.innerHTML = settings.content;
      internalContent.current = settings.content;
    }
  }, [settings.content, isSelected]);

  useEffect(() => {
    if (isSelected && !wasSelected.current && editorRef.current) {
      editorRef.current.focus();
    }
    wasSelected.current = isSelected;
  }, [isSelected]);

  const handleInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    internalContent.current = html;
    if (html !== settings.content) {
      updateComponentSettings(sectionId, componentId, {
        type: 'rich-text',
        settings: { ...settings, content: html },
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'b' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      document.execCommand('bold');
    } else if (e.key === 'i' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      document.execCommand('italic');
    } else if (e.key === 'u' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      document.execCommand('underline');
    }
  };

  return (
    <div
      ref={(el) => {
        (editorRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        if (el && !el.innerHTML) {
          el.innerHTML = settings.content;
        }
      }}
      contentEditable={isSelected}
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      style={{
        minHeight: 40,
        padding: settings.padding,
        fontSize: settings.fontSize,
        lineHeight: settings.lineHeight,
        color: settings.color,
        textAlign: settings.alignment,
        background: settings.backgroundColor || 'transparent',
        borderRadius: settings.backgroundRadius
          ? `${settings.backgroundRadius[0]}px ${settings.backgroundRadius[1]}px ${settings.backgroundRadius[2]}px ${settings.backgroundRadius[3]}px`
          : 0,
        ...strokeStyle(settings.strokeColor, settings.strokeWidth),
        outline: 'none',
        cursor: isSelected ? 'text' : 'pointer',
        wordBreak: 'break-word',
      }}
    />
  );
}

export function ComponentRenderer({ component, sectionId }: ComponentRendererProps) {
  const selectedComponentId = useMessageStore((s) => s.selectedComponentId);
  const selectComponent = useMessageStore((s) => s.selectComponent);

  const isSelected = selectedComponentId === component.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectComponent(component.id, sectionId);
  };

  let content: React.ReactNode = null;
  if (component.settings.type === 'media') {
    content = <MediaPreview settings={component.settings.settings} />;
  } else if (component.settings.type === 'text-block') {
    content = <TextBlockPreview settings={component.settings.settings} />;
  } else if (component.settings.type === 'rich-text') {
    content = <RichTextPreview settings={component.settings.settings} componentId={component.id} sectionId={sectionId} />;
  } else if (component.settings.type === 'cta') {
    content = <CTAPreview settings={component.settings.settings} />;
  } else if (component.settings.type === 'grid') {
    content = <GridPreview settings={component.settings.settings} />;
  } else if (component.settings.type === 'list') {
    content = <ListPreview settings={component.settings.settings} />;
  }

  return (
    <div
      data-component-id={component.id}
      onClick={handleClick}
      style={{
        marginBottom: 16,
        padding: 2,
        borderRadius: 8,
        fontFamily: 'var(--font-family)',
        outline: isSelected ? '2px solid rgba(229,77,77,0.4)' : '2px solid transparent',
        boxShadow: isSelected ? '0 0 0 4px rgba(229,77,77,0.2)' : 'none',
        cursor: 'pointer',
        transition: 'outline var(--transition-fast), box-shadow var(--transition-fast)',
      }}
    >
      {content}
    </div>
  );
}
