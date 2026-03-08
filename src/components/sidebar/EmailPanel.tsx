import { useMessageStore } from '../../store/messageStore';
import { Input, Select } from '../../ui';

function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      padding: '16px 0',
      borderBottom: '1px solid var(--color-border-default)',
    }}>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 11, fontWeight: 600,
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

export function EmailPanel() {
  const message = useMessageStore((s) => s.message);
  const updateAttributes = useMessageStore((s) => s.updateAttributes);

  if (!message) return null;

  const attrs = message.attributes;

  return (
    <div style={{ padding: 20 }}>
      <PanelSection title="Message">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input
            label="Name"
            value={attrs.name}
            onChange={(e) => updateAttributes({ name: e.target.value })}
            placeholder="Message name"
          />
          <Select
            label="Channel"
            options={[
              { value: 'email', label: 'Email' },
              { value: 'push', label: 'Push Notification' },
              { value: 'in-app', label: 'In-App' },
            ]}
            value={attrs.channel}
            onChange={(v) => updateAttributes({ channel: v as 'email' | 'push' | 'in-app' })}
          />
          <Select
            label="Cadence"
            options={[
              { value: 'temporal', label: 'Temporal' },
              { value: 'evergreen', label: 'Evergreen' },
            ]}
            value={attrs.cadence}
            onChange={(v) => updateAttributes({ cadence: v as 'temporal' | 'evergreen' })}
          />
        </div>
      </PanelSection>
      <PanelSection title="Schedule">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input
            label="Send date"
            value={attrs.sendDate}
            onChange={(e) => updateAttributes({ sendDate: e.target.value })}
            placeholder="YYYY-MM-DD"
          />
          <Input
            label="Send time"
            value={attrs.sendTime || ''}
            onChange={(e) => updateAttributes({ sendTime: e.target.value })}
            placeholder="HH:MM"
          />
        </div>
      </PanelSection>
      <PanelSection title="Targeting">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input
            label="Consent category"
            value={attrs.consentCategory}
            onChange={(e) => updateAttributes({ consentCategory: e.target.value })}
            placeholder="e.g. marketing"
          />
          <Input
            label="Message program"
            value={attrs.messageProgram}
            onChange={(e) => updateAttributes({ messageProgram: e.target.value })}
            placeholder="Program name"
          />
          <Input
            label="Message type"
            value={attrs.messageType}
            onChange={(e) => updateAttributes({ messageType: e.target.value })}
            placeholder="Type"
          />
          <Input
            label="Campaign"
            value={attrs.campaign || ''}
            onChange={(e) => updateAttributes({ campaign: e.target.value })}
            placeholder="Campaign ID"
          />
        </div>
      </PanelSection>
    </div>
  );
}
