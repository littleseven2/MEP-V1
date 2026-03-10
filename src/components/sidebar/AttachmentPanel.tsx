import { useMessageStore } from '../../store/messageStore';
import type { ComponentCallout } from '../../types/message';

const defaultCallout: ComponentCallout = {
  enabled: false,
  text: 'Final Season Coming Nov 16',
  icon: 'horn',
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

const attachmentItems: { id: string; icon: React.ReactNode; label: string; description: string }[] = [
  { id: 'callout', icon: <HornIcon size={18} />, label: 'Callout', description: 'Announcement banner' },
];

export function AttachmentPanel() {
  const message = useMessageStore((s) => s.message);
  const selectedComponentId = useMessageStore((s) => s.selectedComponentId);
  const updateComponent = useMessageStore((s) => s.updateComponent);

  let sectionId: string | null = null;
  let component = null;
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

  const hasComponent = !!component && !!sectionId;
  const callout: ComponentCallout = component?.callout ?? defaultCallout;

  const handleClick = (itemId: string) => {
    if (!hasComponent || !sectionId || !component) return;
    if (itemId === 'callout') {
      updateComponent(sectionId, component.id, {
        callout: { ...callout, enabled: !callout.enabled },
      });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {!hasComponent && (
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 12 }}>
          Select a component on the canvas to add attachments.
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {attachmentItems.map((item) => {
          const isActive = item.id === 'callout' && callout.enabled;

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
                cursor: !hasComponent ? 'not-allowed' : 'pointer',
                opacity: !hasComponent ? 0.25 : 1,
                transition: 'var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                if (!hasComponent) return;
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
      </div>
    </div>
  );
}
