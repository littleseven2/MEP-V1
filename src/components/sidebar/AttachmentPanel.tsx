import { useMessageStore } from '../../store/messageStore';
import type { ComponentCallout, ComponentMetadata, ComponentLiveBadge, ComponentCountdown } from '../../types/message';

const defaultCallout: ComponentCallout = {
  enabled: false,
  text: 'Final Season Coming Nov 16',
  icon: 'horn',
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
  days: '21',
  hours: '3',
  minutes: '47',
  position: 'above',
};

function HornIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12.5C5 12.5 3 12 2 10.5C1 9 1.5 7 1.5 7L8 4L10.5 11L5 12.5Z" fill="url(#horn-ap1)" />
      <path d="M8 4L14.5 1.5C15.5 1 16.5 1.5 17 2.5L18.5 7C19 8 18.5 9 17.5 9.5L10.5 11L8 4Z" fill="url(#horn-ap2)" />
      <path d="M5 12.5L4 15C3.7 15.7 4 16.3 4.7 16.5C5.4 16.7 6 16.3 6.3 15.6L7 13.5L5 12.5Z" fill="#8B2F8B" />
      <defs>
        <linearGradient id="horn-ap1" x1="1" y1="10" x2="10" y2="7" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4A1942" />
          <stop offset="1" stopColor="#8B2F6B" />
        </linearGradient>
        <linearGradient id="horn-ap2" x1="8" y1="8" x2="18" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C23074" />
          <stop offset="1" stopColor="#E84393" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const componentLabels: Record<string, string> = {
  'text-block': 'Text Block',
  'rich-text': 'Rich Text',
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

function MetadataIcon({ size = 18 }: { size?: number }) {
  const r = size / 18;
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="3" cy="9" r={1.5 * r} fill="currentColor" opacity="0.5" />
      <circle cx="9" cy="9" r={1.5 * r} fill="currentColor" />
      <circle cx="15" cy="9" r={1.5 * r} fill="currentColor" opacity="0.5" />
      <rect x="5.5" y="8" width="1" height="2" rx="0.5" fill="currentColor" opacity="0.35" />
      <rect x="11.5" y="8" width="1" height="2" rx="0.5" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

function LiveBadgeIcon({ size = 18 }: { size?: number }) {
  const scale = size / 18;
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="5" width={9 * scale} height={8 * scale} rx={2 * scale} fill="#e50914" />
      <rect x={10 * scale} y="5" width={7 * scale} height={8 * scale} rx={2 * scale} fill="currentColor" opacity="0.8" />
      <circle cx={4.5 * scale} cy="9" r={1.2 * scale} fill="white" />
    </svg>
  );
}

function CountdownIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="3" width="16" height="12" rx="3" fill="currentColor" opacity="0.15" />
      <rect x="2" y="4" width="4" height="10" rx="2" fill="currentColor" opacity="0.3" />
      <rect x="7" y="4" width="4" height="10" rx="2" fill="currentColor" opacity="0.3" />
      <rect x="12" y="4" width="4" height="10" rx="2" fill="currentColor" opacity="0.3" />
      <circle cx="6.5" cy="7.5" r="0.75" fill="currentColor" />
      <circle cx="6.5" cy="10.5" r="0.75" fill="currentColor" />
      <circle cx="11.5" cy="7.5" r="0.75" fill="currentColor" />
      <circle cx="11.5" cy="10.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

const attachmentItems: { id: string; icon: React.ReactNode; label: string; description: string }[] = [
  { id: 'callout', icon: <HornIcon size={18} />, label: 'Callout', description: 'Announcement banner' },
  { id: 'metadata', icon: <MetadataIcon size={18} />, label: 'Metadata', description: 'Category · Genre · Year' },
  { id: 'liveBadge', icon: <LiveBadgeIcon size={18} />, label: 'Live Badge', description: 'Live event indicator' },
  { id: 'countdown', icon: <CountdownIcon size={18} />, label: 'Countdown', description: 'Days · Hours · Minutes' },
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

  const callout: ComponentCallout =
    targetMode === 'component' ? (component?.callout ?? defaultCallout)
    : targetMode === 'section' ? (section?.callout ?? defaultCallout)
    : defaultCallout;

  const metadata: ComponentMetadata =
    targetMode === 'component' ? (component?.metadata ?? defaultMetadata)
    : targetMode === 'section' ? (section?.metadata ?? defaultMetadata)
    : defaultMetadata;

  const liveBadge: ComponentLiveBadge =
    targetMode === 'component' ? (component?.liveBadge ?? defaultLiveBadge)
    : targetMode === 'section' ? (section?.liveBadge ?? defaultLiveBadge)
    : defaultLiveBadge;

  const countdown: ComponentCountdown =
    targetMode === 'component' ? (component?.countdown ?? defaultCountdown)
    : targetMode === 'section' ? (section?.countdown ?? defaultCountdown)
    : defaultCountdown;

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
      if (itemId === 'callout') {
        const current = section.callout ?? defaultCallout;
        updateSection(section.id, {
          callout: { ...current, enabled: !current.enabled },
        });
      } else if (itemId === 'metadata') {
        const current = section.metadata ?? defaultMetadata;
        updateSection(section.id, {
          metadata: { ...current, enabled: !current.enabled },
        });
      } else if (itemId === 'liveBadge') {
        const current = section.liveBadge ?? defaultLiveBadge;
        updateSection(section.id, {
          liveBadge: { ...current, enabled: !current.enabled },
        });
      } else if (itemId === 'countdown') {
        const current = section.countdown ?? defaultCountdown;
        updateSection(section.id, {
          countdown: { ...current, enabled: !current.enabled },
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {attachmentItems.map((item) => {
          const isActive = hasTarget && (
            (item.id === 'callout' && callout.enabled) ||
            (item.id === 'metadata' && metadata.enabled) ||
            (item.id === 'liveBadge' && liveBadge.enabled) ||
            (item.id === 'countdown' && countdown.enabled)
          );

          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
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
                border: isActive ? '1px solid var(--color-brand)' : '1px solid transparent',
                background: isActive ? 'var(--color-brand-subtle)' : 'transparent',
                cursor: !hasTarget ? 'not-allowed' : 'pointer',
                opacity: !hasTarget ? 0.25 : 1,
                transition: 'var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                if (!hasTarget) return;
                e.currentTarget.style.transform = 'translateX(4px)';
                if (!isActive) e.currentTarget.style.borderColor = 'var(--color-border-default)';
                const iconBox = e.currentTarget.querySelector('[data-icon-box]') as HTMLElement;
                if (iconBox) {
                  iconBox.style.background = 'var(--color-brand)';
                  iconBox.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                if (!isActive) e.currentTarget.style.borderColor = 'transparent';
                const iconBox = e.currentTarget.querySelector('[data-icon-box]') as HTMLElement;
                if (iconBox) {
                  iconBox.style.background = isActive ? 'var(--color-brand)' : 'var(--color-bg-tertiary)';
                  iconBox.style.color = isActive ? 'white' : 'var(--color-text-secondary)';
                }
              }}
            >
              <div
                data-icon-box
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: isActive ? 'var(--color-brand)' : 'var(--color-bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isActive ? 'white' : 'var(--color-text-secondary)',
                  transition: 'var(--transition-fast)',
                }}
              >
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
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
              {isActive && (
                <div style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: 'var(--color-brand)',
                  fontFamily: 'var(--font-family)',
                  whiteSpace: 'nowrap',
                }}>
                  Added
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
