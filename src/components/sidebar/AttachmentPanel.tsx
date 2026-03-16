import { Megaphone, Tags, Radio, Timer } from 'lucide-react';
import { useMessageStore } from '../../store/messageStore';
import type { ComponentCallout, ComponentMetadata, ComponentLiveBadge, ComponentCountdown, AttachmentKey } from '../../types/message';
import { computeSectionItemOrder } from '../../types/message';

const defaultCallout: ComponentCallout = {
  enabled: false,
  text: '2023 Oscar Winner',
  variant: 'A',
  position: 'above',
};

const defaultMetadata: ComponentMetadata = {
  enabled: false,
  items: ['Category', 'Genre', 'Year', 'Episodes', 'Rating'],
  position: 'below',
};

const defaultLiveBadge: ComponentLiveBadge = {
  enabled: false,
  label: 'Live',
  value: '--',
  position: 'above',
};

const defaultCountdown: ComponentCountdown = {
  enabled: false,
  variant: 'A',
  days: '21',
  hours: '3',
  minutes: '47',
  message: 'Starts in 3 days',
  imageUrl: '',
  position: 'above',
};

const componentLabels: Record<string, string> = {
  'text-block': 'Text',
  'media': 'Media',
  'cta': 'CTA',
  'grid': 'Grid',
  'list': 'List',
};

const sectionLabels: Record<string, string> = {
  'header': 'Header',
  'content': 'Content',
  'footer': 'Footer',
};

const attachmentItems: { id: string; icon: React.ReactNode; label: string; description: string }[] = [
  { id: 'callout', icon: <Megaphone size={18} />, label: 'Callout', description: 'Announcement banner' },
  { id: 'metadata', icon: <Tags size={18} />, label: 'Metadata', description: 'Category · Genre · Year' },
  { id: 'liveBadge', icon: <Radio size={18} />, label: 'Live Badge', description: 'Live event indicator' },
  { id: 'countdown', icon: <Timer size={18} />, label: 'Countdown', description: 'Days · Hours · Minutes' },
];

export function AttachmentPanel() {
  const message = useMessageStore((s) => s.message);
  const selectedComponentId = useMessageStore((s) => s.selectedComponentId);
  const selectedSectionId = useMessageStore((s) => s.selectedSectionId);
  const updateComponent = useMessageStore((s) => s.updateComponent);
  const updateSection = useMessageStore((s) => s.updateSection);

  let sectionId: string | null = null;
  let component = null;
  let section = null;
  if (message && selectedComponentId) {
    for (const s of message.sections) {
      const c = s.components.find((c) => c.id === selectedComponentId);
      if (c) {
        component = c;
        sectionId = s.id;
        break;
      }
    }
  }

  if (message && selectedSectionId && !selectedComponentId) {
    section = message.sections.find((s) => s.id === selectedSectionId) ?? null;
  }

  const targetMode: 'component' | 'section' | 'none' = component ? 'component' : section ? 'section' : 'none';
  const hasTarget = targetMode !== 'none';

  const isCta = targetMode === 'component' && component?.type === 'cta';

  const targetLabel =
    targetMode === 'component' ? (componentLabels[component!.type] || component!.type)
    : targetMode === 'section' ? (sectionLabels[section!.type] || 'Section')
    : null;

  const handleClick = (itemId: string) => {
    if (targetMode === 'component' && sectionId && component) {
      if (itemId === 'callout') {
        const current = component.callout ?? defaultCallout;
        updateComponent(sectionId, component.id, {
          callout: { ...current, enabled: !current.enabled },
        });
      } else if (itemId === 'metadata') {
        const current = component.metadata ?? defaultMetadata;
        updateComponent(sectionId, component.id, {
          metadata: { ...current, enabled: !current.enabled },
        });
      } else if (itemId === 'liveBadge') {
        const current = component.liveBadge ?? defaultLiveBadge;
        updateComponent(sectionId, component.id, {
          liveBadge: { ...current, enabled: !current.enabled },
        });
      } else if (itemId === 'countdown') {
        const current = component.countdown ?? defaultCountdown;
        updateComponent(sectionId, component.id, {
          countdown: { ...current, enabled: !current.enabled },
        });
      }
    } else if (targetMode === 'section' && section) {
      const key = itemId as AttachmentKey;
      const currentOrder = computeSectionItemOrder(section);
      const isInOrder = currentOrder.includes(key);

      if (itemId === 'callout') {
        const current = section.callout ?? defaultCallout;
        const enabling = !current.enabled;
        updateSection(section.id, {
          callout: { ...current, enabled: enabling },
          ...(!isInOrder && enabling ? { sectionItemOrder: [...currentOrder, key] } : {}),
          ...(isInOrder && !enabling ? { sectionItemOrder: currentOrder.filter((id) => id !== key) } : {}),
        });
      } else if (itemId === 'metadata') {
        const current = section.metadata ?? defaultMetadata;
        const enabling = !current.enabled;
        updateSection(section.id, {
          metadata: { ...current, enabled: enabling },
          ...(!isInOrder && enabling ? { sectionItemOrder: [...currentOrder, key] } : {}),
          ...(isInOrder && !enabling ? { sectionItemOrder: currentOrder.filter((id) => id !== key) } : {}),
        });
      } else if (itemId === 'liveBadge') {
        const current = section.liveBadge ?? defaultLiveBadge;
        const enabling = !current.enabled;
        updateSection(section.id, {
          liveBadge: { ...current, enabled: enabling },
          ...(!isInOrder && enabling ? { sectionItemOrder: [...currentOrder, key] } : {}),
          ...(isInOrder && !enabling ? { sectionItemOrder: currentOrder.filter((id) => id !== key) } : {}),
        });
      } else if (itemId === 'countdown') {
        const current = section.countdown ?? defaultCountdown;
        const enabling = !current.enabled;
        updateSection(section.id, {
          countdown: { ...current, enabled: enabling },
          ...(!isInOrder && enabling ? { sectionItemOrder: [...currentOrder, key] } : {}),
          ...(isInOrder && !enabling ? { sectionItemOrder: currentOrder.filter((id) => id !== key) } : {}),
        });
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {!hasTarget && (
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 12 }}>
          Select a component or section on the canvas to add attachments.
        </p>
      )}
      {hasTarget && targetLabel && (
        <p style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 12, fontFamily: 'var(--font-family)' }}>
          Attach to: <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{targetLabel}</span>
          <span style={{
            marginLeft: 6,
            fontSize: 10,
            padding: '1px 6px',
            borderRadius: 4,
            background: 'var(--color-bg-tertiary)',
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {targetMode}
          </span>
        </p>
      )}
      {isCta && (
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 12 }}>
          Attachments are not available for CTA components.
        </p>
      )}
      {!isCta && <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {attachmentItems.map((item) => {
          return (
            <div
              key={item.id}
              className="mep-panel-item"
              role="button"
              tabIndex={0}
              data-disabled={!hasTarget || undefined}
              onClick={() => handleClick(item.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleClick(item.id);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                borderRadius: 12,
                border: '1px solid transparent',
                cursor: !hasTarget ? 'not-allowed' : 'pointer',
                opacity: !hasTarget ? 0.25 : 1,
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
                <div style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--color-text-primary)',
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 12,
                  color: 'var(--color-text-secondary)',
                }}>
                  {item.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>}
    </div>
  );
}
