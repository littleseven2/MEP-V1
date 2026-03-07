import React, { useState } from 'react';
import { Monitor, Smartphone, ArrowLeft, Sparkles } from 'lucide-react';
import { useMessageStore } from '../../store/messageStore';
import type { Section, MessageComponent } from '../../types/message';

interface EmailPreviewProps {
  onClose: () => void;
}

function PreviewComponent({ component }: { component: MessageComponent }) {
  if (component.settings.type === 'media') {
    return (
      <div style={{
        width: '100%', aspectRatio: '16/9',
        background: 'linear-gradient(135deg, var(--color-bg-tertiary) 0%, var(--color-bg-secondary) 100%)',
        borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }}>Media</span>
      </div>
    );
  }
  if (component.settings.type === 'text-block') {
    const s = component.settings.settings;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {s.order.map((k) => {
          const item = s[k as keyof typeof s];
          if (typeof item !== 'object' || !item || !('enabled' in item) || !item.enabled) return null;
          if (k === 'eyebrow') return <span key={k} style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--color-brand)' }}>{(item as { text: string }).text}</span>;
          if (k === 'headline') return <div key={k} style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600 }}>{(item as { text: string }).text}</div>;
          if (k === 'body') return <p key={k} style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{(item as { text: string }).text}</p>;
          if (k === 'link') return <a key={k} href="#" style={{ fontSize: 14, color: 'var(--color-brand)' }}>{(item as { text: string }).text}</a>;
          return null;
        })}
      </div>
    );
  }
  if (component.settings.type === 'cta') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {component.settings.settings.buttons.map((btn, i) => (
          <button key={i} type="button" style={{
            padding: '12px 24px', background: btn.fillColor,
            border: `1px solid ${btn.borderColor}`, color: btn.textColor,
            borderRadius: 8, fontFamily: 'var(--font-family)', fontSize: 14, fontWeight: 500,
          }}>
            {btn.text}
          </button>
        ))}
      </div>
    );
  }
  if (component.settings.type === 'grid') {
    const cols = component.settings.settings.layout.includes('2') ? 2 : component.settings.settings.layout.includes('3') ? 3 : 4;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8 }}>
        {Array.from({ length: Math.max(component.settings.settings.items.length, 4) }).map((_, i) => (
          <div key={i} style={{ aspectRatio: '1', background: 'var(--color-bg-tertiary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--color-text-tertiary)' }}>{i + 1}</div>
        ))}
      </div>
    );
  }
  if (component.settings.type === 'list') {
    const s = component.settings.settings;
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: s.columns === 1 ? '1fr' : s.columns === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
        gap: 12,
      }}>
        {s.items.slice(0, 5).map((item, i) => (
          <div key={i} style={{
            display: 'flex', gap: 12,
            paddingBottom: s.showDivider ? 12 : 0,
            borderBottom: s.showDivider && i < s.items.length - 1 ? '1px solid var(--color-border-default)' : 'none',
          }}>
            {s.showThumbnail && (
              <div style={{ width: 48, height: 48, background: 'var(--color-bg-tertiary)', borderRadius: 8, flexShrink: 0 }} />
            )}
            <div>
              <div style={{ fontWeight: 500, fontSize: 14 }}>{item.title}</div>
              {item.subtitle && <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{item.subtitle}</div>}
              {item.metadata && <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{item.metadata}</div>}
            </div>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function PreviewSection({ section }: { section: Section }) {
  return (
    <div style={{ background: section.background.value }}>
      {section.type === 'header' && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600 }}>Netflix</span>
          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>View in Browser</span>
        </div>
      )}
      {section.type === 'content' && (
        <div style={{ padding: 16 }}>
          {section.components.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: 13 }}>
              Empty section
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {section.components.sort((a, b) => a.order - b.order).map((c) => (
                <PreviewComponent key={c.id} component={c} />
              ))}
            </div>
          )}
        </div>
      )}
      {section.type === 'footer' && (
        <div style={{ padding: '12px 16px', fontSize: 11, color: 'var(--color-text-tertiary)' }}>
          Unsubscribe · Privacy · Help Center
        </div>
      )}
    </div>
  );
}

export function EmailPreview({ onClose }: EmailPreviewProps) {
  const message = useMessageStore((s) => s.message);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  if (!message) return null;

  const outerWidth = device === 'desktop' ? 680 : 400;
  const innerWidth = device === 'desktop' ? 600 : 375;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', flexDirection: 'column', padding: 12,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 20px',
        background: 'var(--color-bg-secondary)',
        borderRadius: 16,
        border: '1px solid var(--color-border-default)',
        boxShadow: 'var(--shadow-md)',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--color-brand) 0%, #FF6B6B 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={16} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Preview
          </span>
        </div>

        <div style={{ display: 'flex', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 4, border: '1px solid var(--color-border-default)' }}>
          <DeviceBtn label="Desktop" icon={<Monitor size={14} />} active={device === 'desktop'} onClick={() => setDevice('desktop')} />
          <DeviceBtn label="Mobile" icon={<Smartphone size={14} />} active={device === 'mobile'} onClick={() => setDevice('mobile')} />
        </div>

        <div style={{ justifySelf: 'end' }}>
          <button onClick={onClose} style={{
            padding: '8px 16px', borderRadius: 'var(--radius-md)',
            background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border-default)',
            color: 'var(--color-text-secondary)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-family)', fontSize: 'var(--font-size-md)', fontWeight: 500,
            transition: 'all var(--transition-fast)',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-bg-hover)'; e.currentTarget.style.color = 'var(--color-text-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-bg-tertiary)'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
          >
            <ArrowLeft size={16} />
            Back to Editor
          </button>
        </div>
      </div>

      {/* Canvas area with dot grid */}
      <div style={{
        flex: 1, overflow: 'auto', borderRadius: 16,
        background: 'var(--color-bg-tertiary)',
        border: '1px solid var(--color-border-default)',
        backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-border-default) 1px, transparent 0)`,
        backgroundSize: '24px 24px',
        display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
        padding: 40,
      }}>
        <div style={{
          width: outerWidth,
          background: 'var(--color-bg-secondary)',
          borderRadius: 16,
          border: '1px solid var(--color-border-default)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          transition: 'width var(--transition-slow)',
        }}>
          {/* Email client chrome */}
          <div style={{
            padding: 16,
            borderBottom: '1px solid var(--color-border-default)',
            background: 'var(--color-bg-tertiary)',
          }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>From: noreply@netflix.com</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Subject: Your personalized picks</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>Preview text goes here...</div>
          </div>

          <div style={{
            width: innerWidth,
            maxWidth: '100%',
            margin: '0 auto',
            background: message.theme.background.value,
            transition: 'width var(--transition-slow)',
          }}>
            {message.sections.map((section) => (
              <PreviewSection key={section.id} section={section} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const DeviceBtn: React.FC<{
  label: string; icon: React.ReactNode; active: boolean; onClick: () => void;
}> = ({ label, icon, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: '6px 12px', borderRadius: 6, fontSize: 13, fontWeight: 500,
    display: 'flex', alignItems: 'center', gap: 6,
    background: active ? 'var(--color-bg-hover)' : 'transparent',
    color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
    border: 'none', cursor: 'pointer', fontFamily: 'var(--font-family)',
    transition: 'all var(--transition-fast)',
  }}>
    {icon}{label}
  </button>
);
