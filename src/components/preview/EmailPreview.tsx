import React, { useState } from 'react';
import { Monitor, Smartphone, ArrowLeft, Sparkles, Info, Star, AlertTriangle } from 'lucide-react';
import { useMessageStore } from '../../store/messageStore';
import type { Section, MessageComponent, CalloutIcon, ComponentCallout, ComponentMetadata, ComponentLiveBadge, ComponentCountdown, TextStyle, TextStyleKey, ThemeConfig } from '../../types/message';
import { defaultTextStyles } from '../../data/defaults';

function HornIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12.5C5 12.5 3 12 2 10.5C1 9 1.5 7 1.5 7L8 4L10.5 11L5 12.5Z" fill="url(#horn-prev1)" />
      <path d="M8 4L14.5 1.5C15.5 1 16.5 1.5 17 2.5L18.5 7C19 8 18.5 9 17.5 9.5L10.5 11L8 4Z" fill="url(#horn-prev2)" />
      <path d="M5 12.5L4 15C3.7 15.7 4 16.3 4.7 16.5C5.4 16.7 6 16.3 6.3 15.6L7 13.5L5 12.5Z" fill="#8B2F8B" />
      <defs>
        <linearGradient id="horn-prev1" x1="1" y1="10" x2="10" y2="7" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4A1942" />
          <stop offset="1" stopColor="#8B2F6B" />
        </linearGradient>
        <linearGradient id="horn-prev2" x1="8" y1="8" x2="18" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C23074" />
          <stop offset="1" stopColor="#E84393" />
        </linearGradient>
      </defs>
    </svg>
  );
}

interface EmailPreviewProps {
  onClose: () => void;
}

function PreviewCalloutBadge({ callout }: { callout: ComponentCallout }) {
  const iconMap: Record<CalloutIcon, React.ReactNode> = {
    horn: <HornIcon size={14} />, info: <Info size={14} />, star: <Star size={14} />, alert: <AlertTriangle size={14} />,
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: 6, background: 'rgba(0,0,0,0.5)',
      borderRadius: 6, width: 'fit-content',
    }}>
      <span style={{ color: '#fff', display: 'flex', alignItems: 'center' }}>{iconMap[callout.icon]}</span>
      <span style={{ fontSize: 12, fontWeight: 500, color: '#fff', whiteSpace: 'nowrap' }}>{callout.text}</span>
    </div>
  );
}

function PreviewComponent({ component, ts }: { component: MessageComponent; ts: Record<TextStyleKey, TextStyle> }) {
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
          if (k === 'eyebrow') return <span key={k} style={{ fontSize: ts.label.fontSize, fontWeight: ts.label.fontWeight, lineHeight: `${ts.label.lineHeight}px`, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--color-brand)' }}>{(item as { text: string }).text}</span>;
          if (k === 'headline') return <div key={k} style={{ fontFamily: 'var(--font-display)', fontSize: ts.headline.fontSize, fontWeight: ts.headline.fontWeight, lineHeight: `${ts.headline.lineHeight}px` }}>{(item as { text: string }).text}</div>;
          if (k === 'body') return <p key={k} style={{ fontSize: ts.body.fontSize, fontWeight: ts.body.fontWeight, lineHeight: `${ts.body.lineHeight}px`, color: 'var(--color-text-secondary)' }}>{(item as { text: string }).text}</p>;
          if (k === 'link') return <a key={k} href="#" style={{ fontSize: ts.body.fontSize, fontWeight: ts.body.fontWeight, lineHeight: `${ts.body.lineHeight}px`, color: 'var(--color-brand)' }}>{(item as { text: string }).text}</a>;
          if (k === 'callout' && s.callout) {
            const ci = s.callout;
            const ciIconMap: Record<CalloutIcon, React.ReactNode> = { horn: <HornIcon size={14} />, info: <Info size={14} />, star: <Star size={14} />, alert: <AlertTriangle size={14} /> };
            return (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: 6, background: 'rgba(0,0,0,0.5)', borderRadius: 6, width: 'fit-content' }}>
                <span style={{ color: '#fff', display: 'flex', alignItems: 'center' }}>{ciIconMap[ci.icon]}</span>
                <span style={{ fontSize: ts.legal.fontSize, fontWeight: ts.legal.fontWeight, lineHeight: `${ts.legal.lineHeight}px`, color: '#fff', whiteSpace: 'nowrap' }}>{ci.text}</span>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  }
  if (component.settings.type === 'cta') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {component.settings.settings.buttons.filter((b) => b.enabled ?? true).map((btn, i) => (
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
    const s = component.settings.settings;
    const gapPx = s.gap ?? 8;
    const fallbackRadius = s.cellStyle?.imageRadius ?? s.itemRadius ?? 8;
    const mode = s.splitMode ?? 'row';
    const cellStyle = { aspectRatio: '1', background: 'var(--color-bg-tertiary)', borderRadius: fallbackRadius, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--color-text-tertiary)' } as React.CSSProperties;
    let n = 0;
    if (mode === 'column') {
      const cols = s.cols ?? [2, 2, 2];
      const maxRows = Math.max(...cols);
      const colCellStyle = { ...cellStyle, flex: 1, minHeight: 0, aspectRatio: undefined } as React.CSSProperties;
      return (
        <div style={{ display: 'flex', gap: gapPx, alignItems: 'stretch', height: maxRows * 60 + (maxRows - 1) * gapPx }}>
          {cols.map((rowCount, ci) => (
            <div key={ci} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: gapPx }}>
              {Array.from({ length: rowCount }).map(() => { n++; return <div key={n} style={colCellStyle}>{n}</div>; })}
            </div>
          ))}
        </div>
      );
    }
    const rows = s.rows ?? [3, 3];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: gapPx }}>
        {rows.map((colCount, ri) => (
          <div key={ri} style={{ display: 'grid', gridTemplateColumns: `repeat(${colCount}, 1fr)`, gap: gapPx }}>
            {Array.from({ length: colCount }).map(() => { n++; return <div key={n} style={cellStyle}>{n}</div>; })}
          </div>
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
              {(s.showTitle ?? true) && <div style={{ fontWeight: 500, fontSize: 14 }}>{item.title}</div>}
              {(s.showSubtitle ?? true) && item.subtitle && <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{item.subtitle}</div>}
              {(s.showMetadata ?? true) && item.metadata && <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{item.metadata}</div>}
            </div>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function PreviewMetadataRow({ metadata }: { metadata: ComponentMetadata }) {
  return (
    <div style={{
      display: 'flex',
      gap: 6,
      alignItems: 'center',
      flexWrap: 'wrap',
    }}>
      {metadata.items.map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 14,
            lineHeight: '21px',
            color: '#fff',
            whiteSpace: 'nowrap',
          }}>
            {item}
          </span>
          {i < metadata.items.length - 1 && (
            <span style={{
              width: 3,
              height: 3,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.5)',
              flexShrink: 0,
            }} />
          )}
        </span>
      ))}
    </div>
  );
}

function PreviewLiveBadge({ liveBadge }: { liveBadge: ComponentLiveBadge }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      width: 'fit-content',
    }}>
      <div style={{
        background: '#e50914',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 1,
        paddingLeft: 12,
        paddingRight: 12,
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,
      }}>
        <span style={{
          fontSize: 16,
          fontWeight: 500,
          lineHeight: '24px',
          color: '#fff',
          whiteSpace: 'nowrap',
        }}>
          {liveBadge.label}
        </span>
      </div>
      <div style={{
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 1,
        paddingLeft: 6,
        paddingRight: 6,
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
      }}>
        <span style={{
          fontSize: 16,
          fontWeight: 500,
          lineHeight: '24px',
          color: '#000',
          whiteSpace: 'nowrap',
        }}>
          {liveBadge.value}
        </span>
      </div>
    </div>
  );
}

function PreviewCountdownCell({ value, label }: { value: string; label: string }) {
  return (
    <div style={{
      flex: 1,
      background: 'rgba(255,255,255,0.04)',
      borderRadius: 12,
      paddingTop: 12,
      paddingBottom: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
    }}>
      <span style={{
        fontFamily: 'var(--font-family)',
        fontSize: 40,
        fontWeight: 500,
        lineHeight: 1,
        color: '#fff',
        letterSpacing: '-0.8px',
        textAlign: 'center',
      }}>
        {value}
      </span>
      <span style={{
        fontFamily: 'var(--font-family)',
        fontSize: 11,
        fontWeight: 400,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
      }}>
        {label}
      </span>
    </div>
  );
}

function PreviewCountdown({ countdown }: { countdown: ComponentCountdown }) {
  return (
    <div style={{
      background: 'rgba(0,0,0,0.5)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 16,
      padding: 8,
      display: 'flex',
      gap: 6,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    }}>
      <PreviewCountdownCell value={countdown.days} label="Days" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
        <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
      </div>
      <PreviewCountdownCell value={countdown.hours} label="Hours" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
        <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
      </div>
      <PreviewCountdownCell value={countdown.minutes} label="Minutes" />
    </div>
  );
}

function PreviewSection({ section, ts, theme }: { section: Section; ts: Record<TextStyleKey, TextStyle>; theme: ThemeConfig }) {
  const sectionPadding = 16 + (section.padding ?? 0) + (theme.sectionPadding ?? 0);
  const componentPadding = theme.componentPadding ?? 0;
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
        <div style={{ padding: sectionPadding }}>
          {section.callout?.enabled && section.callout.position === 'above' && (
            <div style={{ marginBottom: 8 }}><PreviewCalloutBadge callout={section.callout} /></div>
          )}
          {section.liveBadge?.enabled && section.liveBadge.position === 'above' && (
            <div style={{ marginBottom: 8 }}><PreviewLiveBadge liveBadge={section.liveBadge} /></div>
          )}
          {section.metadata?.enabled && section.metadata.items.length > 0 && section.metadata.position === 'above' && (
            <div style={{ marginBottom: 8 }}><PreviewMetadataRow metadata={section.metadata} /></div>
          )}
          {section.countdown?.enabled && section.countdown.position === 'above' && (
            <div style={{ marginBottom: 8 }}><PreviewCountdown countdown={section.countdown} /></div>
          )}
          {section.components.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: 13 }}>
              Empty section
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {section.components.sort((a, b) => a.order - b.order).map((c) => {
                const co = c.callout;
                const showCo = co?.enabled;
                const md = c.metadata;
                const showMd = md?.enabled && md.items.length > 0;
                const lb = c.liveBadge;
                const showLb = lb?.enabled;
                const cd = c.countdown;
                const showCd = cd?.enabled;
                return (
                  <div key={c.id} style={componentPadding ? { padding: componentPadding } : undefined}>
                    {showCo && co.position === 'above' && <div style={{ marginBottom: 8 }}><PreviewCalloutBadge callout={co} /></div>}
                    {showLb && lb.position === 'above' && <div style={{ marginBottom: 8 }}><PreviewLiveBadge liveBadge={lb} /></div>}
                    {showMd && md.position === 'above' && <div style={{ marginBottom: 8 }}><PreviewMetadataRow metadata={md} /></div>}
                    {showCd && cd.position === 'above' && <div style={{ marginBottom: 8 }}><PreviewCountdown countdown={cd} /></div>}
                    <PreviewComponent component={c} ts={ts} />
                    {showCd && cd.position === 'below' && <div style={{ marginTop: 8 }}><PreviewCountdown countdown={cd} /></div>}
                    {showMd && md.position === 'below' && <div style={{ marginTop: 8 }}><PreviewMetadataRow metadata={md} /></div>}
                    {showLb && lb.position === 'below' && <div style={{ marginTop: 8 }}><PreviewLiveBadge liveBadge={lb} /></div>}
                    {showCo && co.position === 'below' && <div style={{ marginTop: 8 }}><PreviewCalloutBadge callout={co} /></div>}
                  </div>
                );
              })}
            </div>
          )}
          {section.countdown?.enabled && section.countdown.position === 'below' && (
            <div style={{ marginTop: 8 }}><PreviewCountdown countdown={section.countdown} /></div>
          )}
          {section.metadata?.enabled && section.metadata.items.length > 0 && section.metadata.position === 'below' && (
            <div style={{ marginTop: 8 }}><PreviewMetadataRow metadata={section.metadata} /></div>
          )}
          {section.liveBadge?.enabled && section.liveBadge.position === 'below' && (
            <div style={{ marginTop: 8 }}><PreviewLiveBadge liveBadge={section.liveBadge} /></div>
          )}
          {section.callout?.enabled && section.callout.position === 'below' && (
            <div style={{ marginTop: 8 }}><PreviewCalloutBadge callout={section.callout} /></div>
          )}
        </div>
      )}
      {section.type === 'footer' && (
        <div style={{ padding: '12px 16px', fontSize: ts.legal.fontSize, lineHeight: `${ts.legal.lineHeight}px`, color: 'var(--color-text-tertiary)' }}>
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
  const ts = message.theme.typography.textStyles ?? defaultTextStyles;

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
              <PreviewSection key={section.id} section={section} ts={ts} theme={message.theme} />
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
