import { useMessageStore } from '../../store/messageStore';
import type { ComponentCallout, CalloutIcon } from '../../types/message';
import { entityVariables } from '../../data/variables';
import { Select, Toggle, LinkedField } from '../../ui';

const defaultCallout: ComponentCallout = {
  enabled: false,
  text: 'Final Season Coming Nov 16',
  icon: 'horn',
  position: 'above',
};

const iconOptions: { value: CalloutIcon; label: string }[] = [
  { value: 'horn', label: 'Horn' },
  { value: 'info', label: 'Info' },
  { value: 'star', label: 'Star' },
  { value: 'alert', label: 'Alert' },
];

const positionOptions: { value: ComponentCallout['position']; label: string }[] = [
  { value: 'above', label: 'Above component' },
  { value: 'below', label: 'Below component' },
];

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

export function AttachmentPanel() {
  const message = useMessageStore((s) => s.message);
  const selectedSectionId = useMessageStore((s) => s.selectedSectionId);
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

  if (!component || !sectionId) {
    return (
      <div style={{ padding: 20 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 12 }}>
          Select a component on the canvas to manage its attachments.
        </p>
        <div style={{ marginTop: 20 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: 12, borderRadius: 12,
            border: '1px solid var(--color-border-default)',
            opacity: 0.4,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--color-bg-tertiary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <HornIcon size={18} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-family)' }}>
                Callout
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-family)' }}>
                Announcement banner
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const callout: ComponentCallout = component.callout ?? defaultCallout;
  const sid = sectionId;

  const update = (updates: Partial<ComponentCallout>) => {
    updateComponent(sid, component!.id, {
      callout: { ...callout, ...updates },
    });
  };

  const componentLabels: Record<string, string> = {
    'text-block': 'Text Block',
    'rich-text': 'Rich Text',
    'media': 'Media',
    'cta': 'CTA',
    'grid': 'Grid',
    'list': 'List',
  };
  const compLabel = componentLabels[component.type] || component.type;

  return (
    <div style={{ padding: 20 }}>
      <p style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 16, fontFamily: 'var(--font-family)' }}>
        Attach to: <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{compLabel}</span>
      </p>

      {/* Callout attachment card */}
      <div style={{
        padding: 16,
        borderRadius: 12,
        border: callout.enabled
          ? '1px solid var(--color-brand)'
          : '1px solid var(--color-border-default)',
        background: callout.enabled
          ? 'var(--color-brand-subtle)'
          : 'var(--color-bg-tertiary)',
        transition: 'var(--transition-fast)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: callout.enabled ? 16 : 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: callout.enabled ? 'var(--color-brand)' : 'var(--color-bg-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'var(--transition-fast)',
          }}>
            <HornIcon size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-family)' }}>
              Callout
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-family)' }}>
              Announcement banner
            </div>
          </div>
          <Toggle
            label=""
            checked={callout.enabled}
            onChange={(v) => update({ enabled: v })}
          />
        </div>

        {callout.enabled && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <LinkedField
              label="Text"
              value={callout.text}
              onChange={(v) => update({ text: v })}
              onLink={() => {}}
              variables={entityVariables.filter((v) => v.valueType === 'text')}
              placeholder="Callout text"
            />
            <Select
              label="Icon"
              options={iconOptions}
              value={callout.icon}
              onChange={(v) => update({ icon: v as CalloutIcon })}
            />
            <Select
              label="Position"
              options={positionOptions}
              value={callout.position}
              onChange={(v) => update({ position: v as ComponentCallout['position'] })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
