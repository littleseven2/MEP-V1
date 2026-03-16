import React, { useState } from 'react';
import {
  Monitor, Smartphone, ArrowLeft, Sparkles, Info, Star, AlertTriangle,
  Play, Film, Tv, Music, Gamepad2, Clapperboard,
  Heart, Bookmark, Award, Trophy, Gem,
  Clock, Calendar, Bell, Zap, Flame,
  User, Users, Globe, MapPin, Compass, Navigation,
  Download, Share2, ExternalLink, Link as LinkIcon, Eye, Search,
  CheckCircle, AlertCircle, Shield, Lock, Unlock,
} from 'lucide-react';
import { useMessageStore } from '../../store/messageStore';
import type { Section, MessageComponent, CalloutIcon, ComponentCallout, ComponentMetadata, ComponentLiveBadge, ComponentCountdown, TextStyle, TextStyleKey, ThemeConfig, AttachmentKey, CalloutVariant, ListThumbnailIcon } from '../../types/message';
import { paddingToCss, addPadding, parsePadding } from '../../types/message';

const DEFAULT_ATTACHMENT_ORDER: AttachmentKey[] = ['callout', 'metadata', 'liveBadge', 'countdown'];
import { defaultTextStyles } from '../../data/defaults';

const PREVIEW_ICON_MAP: Record<ListThumbnailIcon, React.ComponentType<{ size?: number }>> = {
  'play': Play, 'film': Film, 'tv': Tv, 'music': Music, 'gamepad-2': Gamepad2, 'clapperboard': Clapperboard,
  'star': Star, 'heart': Heart, 'bookmark': Bookmark, 'award': Award, 'trophy': Trophy, 'gem': Gem,
  'clock': Clock, 'calendar': Calendar, 'bell': Bell, 'zap': Zap, 'flame': Flame, 'sparkles': Sparkles,
  'user': User, 'users': Users, 'globe': Globe, 'map-pin': MapPin, 'compass': Compass, 'navigation': Navigation,
  'download': Download, 'share-2': Share2, 'external-link': ExternalLink, 'link': LinkIcon, 'eye': Eye, 'search': Search,
  'check-circle': CheckCircle, 'info': Info, 'alert-circle': AlertCircle, 'shield': Shield, 'lock': Lock, 'unlock': Unlock,
};

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

function PreviewLaurelWreath({ size = 14 }: { size?: number }) {
  return <img src="/laurel-wreath.svg" width={size} height={size} alt="" style={{ display: 'block' }} />;
}

function PreviewCalloutBadge({ callout }: { callout: ComponentCallout }) {
  const variant = callout.variant ?? 'A';
  const scale = 0.75;

  if (variant === 'A') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: 6, background: 'rgba(0,0,0,0.5)', borderRadius: 6, width: 'fit-content' }}>
        <PreviewLaurelWreath size={14} />
        <span style={{ fontSize: 11, fontWeight: 500, color: '#fff', whiteSpace: 'nowrap' }}>{callout.text}</span>
      </div>
    );
  }
  if (variant === 'B') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: 6, background: 'rgba(0,0,0,0.5)', borderRadius: 6, width: Math.round(169 * scale), margin: '0 auto' }}>
        <PreviewLaurelWreath size={14} />
        <span style={{ fontSize: 11, fontWeight: 500, color: '#fff', whiteSpace: 'nowrap', textAlign: 'center' }}>{callout.text}</span>
      </div>
    );
  }
  if (variant === 'C') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: 6, background: 'rgba(0,0,0,0.5)', borderRadius: 6, width: Math.round(169 * scale), margin: '0 auto' }}>
        <PreviewLaurelWreath size={36} />
        <span style={{ fontSize: 11, fontWeight: 500, color: '#fff', whiteSpace: 'nowrap', textAlign: 'center' }}>{callout.text}</span>
      </div>
    );
  }
  // D
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '0 6px', borderRadius: 6, width: Math.round(169 * scale), margin: '0 auto' }}>
      <PreviewLaurelWreath size={42} />
      <span style={{ fontSize: 15, fontWeight: 500, lineHeight: '17px', color: '#fff', textAlign: 'center', width: Math.round(169 * scale) }}>{callout.text}</span>
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
    const isStacked = s.layout === 'schedules';
    const align = s.textAlign ?? 'left';
    const alignItems = isStacked ? (align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start') : 'center';
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: s.columns === 1 ? '1fr' : s.columns === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
        gap: 12,
      }}>
        {s.items.slice(0, 5).map((item, i) => (
          <div key={i} style={{
            display: 'flex', gap: 12,
            flexDirection: isStacked ? 'column' : 'row',
            alignItems,
            paddingBottom: s.showDivider ? 12 : 0,
            borderBottom: s.showDivider && i < s.items.length - 1 ? '1px solid var(--color-border-default)' : 'none',
          }}>
            {s.showThumbnail && (() => {
              const tType = s.thumbnailType ?? 'image';
              if (tType === 'icon') {
                const IC = PREVIEW_ICON_MAP[item.thumbnailIcon ?? s.thumbnailIcon ?? 'play'] ?? Play;
                const circleBg = s.iconCircleBackground;
                const circleCol = s.iconCircleColor ?? '#E50914';
                return (
                  <div style={{ width: isStacked ? '100%' : 48, height: isStacked ? undefined : 48, aspectRatio: isStacked ? '16/9' : undefined, borderRadius: circleBg ? '50%' : 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: circleBg ? '#fff' : 'var(--color-text-secondary)', background: circleBg ? circleCol : undefined }}>
                    <IC size={20} />
                  </div>
                );
              }
              return <div style={{ width: isStacked ? '100%' : 48, height: isStacked ? undefined : 48, aspectRatio: isStacked ? '16/9' : undefined, background: 'var(--color-bg-tertiary)', borderRadius: 8, flexShrink: 0 }} />;
            })()}
            <div style={{ textAlign: isStacked ? align : undefined }}>
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

function PreviewCountdownCell({ value, label, compact }: { value: string; label: string; compact?: boolean }) {
  if (compact) {
    return (
      <div style={{
        flex: 1,
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 10,
        padding: '8px 4px',
        display: 'flex',
        gap: 3,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 0,
        whiteSpace: 'nowrap',
      }}>
        <span style={{
          fontFamily: 'var(--font-family)',
          fontSize: 11,
          fontWeight: 500,
          lineHeight: 1,
          color: '#fff',
          letterSpacing: '-0.22px',
          textTransform: 'uppercase',
        }}>
          {value}
        </span>
        <span style={{
          fontFamily: 'var(--font-family)',
          fontSize: 11,
          fontWeight: 400,
          lineHeight: 1,
          color: 'rgba(255,255,255,0.7)',
        }}>
          {label}
        </span>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      background: 'rgba(255,255,255,0.02)',
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

function PreviewCountdownSeparator({ compact }: { compact?: boolean }) {
  const size = compact ? 3 : 4;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 3 : 4, alignItems: 'center' }}>
      <span style={{ width: size, height: size, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
      <span style={{ width: size, height: size, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
    </div>
  );
}

function PreviewCountdown({ countdown }: { countdown: ComponentCountdown }) {
  const variant = countdown.variant || 'A';
  const containerBase: React.CSSProperties = {
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  };

  if (variant === 'A') {
    return (
      <div style={{ ...containerBase, gap: 6 }}>
        <PreviewCountdownCell value={countdown.days} label="Days" />
        <PreviewCountdownSeparator />
        <PreviewCountdownCell value={countdown.hours} label="Hours" />
        <PreviewCountdownSeparator />
        <PreviewCountdownCell value={countdown.minutes} label="Minutes" />
      </div>
    );
  }

  if (variant === 'B') {
    return (
      <div style={{ ...containerBase, gap: 6 }}>
        <PreviewCountdownCell value={countdown.days} label="Days" />
        <PreviewCountdownSeparator />
        <PreviewCountdownCell value={countdown.hours} label="Hours" />
      </div>
    );
  }

  if (variant === 'C') {
    return (
      <div style={{ ...containerBase, gap: 6 }}>
        <div style={{
          flex: 1,
          background: 'rgba(255,255,255,0.02)',
          borderRadius: 12,
          height: 50,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          paddingLeft: 12,
          minWidth: 0,
        }}>
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 40, fontWeight: 500, lineHeight: 1, color: '#fff', letterSpacing: '-0.8px', textTransform: 'uppercase' }}>
            {countdown.days}
          </span>
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>
            Days
          </span>
          <div style={{ position: 'absolute', right: 4, top: 4, width: 70, height: 42, borderRadius: 8, background: '#232323', backgroundImage: countdown.imageUrl ? `url(${countdown.imageUrl})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        </div>
      </div>
    );
  }

  if (variant === 'D') {
    return (
      <div style={{ ...containerBase, gap: 6 }}>
        <div style={{ width: 100, height: 64, borderRadius: 12, flexShrink: 0, background: '#232323', backgroundImage: countdown.imageUrl ? `url(${countdown.imageUrl})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <PreviewCountdownCell value={countdown.minutes} label="Minutes" />
      </div>
    );
  }

  if (variant === 'E') {
    return (
      <div style={{ ...containerBase }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: '12px 6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 20, fontWeight: 700, lineHeight: '28px', color: '#fff', textAlign: 'center', whiteSpace: 'nowrap' }}>
            {countdown.message || 'Starts in 3 days'}
          </span>
        </div>
      </div>
    );
  }

  // Variant F: Compact
  return (
    <div style={{ ...containerBase, gap: 4 }}>
      <PreviewCountdownCell value={countdown.days} label="Days" compact />
      <PreviewCountdownSeparator compact />
      <PreviewCountdownCell value={countdown.hours} label="Hours" compact />
      <PreviewCountdownSeparator compact />
      <PreviewCountdownCell value={countdown.minutes} label="Minutes" compact />
    </div>
  );
}

function renderPreviewAttachment(section: Section, key: AttachmentKey, position: 'above' | 'below') {
  const spacing = position === 'above' ? { marginBottom: 8 } : { marginTop: 8 };
  if (key === 'callout' && section.callout?.enabled && section.callout.position === position)
    return <div key={`s-${key}-${position}`} style={spacing}><PreviewCalloutBadge callout={section.callout} /></div>;
  if (key === 'metadata' && section.metadata?.enabled && section.metadata.items.length > 0 && section.metadata.position === position)
    return <div key={`s-${key}-${position}`} style={spacing}><PreviewMetadataRow metadata={section.metadata} /></div>;
  if (key === 'liveBadge' && section.liveBadge?.enabled && section.liveBadge.position === position)
    return <div key={`s-${key}-${position}`} style={spacing}><PreviewLiveBadge liveBadge={section.liveBadge} /></div>;
  if (key === 'countdown' && section.countdown?.enabled && section.countdown.position === position)
    return <div key={`s-${key}-${position}`} style={spacing}><PreviewCountdown countdown={section.countdown} /></div>;
  return null;
}

function renderPreviewCompAttachment(c: MessageComponent, key: AttachmentKey, position: 'above' | 'below') {
  const spacing = position === 'above' ? { marginBottom: 8 } : { marginTop: 8 };
  if (key === 'callout' && c.callout?.enabled && c.callout.position === position)
    return <div key={`c-${key}-${position}`} style={spacing}><PreviewCalloutBadge callout={c.callout} /></div>;
  if (key === 'metadata' && c.metadata?.enabled && c.metadata.items.length > 0 && c.metadata.position === position)
    return <div key={`c-${key}-${position}`} style={spacing}><PreviewMetadataRow metadata={c.metadata} /></div>;
  if (key === 'liveBadge' && c.liveBadge?.enabled && c.liveBadge.position === position)
    return <div key={`c-${key}-${position}`} style={spacing}><PreviewLiveBadge liveBadge={c.liveBadge} /></div>;
  if (key === 'countdown' && c.countdown?.enabled && c.countdown.position === position)
    return <div key={`c-${key}-${position}`} style={spacing}><PreviewCountdown countdown={c.countdown} /></div>;
  return null;
}

function PreviewSection({ section, ts, theme }: { section: Section; ts: Record<TextStyleKey, TextStyle>; theme: ThemeConfig }) {
  const sectionPadding = addPadding(section.padding, theme.sectionPadding);
  const componentPadding = theme.componentPadding;
  return (
    <div style={{ background: section.background.value }}>
      {section.type === 'header' && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '14px 16px',
        }}>
          <img src="/n-symbol.png" alt="N" style={{ width: 24, height: 44, objectFit: 'contain', display: 'block' }} />
        </div>
      )}
      {section.type === 'content' && (
        <div style={{ padding: paddingToCss(sectionPadding) }}>
          {(section.attachmentOrder ?? DEFAULT_ATTACHMENT_ORDER).map((key) =>
            renderPreviewAttachment(section, key, 'above'),
          )}
          {section.components.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: 13 }}>
              Empty section
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {section.components.sort((a, b) => a.order - b.order).map((c) => {
                const compOrder: AttachmentKey[] = c.attachmentOrder ?? DEFAULT_ATTACHMENT_ORDER;
                const totalCompPadding = addPadding(componentPadding, c.settings.settings.padding);
                return (
                  <div key={c.id} style={parsePadding(totalCompPadding).some(v => v > 0) ? { padding: paddingToCss(totalCompPadding) } : undefined}>
                    {compOrder.map((key) => renderPreviewCompAttachment(c, key, 'above'))}
                    <PreviewComponent component={c} ts={ts} />
                    {compOrder.map((key) => renderPreviewCompAttachment(c, key, 'below'))}
                  </div>
                );
              })}
            </div>
          )}
          {(section.attachmentOrder ?? DEFAULT_ATTACHMENT_ORDER).map((key) =>
            renderPreviewAttachment(section, key, 'below'),
          )}
        </div>
      )}
      {section.type === 'footer' && (
        <div style={{ padding: '12px 16px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <img src="/n-symbol.png" alt="N" style={{ width: 14, height: 24, objectFit: 'contain', display: 'block', flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, fontSize: ts.legal.fontSize, lineHeight: `${ts.legal.lineHeight}px` }}>
            <div>
              <p style={{ margin: 0, color: 'var(--color-text-primary, #fff)' }}>Call 1-866-579-7172</p>
              <p style={{ margin: 0, color: 'var(--color-text-tertiary, rgba(255,255,255,0.5))' }}>100 Winchester Circle</p>
              <p style={{ margin: 0, color: 'var(--color-text-tertiary, rgba(255,255,255,0.5))' }}>Los Gatos, California</p>
              <p style={{ margin: 0, color: 'var(--color-text-tertiary, rgba(255,255,255,0.5))' }}>95032, U.S.A.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <a href="#" style={{ color: '#fff', textDecoration: 'underline', fontSize: ts.legal.fontSize, lineHeight: `${ts.legal.lineHeight}px` }}>Unsubscribe</a>
              <a href="#" style={{ color: '#fff', textDecoration: 'underline', fontSize: ts.legal.fontSize, lineHeight: `${ts.legal.lineHeight}px` }}>Terms of Use</a>
              <a href="#" style={{ color: '#fff', textDecoration: 'underline', fontSize: ts.legal.fontSize, lineHeight: `${ts.legal.lineHeight}px` }}>Privacy</a>
              <a href="#" style={{ color: '#fff', textDecoration: 'underline', fontSize: ts.legal.fontSize, lineHeight: `${ts.legal.lineHeight}px` }}>Help Center</a>
            </div>
            <p style={{ margin: 0, color: 'var(--color-text-tertiary, rgba(255,255,255,0.5))', fontSize: ts.legal.fontSize, lineHeight: `${ts.legal.lineHeight}px` }}>
              This message was mailed to you by Netflix as part of your Netflix membership.
            </p>
          </div>
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
            padding: paddingToCss(message.theme.emailPadding),
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
