import {
  Layers,
  Image,
  Type,
  MousePointerClick,
  Grid3X3,
  List,
} from 'lucide-react';
import { useMessageStore } from '../../store/messageStore';
import type { ComponentType } from '../../types/message';

const componentItems: { type: ComponentType; icon: React.ReactNode; label: string; description: string }[] = [
  { type: 'media', icon: <Image size={18} />, label: 'Media', description: 'Image or video' },
  { type: 'text-block', icon: <Type size={18} />, label: 'Text Block', description: 'Eyebrow, headline, body' },
  { type: 'cta', icon: <MousePointerClick size={18} />, label: 'CTA', description: 'Buttons and links' },
  { type: 'grid', icon: <Grid3X3 size={18} />, label: 'Grid', description: 'Grid of items' },
  { type: 'list', icon: <List size={18} />, label: 'List', description: 'List with thumbnails' },
];

export function ComponentPalette() {
  const selectedSectionId = useMessageStore((s) => s.selectedSectionId);
  const message = useMessageStore((s) => s.message);
  const addSection = useMessageStore((s) => s.addSection);
  const addComponent = useMessageStore((s) => s.addComponent);

  const section = message?.sections.find((s) => s.id === selectedSectionId);
  const contentSectionSelected = !!section && section.type === 'content';

  return (
    <div style={{ padding: 20 }}>
      {/* Add Section */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12,
          }}
        >
          <Layers size={16} color="var(--color-text-secondary)" />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              textTransform: 'none',
              letterSpacing: 1,
            }}
          >
            Sections
          </span>
        </div>
        <button
          type="button"
          onClick={() => addSection('content')}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '2px dashed var(--color-border-default)',
            borderRadius: 12,
            background: 'transparent',
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-family)',
            fontSize: 14,
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-brand)';
            e.currentTarget.style.background = 'var(--color-brand-subtle)';
            e.currentTarget.style.color = 'var(--color-brand)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border-default)';
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
        >
          Add Section
        </button>
      </div>

      {/* Components */}
      <div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            textTransform: 'none',
            letterSpacing: 1,
            marginBottom: 12,
          }}
        >
          Components
        </div>
        {!contentSectionSelected && selectedSectionId && (
          <p
            style={{
              fontSize: 12,
              color: 'var(--color-text-muted)',
              marginBottom: 12,
            }}
          >
            Select a content section to add components.
          </p>
        )}
        {!selectedSectionId && (
          <p
            style={{
              fontSize: 12,
              color: 'var(--color-text-muted)',
              marginBottom: 12,
            }}
          >
            Select a content section to add components.
          </p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {componentItems.map((item) => (
            <div
              key={item.type}
              role="button"
              tabIndex={0}
              onClick={() => {
                if (contentSectionSelected && selectedSectionId) {
                  addComponent(selectedSectionId, item.type);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && contentSectionSelected && selectedSectionId) {
                  addComponent(selectedSectionId, item.type);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                borderRadius: 12,
                border: '1px solid transparent',
                cursor: !contentSectionSelected ? 'not-allowed' : 'pointer',
                opacity: !contentSectionSelected ? 0.25 : 1,
                transition: 'var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                if (!contentSectionSelected) return;
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.borderColor = 'var(--color-border-default)';
                const iconBox = e.currentTarget.querySelector('[data-icon-box]') as HTMLElement;
                if (iconBox) {
                  iconBox.style.background = 'var(--color-brand)';
                  iconBox.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.borderColor = 'transparent';
                const iconBox = e.currentTarget.querySelector('[data-icon-box]') as HTMLElement;
                if (iconBox) {
                  iconBox.style.background = 'var(--color-bg-tertiary)';
                  iconBox.style.color = 'var(--color-text-secondary)';
                }
              }}
            >
              <div
                data-icon-box
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'var(--color-bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-secondary)',
                  transition: 'var(--transition-fast)',
                }}
              >
                {item.icon}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-family)',
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-family)',
                    fontSize: 12,
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
