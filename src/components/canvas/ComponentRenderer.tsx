import { useMessageStore } from '../../store/messageStore';
import type { MessageComponent } from '../../types/message';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items?.map((item, i) => (
        <div key={i}>
          {item?.type === 'eyebrow' && (
            <span style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--color-brand)' }}>
              {item.text}
            </span>
          )}
          {item?.type === 'headline' && (
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600 }}>
              {item.text}
            </div>
          )}
          {item?.type === 'body' && (
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>{item.text}</p>
          )}
          {item?.type === 'link' && (
            <a href="#" style={{ fontSize: 14, color: 'var(--color-brand)' }}>
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
            fontFamily: 'var(--font-family)',
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

function ListPreview({ settings }: { settings: { columns: number; showThumbnail: boolean; showDivider: boolean; itemCount: 'all' | number; items: { title: string; subtitle?: string; metadata?: string }[] } }) {
  const limit = settings.itemCount === 'all' ? settings.items.length : settings.itemCount;
  const items = settings.items.slice(0, limit);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: settings.columns === 1 ? '1fr' : settings.columns === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
        gap: 16,
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: 12,
            paddingBottom: settings.showDivider ? 16 : 0,
            borderBottom: settings.showDivider && i < items.length - 1 ? '1px solid var(--color-border-default)' : 'none',
          }}
        >
          {settings.showThumbnail && (
            <div
              style={{
                width: 60,
                height: 60,
                background: 'var(--color-bg-tertiary)',
                borderRadius: 8,
                flexShrink: 0,
              }}
            />
          )}
          <div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>{item.title}</div>
            {item.subtitle && (
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{item.subtitle}</div>
            )}
            {item.metadata && (
              <a href="#" onClick={(e) => e.preventDefault()} style={{
                display: 'inline-block', marginTop: 4, fontSize: 12, fontWeight: 500,
                color: 'var(--color-brand)', textDecoration: 'none',
              }}>{item.metadata}</a>
            )}
          </div>
        </div>
      ))}
    </div>
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
