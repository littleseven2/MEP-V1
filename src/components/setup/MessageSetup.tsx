import React, { useState, useRef, useEffect } from 'react';
import {
  Mail, Bell, Smartphone, ArrowRight, Sparkles, ChevronDown, ChevronRight, ChevronLeft, Calendar, Clock,
  Play, Film, Tv, Music, Gamepad2, Clapperboard,
  Star, Heart, Bookmark, Award, Trophy, Gem,
  Zap, Flame,
  User, Users, Globe, MapPin, Compass, Navigation,
  Download, Share2, ExternalLink, Link as LinkIcon, Eye, Search,
  CheckCircle, Info, AlertCircle, Shield, Lock, Unlock,
} from 'lucide-react';
import { useMessageStore } from '../../store/messageStore';
import type { Message, MessageAttributes, MessageComponent, Channel, ListThumbnailIcon } from '../../types/message';
import {
  consentCategories,
  messagePrograms,
  messageTypes,
} from '../../data/defaults';
import { Button, Input, Select } from '../../ui';

const SETUP_ICON_MAP: Record<ListThumbnailIcon, React.ComponentType<{ size?: number }>> = {
  'play': Play, 'film': Film, 'tv': Tv, 'music': Music, 'gamepad-2': Gamepad2, 'clapperboard': Clapperboard,
  'star': Star, 'heart': Heart, 'bookmark': Bookmark, 'award': Award, 'trophy': Trophy, 'gem': Gem,
  'clock': Clock, 'calendar': Calendar, 'bell': Bell, 'zap': Zap, 'flame': Flame, 'sparkles': Sparkles,
  'user': User, 'users': Users, 'globe': Globe, 'map-pin': MapPin, 'compass': Compass, 'navigation': Navigation,
  'download': Download, 'share-2': Share2, 'external-link': ExternalLink, 'link': LinkIcon, 'eye': Eye, 'search': Search,
  'check-circle': CheckCircle, 'info': Info, 'alert-circle': AlertCircle, 'shield': Shield, 'lock': Lock, 'unlock': Unlock,
};

const channelOptions: { value: Channel; icon: React.ReactNode; label: string }[] = [
  { value: 'email', icon: <Mail size={16} />, label: 'Email' },
  { value: 'push', icon: <Bell size={16} />, label: 'Push' },
  { value: 'in-app', icon: <Smartphone size={16} />, label: 'In-App' },
];

export function MessageSetup() {
  const setView = useMessageStore((s) => s.setView);
  const createMessage = useMessageStore((s) => s.createMessage);
  const updateAttributes = useMessageStore((s) => s.updateAttributes);
  const message = useMessageStore((s) => s.message);
  const goBack = useMessageStore((s) => s.goBack);
  const goForward = useMessageStore((s) => s.goForward);
  const viewHistory = useMessageStore((s) => s.viewHistory);
  const viewFuture = useMessageStore((s) => s.viewFuture);

  const existing = message?.attributes;
  const [channel, setChannel] = useState<Channel>(existing?.channel ?? 'email');
  const [name, setName] = useState(existing?.name ?? '');
  const [cadence, setCadence] = useState(existing?.cadence ?? 'temporal');
  const [consentCategory, setConsentCategory] = useState(existing?.consentCategory ?? '');
  const [messageProgram, setMessageProgram] = useState(existing?.messageProgram ?? '');
  const [messageType, setMessageType] = useState(existing?.messageType ?? '');
  const [sendDate, setSendDate] = useState(existing?.sendDate ?? '');
  const [sendTime, setSendTime] = useState(existing?.sendTime ?? '');
  const [endDate, setEndDate] = useState(existing?.endDate ?? '');
  const [campaign, setCampaign] = useState(existing?.campaign ?? '');
  const [eligibility, setEligibility] = useState(existing?.eligibility ?? '');

  const handleSubmit = () => {
    const attrs: MessageAttributes = {
      name,
      channel,
      cadence: cadence as MessageAttributes['cadence'],
      consentCategory,
      messageProgram,
      messageType,
      sendDate,
      sendTime: sendTime || undefined,
      endDate: endDate || undefined,
      campaign: campaign || undefined,
      eligibility: eligibility || undefined,
    };
    if (message) {
      updateAttributes(attrs);
      setView('builder');
    } else {
      createMessage(attrs);
    }
  };

  const setupProgress = [name].filter(Boolean).length;
  const configProgress = [consentCategory, messageProgram, messageType].filter(Boolean).length;
  const scheduleProgress = [sendDate, sendTime, endDate].filter(Boolean).length;
  const targetProgress = [campaign, eligibility].filter(Boolean).length;

  return (
    <div style={{
      height: '100vh',
      display: 'grid',
      gridTemplateRows: 'auto 1fr',
      padding: 12,
      gap: 12,
      background: 'var(--color-bg-primary)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        padding: '12px 20px',
        gap: 16,
        boxShadow: 'var(--shadow-md)',
      }}>
        <img
          src="/n-symbol.png"
          alt="N"
          style={{ width: 20, height: 36, objectFit: 'contain', display: 'block' }}
        />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-xl)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          Message Setup
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 4 }}>
          <SetupNavButton icon={<ChevronLeft size={16} />} tooltip="Back" onClick={goBack} disabled={viewHistory.length === 0} />
          <SetupNavButton icon={<ChevronRight size={16} />} tooltip="Forward" onClick={goForward} disabled={viewFuture.length === 0} />
        </div>
        <div style={{ flex: 1 }} />
        <Button size="sm" onClick={handleSubmit}>
          {message ? 'Back to Builder' : 'Continue to Builder'}
          <ArrowRight size={16} style={{ marginLeft: 6 }} />
        </Button>
      </div>

      {/* Main two-column layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        overflow: 'hidden',
      }}>
        {/* Left: Settings */}
        <div style={{
          overflow: 'auto',
          scrollbarWidth: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          <SetupSection title="Set up your message" defaultOpen progress={`${setupProgress}/1`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
              <div>
                <label style={sectionLabel}>Channel</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {channelOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setChannel(opt.value)}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        borderRadius: 'var(--radius-md)',
                        border: channel === opt.value ? '1px solid var(--color-brand)' : '1px solid var(--color-border-default)',
                        background: channel === opt.value ? 'var(--color-brand-subtle)' : 'var(--color-bg-tertiary)',
                        color: channel === opt.value ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                        fontFamily: 'var(--font-family)',
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)',
                      }}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <Input label="Message name" fullWidth value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter message name" />
            </div>
          </SetupSection>

          <SetupSection title="Configure message" defaultOpen progress={`${configProgress}/3`}>
            <div style={{ display: 'grid', gridTemplateColumns: 'calc(50% - 36px) calc(50% + 24px)', columnGap: 12, rowGap: 22 }}>
              <Select
                label="Cadence"
                options={[
                  { value: 'temporal', label: 'Temporal' },
                  { value: 'evergreen', label: 'Evergreen' },
                ]}
                value={cadence}
                onChange={(v) => setCadence(v as 'temporal' | 'evergreen')}
              />
              <Select
                label="Consent category"
                options={consentCategories}
                value={consentCategory}
                onChange={setConsentCategory}
              />
              <Select
                label="Message program"
                options={messagePrograms}
                value={messageProgram}
                onChange={setMessageProgram}
              />
              <Select
                label="Message type"
                options={messageTypes}
                value={messageType}
                onChange={setMessageType}
              />
            </div>
          </SetupSection>

          <SetupSection title="Set schedule" progress={`${scheduleProgress}/3`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'calc(50% - 36px) calc(50% + 24px)', columnGap: 12, rowGap: 22 }}>
                <DatePicker label="Send date" value={sendDate} onChange={setSendDate} />
                <TimePicker label="Send time" value={sendTime} onChange={setSendTime} />
              </div>
              <div style={{ width: 'calc(50% - 36px)' }}>
                <DatePicker label="End date" value={endDate} onChange={setEndDate} />
              </div>
            </div>
          </SetupSection>

          <SetupSection title="Define targeting" progress={`${targetProgress}/2`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <Input label="Campaign" fullWidth value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="Campaign name" />
              <div>
                <label style={sectionLabel}>Eligibility SQL</label>
                <textarea
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  placeholder="SELECT ..."
                  style={{
                    width: '100%',
                    minHeight: 100,
                    padding: 12,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-bg-tertiary)',
                    border: '1px solid var(--color-border-default)',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    resize: 'vertical',
                    outline: 'none',
                    transition: 'var(--transition-fast)',
                  }}
                />
              </div>
            </div>
          </SetupSection>
        </div>

        {/* Right: Email Preview */}
        <div style={{
          background: 'var(--color-bg-tertiary)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 16,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-border-default) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}>
          <SetupPreview name={name} channel={channel} message={message} />
        </div>
      </div>
    </div>
  );
}

const SetupNavButton: React.FC<{ icon: React.ReactNode; tooltip: string; onClick: () => void; disabled?: boolean }> = ({ icon, tooltip, onClick, disabled }) => {
  const [h, setH] = React.useState(false);
  return (
    <button
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      style={{
        width: 30, height: 30,
        background: h && !disabled ? 'var(--color-bg-tertiary)' : 'transparent',
        border: '1px solid transparent', borderRadius: 'var(--radius-md)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: disabled ? 'default' : 'pointer',
        color: disabled ? 'var(--color-text-muted)' : h ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
        opacity: disabled ? 0.4 : 1,
        transition: 'all var(--transition-fast)',
      }}
    >{icon}</button>
  );
};

const sectionLabel: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  fontFamily: 'var(--font-display)',
  color: 'var(--color-text-secondary)',
  marginBottom: 6,
};

function SetupSection({ title, children, defaultOpen, progress }: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  progress?: string;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const [hovered, setHovered] = useState(false);

  const parts = progress?.split('/');
  const filled = parts ? parseInt(parts[0]) : 0;
  const total = parts ? parseInt(parts[1]) : 0;
  const pct = total > 0 ? (filled / total) * 100 : 0;

  return (
    <div style={{
      background: 'var(--color-bg-secondary)',
      border: 'none',
      borderRadius: 12,
    }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '20px 20px',
          background: hovered ? 'var(--color-bg-hover)' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'var(--transition-fast)',
        }}
      >
        {open
          ? <ChevronDown size={16} color="var(--color-text-tertiary)" />
          : <ChevronRight size={16} color="var(--color-text-tertiary)" />
        }
        <span style={{
          flex: 1,
          textAlign: 'left',
          fontSize: 14,
          fontWeight: 500,
          fontFamily: 'var(--font-family)',
          color: 'var(--color-text-primary)',
        }}>
          {title}
        </span>
        {progress && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 12,
              color: pct === 100 ? 'var(--color-brand)' : 'var(--color-text-muted)',
              fontFamily: 'var(--font-family)',
              fontWeight: pct === 100 ? 600 : 400,
            }}>
              {progress}
            </span>
            {pct === 100 && (
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--color-brand)',
              }} />
            )}
            {pct > 0 && pct < 100 && (
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--color-brand)',
                opacity: 0.5,
              }} />
            )}
            <div style={{
              width: 60, height: 4, borderRadius: 2,
              background: 'var(--color-bg-tertiary)',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${pct}%`,
                height: '100%',
                borderRadius: 2,
                background: 'var(--color-brand)',
                opacity: pct === 100 ? 1 : 0.6,
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
        )}
      </button>
      {open && (
        <div style={{
          padding: '0 20px 24px 46px',
          borderTop: 'none',
          paddingTop: 4,
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

function MiniPreviewComponent({ component }: { component: MessageComponent }) {
  if (component.settings.type === 'media') {
    return (
      <div style={{
        width: '100%', aspectRatio: '16/9',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>Media</span>
      </div>
    );
  }
  if (component.settings.type === 'text-block') {
    const s = component.settings.settings;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {s.order.map((k) => {
          const item = s[k as keyof typeof s];
          if (typeof item !== 'object' || !item || !('enabled' in item) || !item.enabled) return null;
          if (k === 'eyebrow') return <span key={k} style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--color-brand)' }}>{(item as { text: string }).text}</span>;
          if (k === 'headline') return <div key={k} style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: '#fff' }}>{(item as { text: string }).text}</div>;
          if (k === 'body') return <p key={k} style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, margin: 0 }}>{(item as { text: string }).text}</p>;
          if (k === 'link') return <a key={k} href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 10, color: 'var(--color-brand)' }}>{(item as { text: string }).text}</a>;
          if (k === 'callout' && s.callout) return (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '3px 5px', background: 'rgba(0,0,0,0.5)', borderRadius: 4, width: 'fit-content' }}>
              <span style={{ fontSize: 8, color: '#fff' }}>📣</span>
              <span style={{ fontSize: 8, fontWeight: 500, color: '#fff', whiteSpace: 'nowrap' }}>{s.callout.text}</span>
            </div>
          );
          return null;
        })}
      </div>
    );
  }
  if (component.settings.type === 'cta') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {component.settings.settings.buttons.filter((b) => b.enabled ?? true).map((btn, i) => (
          <button key={i} type="button" style={{
            padding: '6px 12px', background: btn.fillColor,
            border: `1px solid ${btn.borderColor}`, color: btn.textColor,
            borderRadius: 20, fontFamily: 'var(--font-family)', fontSize: 10, fontWeight: 500,
          }}>
            {btn.text}
          </button>
        ))}
      </div>
    );
  }
  if (component.settings.type === 'grid') {
    const s = component.settings.settings;
    const gapPx = Math.round((s.gap ?? 8) * 0.5);
    const fallbackRadius = Math.round((s.cellStyle?.imageRadius ?? s.itemRadius ?? 8) * 0.5);
    const mode = s.splitMode ?? 'row';
    const cellStyle = { aspectRatio: '1', background: 'rgba(255,255,255,0.05)', borderRadius: fallbackRadius, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'rgba(255,255,255,0.3)' } as React.CSSProperties;
    let n = 0;
    if (mode === 'column') {
      const cols = (s.cols ?? [2, 2, 2]).slice(0, 4);
      const maxRows = Math.max(...cols.map((r) => Math.min(r, 3)));
      const colCellStyle = { ...cellStyle, flex: 1, minHeight: 0, aspectRatio: undefined } as React.CSSProperties;
      return (
        <div style={{ display: 'flex', gap: gapPx, alignItems: 'stretch', height: maxRows * 30 + (maxRows - 1) * gapPx }}>
          {cols.map((rowCount, ci) => (
            <div key={ci} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: gapPx }}>
              {Array.from({ length: Math.min(rowCount, 3) }).map(() => { n++; return <div key={n} style={colCellStyle}>{n}</div>; })}
            </div>
          ))}
        </div>
      );
    }
    const rows = (s.rows ?? [3, 3]).slice(0, 3);
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {s.items.slice(0, 3).map((item, i) => (
          <div key={i} style={{
            display: 'flex', gap: 8, alignItems: 'center',
            paddingBottom: s.showDivider && i < Math.min(s.items.length, 3) - 1 ? 6 : 0,
            borderBottom: s.showDivider && i < Math.min(s.items.length, 3) - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
          }}>
            {s.showThumbnail && (() => {
              const tType = s.thumbnailType ?? 'image';
              if (tType === 'icon') {
                const IC = SETUP_ICON_MAP[item.thumbnailIcon ?? s.thumbnailIcon ?? 'play'] ?? Play;
                const circleBg = s.iconCircleBackground;
                const circleCol = s.iconCircleColor ?? '#E50914';
                return (
                  <div style={{ width: 28, height: 28, borderRadius: circleBg ? '50%' : 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: circleBg ? '#fff' : 'rgba(255,255,255,0.5)', background: circleBg ? circleCol : undefined }}>
                    <IC size={14} />
                  </div>
                );
              }
              return <div style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.08)', borderRadius: 4, flexShrink: 0 }} />;
            })()}
            <div>
              {(s.showTitle ?? true) && <div style={{ fontWeight: 500, fontSize: 10, color: '#fff' }}>{item.title}</div>}
              {(s.showSubtitle ?? true) && item.subtitle && <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)' }}>{item.subtitle}</div>}
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (component.settings.type === 'rich-text') {
    return <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>Rich text content</div>;
  }
  return null;
}

function SetupPreview({ name, channel, message }: { name: string; channel: Channel; message: Message | null }) {
  const channelLabel = channel.charAt(0).toUpperCase() + channel.slice(1);
  const hasContent = message?.sections.some((s) => s.type === 'content' && s.components.length > 0);

  if (hasContent && message) {
    return (
      <div style={{
        width: 340,
        background: 'var(--color-bg-secondary)',
        borderRadius: 16,
        border: '1px solid var(--color-border-default)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Email chrome header */}
        <div style={{
          padding: '10px 14px',
          borderBottom: '1px solid var(--color-border-default)',
          background: 'var(--color-bg-tertiary)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840' }} />
          </div>
          <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>Subject: {name || 'Your personalized picks'}</div>
        </div>

        {/* Email content */}
        <div style={{
          flex: 1, overflow: 'auto', scrollbarWidth: 'none',
          background: message.theme.background.value,
        }}>
          {message.sections.map((section) => (
            <div key={section.id} style={{ background: section.background.value }}>
              {section.type === 'header' && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '6px 12px',
                }}>
                  <img src="/n-symbol.png" alt="N" style={{ width: 9, height: 16, objectFit: 'contain', display: 'block' }} />
                </div>
              )}
              {section.type === 'content' && section.components.length > 0 && (
                <div style={{ padding: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {section.components.sort((a, b) => a.order - b.order).map((c) => {
                      const co = c.callout;
                      const showCo = co?.enabled;
                      const md = c.metadata;
                      const showMd = md?.enabled && md.items.length > 0;
                      const lb = c.liveBadge;
                      const showLb = lb?.enabled;
                      return (
                        <div key={c.id}>
                          {showCo && co.position === 'above' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '2px 4px', background: 'rgba(0,0,0,0.5)', borderRadius: 3, width: 'fit-content', marginBottom: 4 }}>
                              <span style={{ fontSize: 7, color: '#fff' }}>📣</span>
                              <span style={{ fontSize: 7, fontWeight: 500, color: '#fff', whiteSpace: 'nowrap' }}>{co.text}</span>
                            </div>
                          )}
                          {showLb && lb.position === 'above' && (
                            <div style={{ display: 'flex', alignItems: 'center', width: 'fit-content', marginBottom: 4 }}>
                              <div style={{ background: '#e50914', padding: '0 4px', borderTopLeftRadius: 2, borderBottomLeftRadius: 2 }}>
                                <span style={{ fontSize: 7, fontWeight: 500, color: '#fff', lineHeight: '12px' }}>{lb.label}</span>
                              </div>
                              <div style={{ background: '#fff', padding: '0 3px', borderTopRightRadius: 2, borderBottomRightRadius: 2 }}>
                                <span style={{ fontSize: 7, fontWeight: 500, color: '#000', lineHeight: '12px' }}>{lb.value}</span>
                              </div>
                            </div>
                          )}
                          {showMd && md.position === 'above' && (
                            <div style={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                              {md.items.map((item, i) => (
                                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                  <span style={{ fontSize: 7, color: '#fff', whiteSpace: 'nowrap' }}>{item}</span>
                                  {i < md.items.length - 1 && <span style={{ width: 2, height: 2, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />}
                                </span>
                              ))}
                            </div>
                          )}
                          <MiniPreviewComponent component={c} />
                          {showMd && md.position === 'below' && (
                            <div style={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap', marginTop: 4 }}>
                              {md.items.map((item, i) => (
                                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                  <span style={{ fontSize: 7, color: '#fff', whiteSpace: 'nowrap' }}>{item}</span>
                                  {i < md.items.length - 1 && <span style={{ width: 2, height: 2, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />}
                                </span>
                              ))}
                            </div>
                          )}
                          {showLb && lb.position === 'below' && (
                            <div style={{ display: 'flex', alignItems: 'center', width: 'fit-content', marginTop: 4 }}>
                              <div style={{ background: '#e50914', padding: '0 4px', borderTopLeftRadius: 2, borderBottomLeftRadius: 2 }}>
                                <span style={{ fontSize: 7, fontWeight: 500, color: '#fff', lineHeight: '12px' }}>{lb.label}</span>
                              </div>
                              <div style={{ background: '#fff', padding: '0 3px', borderTopRightRadius: 2, borderBottomRightRadius: 2 }}>
                                <span style={{ fontSize: 7, fontWeight: 500, color: '#000', lineHeight: '12px' }}>{lb.value}</span>
                              </div>
                            </div>
                          )}
                          {showCo && co.position === 'below' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '2px 4px', background: 'rgba(0,0,0,0.5)', borderRadius: 3, width: 'fit-content', marginTop: 4 }}>
                              <span style={{ fontSize: 7, color: '#fff' }}>📣</span>
                              <span style={{ fontSize: 7, fontWeight: 500, color: '#fff', whiteSpace: 'nowrap' }}>{co.text}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {section.type === 'footer' && (
                <div style={{ padding: '6px 10px', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                  <img src="/n-symbol.png" alt="N" style={{ width: 5, height: 9, objectFit: 'contain', display: 'block', flexShrink: 0, marginTop: 1 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, fontSize: 6, lineHeight: '8px', color: 'rgba(255,255,255,0.3)' }}>
                    <div>
                      <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)' }}>Call 1-866-579-7172</p>
                      <p style={{ margin: 0 }}>100 Winchester Circle, Los Gatos, CA 95032</p>
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      <span style={{ textDecoration: 'underline', color: 'rgba(255,255,255,0.5)' }}>Unsubscribe</span>
                      <span style={{ textDecoration: 'underline', color: 'rgba(255,255,255,0.5)' }}>Terms of Use</span>
                      <span style={{ textDecoration: 'underline', color: 'rgba(255,255,255,0.5)' }}>Privacy</span>
                      <span style={{ textDecoration: 'underline', color: 'rgba(255,255,255,0.5)' }}>Help Center</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: 340,
      background: 'var(--color-bg-secondary)',
      borderRadius: 16,
      border: '1px solid var(--color-border-default)',
      boxShadow: 'var(--shadow-lg)',
      overflow: 'hidden',
    }}>
      <div style={{
        height: 200,
        background: 'linear-gradient(180deg, #1a1a2e 0%, #0d0d0d 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: 'linear-gradient(135deg, var(--color-brand) 0%, #FF6B6B 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {channel === 'email' ? <Mail size={24} color="#fff" /> :
           channel === 'push' ? <Bell size={24} color="#fff" /> :
           <Smartphone size={24} color="#fff" />}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
            {name || 'Your Message'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 4 }}>
            {channelLabel} message
          </div>
        </div>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)', marginBottom: 4 }}>
          {name || 'Untitled Message'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 16 }}>
          {channelLabel} · Draft
        </div>
        <button type="button" style={{
          width: '100%', padding: '10px 16px', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-default)', background: 'transparent',
          color: 'var(--color-text-secondary)', fontFamily: 'var(--font-family)',
          fontSize: 13, fontWeight: 500, cursor: 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          Complete setup to preview
        </button>
      </div>
    </div>
  );
}

/* ── Custom DatePicker ── */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function DatePicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const parsed = value ? new Date(value + 'T00:00:00') : null;
  const [viewYear, setViewYear] = useState(parsed?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.getMonth() ?? today.getMonth());

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selectDay = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    onChange(`${viewYear}-${m}-${d}`);
    setOpen(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const displayValue = parsed
    ? `${MONTHS[parsed.getMonth()]} ${parsed.getDate()}, ${parsed.getFullYear()}`
    : '';

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {label && <label style={sectionLabel}>{label}</label>}
      <button
        type="button"
        className="mep-select"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          height: 36,
          padding: '0 32px 0 12px',
          fontSize: '0.875rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-bg-tertiary)',
          border: hovered ? '1px solid var(--color-border-strong)' : '1px solid var(--color-border-default)',
          fontFamily: 'var(--font-family)',
          color: displayValue ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
          cursor: 'pointer',
          textAlign: 'left',
          position: 'relative',
          outline: 'none',
          transition: 'var(--transition-fast)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Calendar size={14} style={{ flexShrink: 0, opacity: 0.5 }} />
        {displayValue || 'Select date'}
        <ChevronDown size={16} style={{ position: 'absolute', right: 8, top: '50%', transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`, transition: 'transform 150ms ease' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          marginTop: 4, padding: 12,
          background: 'var(--color-bg-tertiary)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          zIndex: 1000,
          minWidth: 260,
        }}>
          {/* Month nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <button type="button" onClick={prevMonth} style={calNavBtn}><ChevronLeft size={16} /></button>
            <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-family)', color: 'var(--color-text-primary)' }}>
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={nextMonth} style={calNavBtn}><ChevronRight size={16} /></button>
          </div>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
            {DAYS.map((d) => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-family)', padding: '4px 0' }}>{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {cells.map((day, i) => {
              if (day === null) return <div key={`e-${i}`} />;
              const isSelected = parsed && parsed.getFullYear() === viewYear && parsed.getMonth() === viewMonth && parsed.getDate() === day;
              const isToday = today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDay(day)}
                  style={{
                    width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontFamily: 'var(--font-family)',
                    borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                    background: isSelected ? 'var(--color-brand)' : 'transparent',
                    color: isSelected ? '#fff' : isToday ? 'var(--color-brand)' : 'var(--color-text-primary)',
                    fontWeight: isToday || isSelected ? 600 : 400,
                    transition: 'background 100ms ease',
                  }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'var(--color-bg-hover)'; }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const calNavBtn: React.CSSProperties = {
  background: 'transparent', border: 'none', cursor: 'pointer',
  color: 'var(--color-text-secondary)', padding: 4, borderRadius: 'var(--radius-sm)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'var(--transition-fast)',
};

/* ── Custom TimePicker ── */

const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

function parse24(val: string): { hour: number; minute: number; period: 'AM' | 'PM' } | null {
  if (!val) return null;
  const [hh, mm] = val.split(':').map(Number);
  const period: 'AM' | 'PM' = hh >= 12 ? 'PM' : 'AM';
  const hour = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh;
  return { hour, minute: mm, period };
}

function to24(hour: number, minute: number, period: 'AM' | 'PM'): string {
  let h = hour;
  if (period === 'AM' && h === 12) h = 0;
  else if (period === 'PM' && h !== 12) h += 12;
  return `${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function TimePicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);

  const parsed = parse24(value);
  const [selHour, setSelHour] = useState(parsed?.hour ?? 12);
  const [selMin, setSelMin] = useState(parsed?.minute ?? 0);
  const [selPeriod, setSelPeriod] = useState<'AM' | 'PM'>(parsed?.period ?? 'AM');

  const commit = (h: number, m: number, p: 'AM' | 'PM') => {
    onChange(to24(h, m, p));
  };

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  useEffect(() => {
    if (open) {
      if (hourRef.current) {
        const idx = hours.indexOf(selHour);
        if (idx >= 0) hourRef.current.scrollTop = idx * 36 - 36;
      }
      if (minRef.current) {
        const idx = minutes.indexOf(selMin);
        if (idx >= 0) minRef.current.scrollTop = idx * 36 - 36;
      }
    }
  }, [open, selHour, selMin]);

  const displayValue = value
    ? `${selHour}:${String(selMin).padStart(2, '0')} ${selPeriod}`
    : '';

  const colStyle: React.CSSProperties = {
    flex: 1, maxHeight: 180, overflowY: 'auto', scrollbarWidth: 'none',
  };

  const itemBase: React.CSSProperties = {
    height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.875rem', fontFamily: 'var(--font-family)',
    cursor: 'pointer', borderRadius: 'var(--radius-sm)',
    transition: 'background 100ms ease', border: 'none', width: '100%',
    padding: 0,
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {label && <label style={sectionLabel}>{label}</label>}
      <button
        type="button"
        className="mep-select"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          height: 36,
          padding: '0 32px 0 12px',
          fontSize: '0.875rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-bg-tertiary)',
          border: hovered ? '1px solid var(--color-border-strong)' : '1px solid var(--color-border-default)',
          fontFamily: 'var(--font-family)',
          color: displayValue ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
          cursor: 'pointer',
          textAlign: 'left',
          position: 'relative',
          outline: 'none',
          transition: 'var(--transition-fast)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Clock size={14} style={{ flexShrink: 0, opacity: 0.5 }} />
        {displayValue || 'Select time'}
        <ChevronDown size={16} style={{ position: 'absolute', right: 8, top: '50%', transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`, transition: 'transform 150ms ease' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          marginTop: 4, padding: 8,
          background: 'var(--color-bg-tertiary)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          zIndex: 1000,
          display: 'flex', gap: 4,
        }}>
          {/* Hours */}
          <div ref={hourRef} style={colStyle}>
            {hours.map((h) => {
              const active = h === selHour;
              return (
                <button
                  key={h} type="button"
                  onClick={() => { setSelHour(h); commit(h, selMin, selPeriod); }}
                  style={{
                    ...itemBase,
                    background: active ? 'var(--color-brand)' : 'transparent',
                    color: active ? '#fff' : 'var(--color-text-primary)',
                    fontWeight: active ? 600 : 400,
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--color-bg-hover)'; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  {h}
                </button>
              );
            })}
          </div>

          {/* Minutes */}
          <div ref={minRef} style={colStyle}>
            {minutes.map((m) => {
              const active = m === selMin;
              return (
                <button
                  key={m} type="button"
                  onClick={() => { setSelMin(m); commit(selHour, m, selPeriod); }}
                  style={{
                    ...itemBase,
                    background: active ? 'var(--color-brand)' : 'transparent',
                    color: active ? '#fff' : 'var(--color-text-primary)',
                    fontWeight: active ? 600 : 400,
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--color-bg-hover)'; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  {String(m).padStart(2, '0')}
                </button>
              );
            })}
          </div>

          {/* AM/PM */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center' }}>
            {(['AM', 'PM'] as const).map((p) => {
              const active = p === selPeriod;
              return (
                <button
                  key={p} type="button"
                  onClick={() => { setSelPeriod(p); commit(selHour, selMin, p); }}
                  style={{
                    ...itemBase,
                    width: 48,
                    background: active ? 'var(--color-brand)' : 'transparent',
                    color: active ? '#fff' : 'var(--color-text-primary)',
                    fontWeight: active ? 600 : 400,
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--color-bg-hover)'; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
