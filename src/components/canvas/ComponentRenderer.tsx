import { useRef, useEffect } from 'react';
import { useMessageStore } from '../../store/messageStore';
import type { MessageComponent, RichTextSettings } from '../../types/message';

interface ComponentRendererProps {
  component: MessageComponent;
  sectionId: string;
}

function MediaPreview({ settings }: { settings: { alignment: string } }) {
  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '16/9',
        background: 'linear-gradient(135deg, var(--color-bg-tertiary) 0%, var(--color-bg-secondary) 100%)',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: settings.alignment === 'center' ? 'center' : settings.alignment === 'left' ? 'flex-start' : 'flex-end',
        padding: 16,
      }}
    >
      <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>Media</span>
    </div>
  );
}

function TextBlockPreview({ settings }: { settings: { eyebrow: { enabled: boolean; text: string }; headline: { enabled: boolean; text: string }; body: { enabled: boolean; text: string }; link: { enabled: boolean; text: string; url: string }; order: ('eyebrow' | 'headline' | 'body' | 'link')[] } }) {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {items?.map((item, i) => (
        <div key={i}>
          {item?.type === 'eyebrow' && (
            <p style={{ fontSize: 14, fontWeight: 500, lineHeight: '22px', color: 'white' }}>
              {item.text}
            </p>
          )}
          {item?.type === 'headline' && (
            <p style={{ fontSize: 28, fontWeight: 700, lineHeight: '36px', color: 'white' }}>
              {item.text}
            </p>
          )}
          {item?.type === 'body' && (
            <p style={{ fontSize: 16, fontWeight: 400, lineHeight: '24px', color: 'rgba(255,255,255,0.7)' }}>
              {item.text}
            </p>
          )}
          {item?.type === 'link' && (
            <a href="#" onClick={(e) => e.preventDefault()} style={{
              fontSize: 16, fontWeight: 400, lineHeight: '24px',
              color: 'rgba(255,255,255,0.7)', textDecoration: 'underline',
            }}>
              {item.text}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

function CTAPreview({ settings }: { settings: { buttons: { text: string; fillColor: string; borderColor: string; textColor: string }[] } }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {settings.buttons.map((btn, i) => (
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

function GridPreview({ settings }: { settings: { layout: string; items: { url?: string }[] } }) {
  const count = settings.items.length || 4;
  const cols = settings.layout.includes('2') ? 2 : settings.layout.includes('3') ? 3 : settings.layout.includes('4') ? 4 : 6;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 8,
      }}
    >
      {Array.from({ length: Math.max(count, 2) }).map((_, i) => (
        <div
          key={i}
          style={{
            aspectRatio: '1',
            background: 'var(--color-bg-tertiary)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            color: 'var(--color-text-muted)',
          }}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}

function ListItemText({ item, hasBackground }: { item: { title: string; subtitle?: string; metadata?: string }; hasBackground?: boolean }) {
  return (
    <div>
      <div style={{ fontWeight: 500, fontSize: 14, color: hasBackground ? 'rgba(255,255,255,1)' : undefined }}>{item.title}</div>
      {item.subtitle && (
        <div style={{ fontSize: 12, color: hasBackground ? 'rgba(255,255,255,0.6)' : 'var(--color-text-secondary)' }}>{item.subtitle}</div>
      )}
      {item.metadata && (
        <a href="#" onClick={(e) => e.preventDefault()} style={{
          display: 'inline-block', marginTop: 4, fontSize: 12, fontWeight: 500,
          color: hasBackground ? 'rgba(255,255,255,0.8)' : 'var(--color-brand)', textDecoration: 'none',
        }}>{item.metadata}</a>
      )}
    </div>
  );
}

function ListThumbnail({ size = 60 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size,
      background: 'var(--color-bg-tertiary)', borderRadius: 8, flexShrink: 0,
    }} />
  );
}

function ListPreview({ settings }: { settings: { layout: string; columns: number; showThumbnail: boolean; showDivider: boolean; itemCount: 'all' | number; items: { title: string; subtitle?: string; metadata?: string }[]; padding?: number; backgroundColor?: string; backgroundRadius?: [number, number, number, number] } }) {
  const limit = settings.itemCount === 'all' ? settings.items.length : settings.itemCount;
  const items = settings.items.slice(0, limit);
  const isStacked = settings.layout === 'schedules';
  const bg = settings.backgroundColor ?? 'transparent';
  const hasBg = bg !== 'transparent' && bg !== '';
  const dividerColor = hasBg ? 'rgba(255,255,255,0.15)' : 'var(--color-border-default)';
  const radii = settings.backgroundRadius ?? [0, 0, 0, 0];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: settings.columns === 1 ? '1fr' : settings.columns === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
      gap: isStacked ? 12 : 16,
      padding: settings.padding ?? 0,
      background: bg,
      borderRadius: `${radii[0]}px ${radii[1]}px ${radii[2]}px ${radii[3]}px`,
    }}>
      {items.map((item, i) => {
        const divider = settings.showDivider;

        if (isStacked) {
          return (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', gap: 8,
              paddingBottom: divider ? 12 : 0,
              borderBottom: divider ? `1px solid ${dividerColor}` : 'none',
            }}>
              {settings.showThumbnail && (
                <div style={{
                  width: '100%', aspectRatio: '16/9',
                  background: 'var(--color-bg-tertiary)', borderRadius: 8,
                }} />
              )}
              <ListItemText item={item} hasBackground={hasBg} />
            </div>
          );
        }

        const isRightAligned = settings.layout === 'chapters';

        return (
          <div key={i} style={{
            display: 'flex', gap: 12,
            justifyContent: isRightAligned ? 'space-between' : 'flex-start',
            alignItems: 'flex-start',
            paddingBottom: divider ? 16 : 0,
            borderBottom: divider ? `1px solid ${dividerColor}` : 'none',
          }}>
            {isRightAligned ? (
              <>
                <ListItemText item={item} hasBackground={hasBg} />
                {settings.showThumbnail && <ListThumbnail />}
              </>
            ) : (
              <>
                {settings.showThumbnail && <ListThumbnail />}
                <ListItemText item={item} hasBackground={hasBg} />
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
