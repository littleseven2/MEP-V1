import { useRef, useEffect } from 'react';
import {
  Info, Star, AlertTriangle,
  Play, Film, Tv, Music, Gamepad2, Clapperboard,
  Heart, Bookmark, Award, Trophy, Gem,
  Clock, Calendar, Bell, Zap, Flame, Sparkles,
  User, Users, Globe, MapPin, Compass, Navigation,
  Download, Share2, ExternalLink, Link as LinkIcon, Eye, Search,
  CheckCircle, AlertCircle, Shield, Lock, Unlock,
} from 'lucide-react';
import type { ListThumbnailIcon } from '../../types/message';
import { useMessageStore } from '../../store/messageStore';
import type { MessageComponent, RichTextSettings, CalloutIcon, ComponentCallout, ComponentMetadata, ComponentLiveBadge, ComponentCountdown, TextStyle, MarqueeConfig, AttachmentKey, Padding } from '../../types/message';
import { paddingToCss, parsePadding, uniformPaddingValue } from '../../types/message';
import { posters } from '../../data/posters';
import { defaultTextStyles } from '../../data/defaults';

const DEFAULT_ATTACHMENT_ORDER: AttachmentKey[] = ['callout', 'metadata', 'liveBadge', 'countdown'];

function HornIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12.5C5 12.5 3 12 2 10.5C1 9 1.5 7 1.5 7L8 4L10.5 11L5 12.5Z" fill="url(#horn-grad1)" />
      <path d="M8 4L14.5 1.5C15.5 1 16.5 1.5 17 2.5L18.5 7C19 8 18.5 9 17.5 9.5L10.5 11L8 4Z" fill="url(#horn-grad2)" />
      <path d="M5 12.5L4 15C3.7 15.7 4 16.3 4.7 16.5C5.4 16.7 6 16.3 6.3 15.6L7 13.5L5 12.5Z" fill="#8B2F8B" />
      <defs>
        <linearGradient id="horn-grad1" x1="1" y1="10" x2="10" y2="7" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4A1942" />
          <stop offset="1" stopColor="#8B2F6B" />
        </linearGradient>
        <linearGradient id="horn-grad2" x1="8" y1="8" x2="18" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C23074" />
          <stop offset="1" stopColor="#E84393" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const calloutIcons: Record<CalloutIcon, React.ReactNode> = {
  horn: <HornIcon size={16} />,
  info: <Info size={16} />,
  star: <Star size={16} />,
  alert: <AlertTriangle size={16} />,
};

interface ComponentRendererProps {
  component: MessageComponent;
  sectionId: string;
}

function strokeStyle(color?: string, width?: number): React.CSSProperties {
  const w = width ?? 0;
  const c = color ?? 'transparent';
  if (!w || c === 'transparent') return {};
  return { border: `${w}px solid ${c}` };
}

function MarqueeOverlay({ text, position }: { text: string; position: 'above' | 'below' }) {
  const isAbove = position === 'above';
  return (
    <div style={{
      background: 'rgba(0,0,0,0.4)',
      borderRadius: 24,
      paddingTop: isAbove ? 9 : 35,
      paddingBottom: isAbove ? 35 : 9,
      paddingLeft: 16,
      paddingRight: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <p style={{
        fontFamily: 'var(--font-family)',
        fontSize: 16,
        fontWeight: 500,
        lineHeight: '24px',
        color: '#fff',
        textAlign: 'center',
        margin: 0,
      }}>
        {text}
      </p>
    </div>
  );
}

const MARQUEE_OVERLAP = 24;

function WithMarquee({ marquee, children }: { marquee?: MarqueeConfig; children: React.ReactNode }) {
  if (!marquee?.enabled) return <>{children}</>;
  const pos = marquee.position ?? 'below';
  return (
    <div style={{ position: 'relative' }}>
      {pos === 'above' && (
        <div style={{ marginBottom: -MARQUEE_OVERLAP }}>
          <MarqueeOverlay text={marquee.text} position="above" />
        </div>
      )}
      <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
        {children}
      </div>
      {pos === 'below' && (
        <div style={{ marginTop: -MARQUEE_OVERLAP }}>
          <MarqueeOverlay text={marquee.text} position="below" />
        </div>
      )}
    </div>
  );
}

function MediaPreview({ settings }: { settings: { alignment: string; mediaRadius?: number; padding?: Padding; backgroundColor?: string; backgroundRadius?: [number, number, number, number]; strokeColor?: string; strokeWidth?: number } }) {
  const r = settings.backgroundRadius ?? [0, 0, 0, 0];
  const imgRadius = settings.mediaRadius ?? 8;
  return (
    <div style={{
      background: settings.backgroundColor || 'transparent',
      borderRadius: `${r[0]}px ${r[1]}px ${r[2]}px ${r[3]}px`,
      ...strokeStyle(settings.strokeColor, settings.strokeWidth),
    }}>
      <div
        style={{
          width: '100%',
          aspectRatio: '16/9',
          borderRadius: imgRadius,
          overflow: 'hidden',
          position: 'relative',
          background: 'rgba(255,255,255,0.08)',
        }}
      >
        <img src={posters[0].image} alt={posters[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    </div>
  );
}

function TextBlockPreview({ settings, ts }: { settings: { eyebrow: { enabled: boolean; text: string }; headline: { enabled: boolean; text: string }; body: { enabled: boolean; text: string }; link: { enabled: boolean; text: string; url: string }; callout?: { enabled: boolean; text: string; icon?: CalloutIcon }; order: ('eyebrow' | 'headline' | 'body' | 'link' | 'callout')[]; alignment?: 'left' | 'center' | 'right'; padding?: Padding; backgroundColor?: string; backgroundRadius?: [number, number, number, number]; strokeColor?: string; strokeWidth?: number }; ts: Record<string, TextStyle> }) {
  const items = settings.order
    .filter((k) => {
      const el = settings[k as keyof typeof settings];
      return el && typeof el === 'object' && 'enabled' in el && el.enabled;
    })
    .map((k) => {
      if (k === 'eyebrow') return { type: 'eyebrow' as const, text: settings.eyebrow.text };
      if (k === 'headline') return { type: 'headline' as const, text: settings.headline.text };
      if (k === 'body') return { type: 'body' as const, text: settings.body.text };
      if (k === 'link') return { type: 'link' as const, text: settings.link.text };
      if (k === 'callout' && settings.callout) return { type: 'callout' as const, text: settings.callout.text, icon: settings.callout.icon ?? 'horn' as CalloutIcon };
      return null;
    })
    .filter(Boolean) as { type: string; text: string; icon?: CalloutIcon }[];

  const eyebrowColor = 'rgba(255,255,255,0.9)';
  const headlineColor = '#fff';
  const bodyColor = 'rgba(255,255,255,0.65)';
  const linkColor = 'rgba(255,255,255,0.65)';

  const r = settings.backgroundRadius ?? [0, 0, 0, 0];

  const align = settings.alignment ?? 'left';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 4,
      textAlign: align,
      background: settings.backgroundColor || 'transparent',
      borderRadius: `${r[0]}px ${r[1]}px ${r[2]}px ${r[3]}px`,
      ...strokeStyle(settings.strokeColor, settings.strokeWidth),
    }}>
      {items?.map((item, i) => (
        <div key={i}>
          {item?.type === 'eyebrow' && (
            <p style={{ fontSize: ts.label.fontSize, fontWeight: ts.label.fontWeight, lineHeight: `${ts.label.lineHeight}px`, color: eyebrowColor }}>
              {item.text}
            </p>
          )}
          {item?.type === 'headline' && (
            <p style={{ fontSize: ts.headline.fontSize, fontWeight: ts.headline.fontWeight, lineHeight: `${ts.headline.lineHeight}px`, color: headlineColor }}>
              {item.text}
            </p>
          )}
          {item?.type === 'body' && (
            <p style={{ fontSize: ts.body.fontSize, fontWeight: ts.body.fontWeight, lineHeight: `${ts.body.lineHeight}px`, color: bodyColor }}>
              {item.text}
            </p>
          )}
          {item?.type === 'link' && (
            <a href="#" onClick={(e) => e.preventDefault()} style={{
              fontSize: ts.body.fontSize, fontWeight: ts.body.fontWeight, lineHeight: `${ts.body.lineHeight}px`,
              color: linkColor, textDecoration: 'underline',
            }}>
              {item.text}
            </a>
          )}
          {item?.type === 'callout' && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: 8, background: 'rgba(0,0,0,0.5)',
              borderRadius: 8, overflow: 'hidden',
              width: 'fit-content',
            }}>
              <span style={{ color: '#fff', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {calloutIcons[item.icon ?? 'horn']}
              </span>
              <span style={{ fontSize: ts.label.fontSize, fontWeight: ts.label.fontWeight, lineHeight: `${ts.label.lineHeight}px`, color: '#fff', whiteSpace: 'nowrap' }}>
                {item.text}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CTAPreview({ settings }: { settings: { layout?: string; buttons: { enabled?: boolean; text: string; fillColor: string; borderColor: string; textColor: string }[]; padding?: Padding; backgroundColor?: string; backgroundRadius?: [number, number, number, number]; strokeColor?: string; strokeWidth?: number } }) {
  const r = settings.backgroundRadius ?? [0, 0, 0, 0];
  const visibleButtons = settings.buttons.filter((btn) => btn.enabled ?? true);
  const isSideBySide = settings.layout === '2-side-by-side';
  return (
    <div style={{
      display: 'flex',
      flexDirection: isSideBySide ? 'row' : 'column',
      gap: 8,
      background: settings.backgroundColor || 'transparent',
      borderRadius: `${r[0]}px ${r[1]}px ${r[2]}px ${r[3]}px`,
      ...strokeStyle(settings.strokeColor, settings.strokeWidth),
    }}>
      {visibleButtons.map((btn, i) => (
        <button
          key={i}
          type="button"
          style={{
            flex: isSideBySide ? 1 : undefined,
            padding: '12px 24px',
            background: btn.fillColor,
            border: `1px solid ${btn.borderColor}`,
            color: btn.textColor,
            borderRadius: 24,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {btn.text}
        </button>
      ))}
    </div>
  );
}

function GridCell({ n, radius, cellStyle }: { n: number; radius: number; cellStyle?: { padding: Padding; backgroundColor: string; backgroundRadius: [number, number, number, number]; strokeColor: string; strokeWidth: number; imageRadius?: number } }) {
  const poster = posters[(n - 1) % posters.length];
  const cs = cellStyle;
  const csRadius = cs?.backgroundRadius ?? [0, 0, 0, 0];
  const imgRadius = cs?.imageRadius ?? radius;
  const hasCs = cs && (uniformPaddingValue(cs.padding) > 0 || cs.backgroundColor !== 'transparent' || csRadius.some(v => v > 0) || (cs.strokeColor !== 'transparent' && cs.strokeWidth > 0));
  if (hasCs) {
    return (
      <div style={{
        padding: paddingToCss(cs.padding),
        background: cs.backgroundColor || 'transparent',
        borderRadius: `${csRadius[0]}px ${csRadius[1]}px ${csRadius[2]}px ${csRadius[3]}px`,
        ...strokeStyle(cs.strokeColor, cs.strokeWidth),
      }}>
        <div style={{
          aspectRatio: '2/3',
          borderRadius: imgRadius,
          overflow: 'hidden',
          position: 'relative',
          background: 'rgba(255,255,255,0.08)',
        }}>
          <img src={poster.image} alt={poster.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      </div>
    );
  }
  return (
    <div style={{
      aspectRatio: '2/3',
      borderRadius: imgRadius,
      overflow: 'hidden',
      position: 'relative',
      background: 'rgba(255,255,255,0.08)',
    }}>
      <img src={poster.image} alt={poster.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
  );
}

function GridPreview({ settings }: { settings: { layout: string; items: { url?: string }[]; splitMode?: 'row' | 'column'; rows?: number[]; cols?: number[]; gap?: number; itemRadius?: number; cellStyleMode?: 'whole' | 'individual'; cellStyle?: { padding: Padding; backgroundColor: string; backgroundRadius: [number, number, number, number]; strokeColor: string; strokeWidth: number; imageRadius?: number }; cellStyles?: { padding: Padding; backgroundColor: string; backgroundRadius: [number, number, number, number]; strokeColor: string; strokeWidth: number; imageRadius?: number }[]; padding?: Padding; backgroundColor?: string; backgroundRadius?: [number, number, number, number]; strokeColor?: string; strokeWidth?: number } }) {
  const r = settings.backgroundRadius ?? [0, 0, 0, 0];
  const gapPx = settings.gap ?? 8;
  const radius = settings.itemRadius ?? 8;
  const mode = settings.splitMode ?? 'row';
  const csMode = settings.cellStyleMode ?? 'whole';
  const defaultCs = { padding: 0, backgroundColor: 'transparent', backgroundRadius: [0, 0, 0, 0] as [number, number, number, number], strokeColor: 'transparent', strokeWidth: 0 };
  const wholeCs = settings.cellStyle ?? defaultCs;
  const getCellStyle = (idx: number) => {
    if (csMode === 'individual' && settings.cellStyles && settings.cellStyles[idx]) return settings.cellStyles[idx];
    return wholeCs;
  };

  const containerStyle: React.CSSProperties = {
    background: settings.backgroundColor || 'transparent',
    borderRadius: `${r[0]}px ${r[1]}px ${r[2]}px ${r[3]}px`,
    ...strokeStyle(settings.strokeColor, settings.strokeWidth),
  };

  if (mode === 'column') {
    const cols = settings.cols ?? [2, 2, 2];
    let cellIdx = 0;
    return (
      <div style={{ ...containerStyle, display: 'flex', gap: gapPx, alignItems: 'stretch' }}>
        {cols.map((rowCount, colIdx) => (
          <div key={colIdx} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: gapPx }}>
            {Array.from({ length: rowCount }, () => ++cellIdx).map((n) => {
              const cs = getCellStyle(n - 1);
              const csR = cs.backgroundRadius;
              const imgR = ('imageRadius' in cs ? (cs as { imageRadius?: number }).imageRadius : undefined) ?? radius;
              const hasCs = uniformPaddingValue(cs.padding) > 0 || cs.backgroundColor !== 'transparent' || csR.some(v => v > 0) || (cs.strokeColor !== 'transparent' && cs.strokeWidth > 0);
              const poster = posters[(n - 1) % posters.length];
              return hasCs ? (
                <div key={n} style={{
                  flex: 1, minHeight: 0,
                  padding: paddingToCss(cs.padding),
                  background: cs.backgroundColor || 'transparent',
                  borderRadius: `${csR[0]}px ${csR[1]}px ${csR[2]}px ${csR[3]}px`,
                  ...strokeStyle(cs.strokeColor, cs.strokeWidth),
                  display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ flex: 1, borderRadius: imgR, overflow: 'hidden', background: 'rgba(255,255,255,0.08)', minHeight: 0 }}>
                    <img src={poster.image} alt={poster.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                </div>
              ) : (
                <div key={n} style={{
                  flex: 1,
                  borderRadius: imgR,
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.08)',
                  minHeight: 0,
                }}>
                  <img src={poster.image} alt={poster.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  const rows = settings.rows ?? [3, 3];
  let cellIdx = 0;
  return (
    <div style={{ ...containerStyle, display: 'flex', flexDirection: 'column', gap: gapPx }}>
      {rows.map((colCount, rowIdx) => (
        <div key={rowIdx} style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${colCount}, 1fr)`,
          gap: gapPx,
        }}>
          {Array.from({ length: colCount }, () => ++cellIdx).map((n) => (
            <GridCell key={n} n={n} radius={radius} cellStyle={getCellStyle(n - 1)} />
          ))}
        </div>
      ))}
    </div>
  );
}

function ListItemText({ item, showTitle = true, showSubtitle = true, showMetadata = true, textAlign }: { item: { title: string; subtitle?: string; metadata?: string }; showTitle?: boolean; showSubtitle?: boolean; showMetadata?: boolean; textAlign?: 'left' | 'center' | 'right' }) {
  return (
    <div style={{ textAlign: textAlign ?? 'left' }}>
      {showTitle && (
        <div style={{ fontWeight: 500, fontSize: 14, color: '#fff' }}>{item.title}</div>
      )}
      {showSubtitle && item.subtitle && (
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{item.subtitle}</div>
      )}
      {showMetadata && item.metadata && (
        <a href="#" onClick={(e) => e.preventDefault()} style={{
          display: 'inline-block', marginTop: 4, fontSize: 12, fontWeight: 500,
          color: 'rgba(255,255,255,0.8)', textDecoration: 'none',
        }}>{item.metadata}</a>
      )}
    </div>
  );
}

const THUMBNAIL_ICON_MAP: Record<ListThumbnailIcon, React.ComponentType<{ size?: number }>> = {
  'play': Play, 'film': Film, 'tv': Tv, 'music': Music, 'gamepad-2': Gamepad2, 'clapperboard': Clapperboard,
  'star': Star, 'heart': Heart, 'bookmark': Bookmark, 'award': Award, 'trophy': Trophy, 'gem': Gem,
  'clock': Clock, 'calendar': Calendar, 'bell': Bell, 'zap': Zap, 'flame': Flame, 'sparkles': Sparkles,
  'user': User, 'users': Users, 'globe': Globe, 'map-pin': MapPin, 'compass': Compass, 'navigation': Navigation,
  'download': Download, 'share-2': Share2, 'external-link': ExternalLink, 'link': LinkIcon, 'eye': Eye, 'search': Search,
  'check-circle': CheckCircle, 'info': Info, 'alert-circle': AlertCircle, 'shield': Shield, 'lock': Lock, 'unlock': Unlock,
};

function ListThumbnail({ size = 60, index = 0, radius = 8, thumbnailType = 'image', thumbnailIcon = 'play', iconCircleBg = false, iconCircleColor = '#E50914' }: { size?: number; index?: number; radius?: number; thumbnailType?: 'image' | 'icon'; thumbnailIcon?: ListThumbnailIcon; iconCircleBg?: boolean; iconCircleColor?: string }) {
  if (thumbnailType === 'icon') {
    const IconComp = THUMBNAIL_ICON_MAP[thumbnailIcon] ?? Play;
    return (
      <div style={{
        width: size, height: size,
        borderRadius: iconCircleBg ? '50%' : radius, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: iconCircleBg ? iconCircleColor : undefined,
        color: iconCircleBg ? '#fff' : undefined,
      }}>
        <IconComp size={Math.round(size * 0.45)} />
      </div>
    );
  }
  const poster = posters[index % posters.length];
  return (
    <div style={{
      width: size, height: size,
      borderRadius: radius, flexShrink: 0, overflow: 'hidden',
      background: 'rgba(255,255,255,0.08)',
    }}>
      <img src={poster.image} alt={poster.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
  );
}

function ListPreview({ settings }: { settings: { layout: string; columns: number; showTitle?: boolean; showSubtitle?: boolean; showMetadata?: boolean; showThumbnail: boolean; showDivider: boolean; thumbnailType?: 'image' | 'icon'; thumbnailIcon?: ListThumbnailIcon; thumbnailRadius?: number; iconCircleBackground?: boolean; iconCircleColor?: string; textAlign?: 'left' | 'center' | 'right'; itemCount: 'all' | number; items: { title: string; subtitle?: string; metadata?: string; thumbnailIcon?: ListThumbnailIcon; style?: { padding: Padding; backgroundColor: string; backgroundRadius: [number, number, number, number]; strokeColor?: string; strokeWidth?: number } }[]; itemStyleMode?: 'whole' | 'individual'; itemStyle?: { padding: Padding; backgroundColor: string; backgroundRadius: [number, number, number, number]; strokeColor?: string; strokeWidth?: number }; padding?: Padding; backgroundColor?: string; backgroundRadius?: [number, number, number, number]; strokeColor?: string; strokeWidth?: number } }) {
  const limit = settings.itemCount === 'all' ? settings.items.length : settings.itemCount;
  const items = settings.items.slice(0, limit);
  const isStacked = settings.layout === 'schedules';
  const sTitle = settings.showTitle ?? true;
  const sSub = settings.showSubtitle ?? true;
  const sMeta = settings.showMetadata ?? true;
  const bg = settings.backgroundColor ?? 'transparent';
  const dividerColor = 'rgba(255,255,255,0.15)';
  const thumbRadius = settings.thumbnailRadius ?? 8;
  const radii = settings.backgroundRadius ?? [0, 0, 0, 0];
  const styleMode = settings.itemStyleMode ?? 'whole';
  const wholeStyle = settings.itemStyle ?? { padding: 0, backgroundColor: 'transparent', backgroundRadius: [0, 0, 0, 0] as [number, number, number, number], strokeColor: 'transparent', strokeWidth: 0 };
  const noStyle = { padding: 0, backgroundColor: 'transparent', backgroundRadius: [0, 0, 0, 0] as [number, number, number, number], strokeColor: 'transparent', strokeWidth: 0 };

  const getItemStyle = (item: typeof items[0]) => {
    if (styleMode === 'individual') return item.style ?? noStyle;
    return wholeStyle;
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: settings.columns === 1 ? '1fr' : settings.columns === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
      gap: isStacked ? 12 : 16,
      background: bg,
      borderRadius: `${radii[0]}px ${radii[1]}px ${radii[2]}px ${radii[3]}px`,
      ...strokeStyle(settings.strokeColor, settings.strokeWidth),
    }}>
      {items.map((item, i) => {
        const divider = settings.showDivider;
        const iStyle = getItemStyle(item);
        const ir = iStyle.backgroundRadius;
        const itemWrap: React.CSSProperties = {
          padding: paddingToCss(iStyle.padding) || undefined,
          background: iStyle.backgroundColor || undefined,
          borderRadius: (ir[0] || ir[1] || ir[2] || ir[3]) ? `${ir[0]}px ${ir[1]}px ${ir[2]}px ${ir[3]}px` : undefined,
          ...strokeStyle(iStyle.strokeColor, iStyle.strokeWidth),
        };

        if (isStacked) {
          const tType = settings.thumbnailType ?? 'image';
          const tIcon = item.thumbnailIcon ?? settings.thumbnailIcon ?? 'play';
          const align = settings.textAlign ?? 'left';
          const alignItems = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';
          return (
            <div key={i} style={{
              ...itemWrap,
              display: 'flex', flexDirection: 'column', gap: 8,
              alignItems,
              paddingBottom: uniformPaddingValue(iStyle.padding) || (divider ? 12 : 0),
              borderBottom: divider ? `1px solid ${dividerColor}` : 'none',
            }}>
              {settings.showThumbnail && tType === 'icon' && (() => {
                const IconComp = THUMBNAIL_ICON_MAP[tIcon] ?? Play;
                const circleBg = settings.iconCircleBackground;
                const circleCol = settings.iconCircleColor ?? '#E50914';
                const circleSize = circleBg && settings.columns === 1 ? 120 : 60;
                return (
                  <div style={{
                    width: '100%', aspectRatio: '16/9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{
                      width: circleSize, height: circleSize,
                      borderRadius: circleBg ? '50%' : thumbRadius,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: circleBg ? circleCol : undefined,
                      color: circleBg ? '#fff' : undefined,
                    }}>
                      <IconComp size={27} />
                    </div>
                  </div>
                );
              })()}
              {settings.showThumbnail && tType !== 'icon' && (
                <div style={{
                  width: '100%', aspectRatio: '16/9',
                  borderRadius: thumbRadius, overflow: 'hidden',
                  background: 'rgba(255,255,255,0.08)',
                }}>
                  <img src={posters[i % posters.length].image} alt={posters[i % posters.length].title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              )}
              <ListItemText item={item} showTitle={sTitle} showSubtitle={sSub} showMetadata={sMeta} textAlign={align} />
            </div>
          );
        }

        const isRightAligned = settings.layout === 'chapters';

        return (
          <div key={i} style={{
            ...itemWrap,
            display: 'flex', gap: 12,
            justifyContent: isRightAligned ? 'space-between' : 'flex-start',
            alignItems: 'center',
            paddingBottom: uniformPaddingValue(iStyle.padding) || (divider ? 16 : 0),
            borderBottom: divider ? `1px solid ${dividerColor}` : 'none',
          }}>
            {isRightAligned ? (
              <>
                <ListItemText item={item} showTitle={sTitle} showSubtitle={sSub} showMetadata={sMeta} />
                {settings.showThumbnail && <ListThumbnail index={i} radius={thumbRadius} thumbnailType={settings.thumbnailType} thumbnailIcon={item.thumbnailIcon ?? settings.thumbnailIcon} iconCircleBg={settings.iconCircleBackground} iconCircleColor={settings.iconCircleColor} />}
              </>
            ) : (
              <>
                {settings.showThumbnail && <ListThumbnail index={i} radius={thumbRadius} thumbnailType={settings.thumbnailType} thumbnailIcon={item.thumbnailIcon ?? settings.thumbnailIcon} iconCircleBg={settings.iconCircleBackground} iconCircleColor={settings.iconCircleColor} />}
                <ListItemText item={item} showTitle={sTitle} showSubtitle={sSub} showMetadata={sMeta} />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RichTextPreview({ settings, componentId, sectionId }: { settings: RichTextSettings; componentId: string; sectionId: string }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const internalContent = useRef(settings.content);
  const updateComponentSettings = useMessageStore((s) => s.updateComponentSettings);
  const selectedComponentId = useMessageStore((s) => s.selectedComponentId);
  const isSelected = selectedComponentId === componentId;
  const wasSelected = useRef(false);

  useEffect(() => {
    if (!editorRef.current) return;
    if (!isSelected && internalContent.current !== settings.content) {
      editorRef.current.innerHTML = settings.content;
      internalContent.current = settings.content;
    }
  }, [settings.content, isSelected]);

  useEffect(() => {
    if (isSelected && !wasSelected.current && editorRef.current) {
      editorRef.current.focus();
    }
    wasSelected.current = isSelected;
  }, [isSelected]);

  const handleInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    internalContent.current = html;
    if (html !== settings.content) {
      updateComponentSettings(sectionId, componentId, {
        type: 'rich-text',
        settings: { ...settings, content: html },
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'b' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      document.execCommand('bold');
    } else if (e.key === 'i' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      document.execCommand('italic');
    } else if (e.key === 'u' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      document.execCommand('underline');
    }
  };

  return (
    <div
      ref={(el) => {
        (editorRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        if (el && !el.innerHTML) {
          el.innerHTML = settings.content;
        }
      }}
      contentEditable={isSelected}
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      style={{
        minHeight: 40,
        fontSize: settings.fontSize,
        lineHeight: settings.lineHeight,
        color: settings.color,
        textAlign: settings.alignment,
        background: settings.backgroundColor || 'transparent',
        borderRadius: settings.backgroundRadius
          ? `${settings.backgroundRadius[0]}px ${settings.backgroundRadius[1]}px ${settings.backgroundRadius[2]}px ${settings.backgroundRadius[3]}px`
          : 0,
        ...strokeStyle(settings.strokeColor, settings.strokeWidth),
        outline: 'none',
        cursor: isSelected ? 'text' : 'pointer',
        wordBreak: 'break-word',
      }}
    />
  );
}

function LaurelWreath({ size = 20 }: { size?: number }) {
  return <img src="/laurel-wreath.svg" width={size} height={size} alt="" style={{ display: 'block' }} />;
}

export function CalloutBadge({ callout }: { callout: ComponentCallout }) {
  const variant = callout.variant ?? 'A';

  if (variant === 'A') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: 8,
        background: 'rgba(0,0,0,0.5)', borderRadius: 8,
        overflow: 'hidden', width: 'fit-content',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <LaurelWreath size={20} />
        </span>
        <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '19px', color: '#fff', whiteSpace: 'nowrap' }}>
          {callout.text}
        </span>
      </div>
    );
  }

  if (variant === 'B') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: 8,
        background: 'rgba(0,0,0,0.5)', borderRadius: 8,
        overflow: 'hidden', width: 169, margin: '0 auto',
      }}>
        <LaurelWreath size={20} />
        <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '19px', color: '#fff', whiteSpace: 'nowrap', textAlign: 'center' }}>
          {callout.text}
        </span>
      </div>
    );
  }

  if (variant === 'C') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: 8,
        background: 'rgba(0,0,0,0.5)', borderRadius: 8,
        overflow: 'hidden', width: 169, margin: '0 auto',
      }}>
        <LaurelWreath size={48} />
        <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '19px', color: '#fff', whiteSpace: 'nowrap', textAlign: 'center' }}>
          {callout.text}
        </span>
      </div>
    );
  }

  // Variant D
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      padding: '0 8px', borderRadius: 8, overflow: 'hidden', width: 169, margin: '0 auto',
    }}>
      <LaurelWreath size={56} />
      <span style={{ fontSize: 20, fontWeight: 500, lineHeight: '22px', color: '#fff', textAlign: 'center', width: 169 }}>
        {callout.text}
      </span>
    </div>
  );
}

export function LiveBadgeRow({ liveBadge }: { liveBadge: ComponentLiveBadge }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
          textAlign: 'center',
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
          textAlign: 'center',
        }}>
          {liveBadge.value}
        </span>
      </div>
    </div>
  );
}

export function MetadataRow({ metadata }: { metadata: ComponentMetadata }) {
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

function CountdownCell({ value, label, compact }: { value: string; label: string; compact?: boolean }) {
  if (compact) {
    return (
      <div style={{
        flex: 1,
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 16,
        padding: '12px 6px',
        display: 'flex',
        gap: 4,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 0,
        whiteSpace: 'nowrap',
      }}>
        <span style={{
          fontFamily: 'var(--font-family)',
          fontSize: 16,
          fontWeight: 500,
          lineHeight: 1,
          color: '#fff',
          letterSpacing: '-0.32px',
          textTransform: 'uppercase',
        }}>
          {value}
        </span>
        <span style={{
          fontFamily: 'var(--font-family)',
          fontSize: 16,
          fontWeight: 400,
          lineHeight: 1,
          color: 'rgba(255,255,255,0.7)',
          letterSpacing: '-0.08px',
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
      borderRadius: 16,
      paddingTop: 16,
      paddingBottom: 12,
      paddingLeft: 6,
      paddingRight: 6,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      minWidth: 0,
    }}>
      <span style={{
        fontFamily: 'var(--font-family)',
        fontSize: 64,
        fontWeight: 500,
        lineHeight: 1,
        color: '#fff',
        letterSpacing: '-1.28px',
        textTransform: 'uppercase',
        width: 80,
        textAlign: 'center',
      }}>
        {value}
      </span>
      <span style={{
        fontFamily: 'var(--font-family)',
        fontSize: 16,
        fontWeight: 400,
        lineHeight: 1,
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: '-0.08px',
        width: 80,
        textAlign: 'center',
      }}>
        {label}
      </span>
    </div>
  );
}

function CountdownSeparator({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <div style={{ flexShrink: 0, width: 2.2, height: 8, position: 'relative' }}>
        <svg width="3" height="8" viewBox="0 0 3 8" fill="none">
          <circle cx="1.1" cy="1.5" r="1.1" fill="rgba(255,255,255,0.5)" />
          <circle cx="1.1" cy="6.5" r="1.1" fill="rgba(255,255,255,0.5)" />
        </svg>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      height: 18,
    }}>
      <span style={{
        width: 5,
        height: 5,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.5)',
      }} />
      <span style={{
        width: 5,
        height: 5,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.5)',
      }} />
    </div>
  );
}

function CountdownImagePlaceholder({ width, height }: { width: number; height: number }) {
  return (
    <div style={{
      width,
      height,
      borderRadius: 16,
      background: '#232323',
      flexShrink: 0,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }} />
  );
}

function CountdownImageCell({ imageUrl, width, height }: { imageUrl: string; width: number; height: number }) {
  if (!imageUrl) return <CountdownImagePlaceholder width={width} height={height} />;
  return (
    <div style={{
      width,
      height,
      borderRadius: 16,
      flexShrink: 0,
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: '#232323',
    }} />
  );
}

export function CountdownBadge({ countdown }: { countdown: ComponentCountdown }) {
  const variant = countdown.variant || 'A';
  const containerBase: React.CSSProperties = {
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 24,
    padding: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  };

  // Variant A: Days : Hours : Minutes (full)
  if (variant === 'A') {
    return (
      <div style={{ ...containerBase, gap: 10 }}>
        <CountdownCell value={countdown.days} label="Days" />
        <CountdownSeparator />
        <CountdownCell value={countdown.hours} label="Hours" />
        <CountdownSeparator />
        <CountdownCell value={countdown.minutes} label="Minutes" />
      </div>
    );
  }

  // Variant B: Days : Hours
  if (variant === 'B') {
    return (
      <div style={{ ...containerBase, gap: 10 }}>
        <CountdownCell value={countdown.days} label="Days" />
        <CountdownSeparator />
        <CountdownCell value={countdown.hours} label="Hours" />
      </div>
    );
  }

  // Variant C: Days text + image on the right
  if (variant === 'C') {
    return (
      <div style={{ ...containerBase, gap: 10 }}>
        <div style={{
          flex: 1,
          background: 'rgba(255,255,255,0.02)',
          borderRadius: 16,
          height: 73,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          paddingLeft: 16,
          paddingTop: 14,
          minWidth: 0,
        }}>
          <span style={{
            fontFamily: 'var(--font-family)',
            fontSize: 64,
            fontWeight: 500,
            lineHeight: 1,
            color: '#fff',
            letterSpacing: '-1.28px',
            textTransform: 'uppercase',
          }}>
            {countdown.days}
          </span>
          <span style={{
            fontFamily: 'var(--font-family)',
            fontSize: 18,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: '-0.09px',
          }}>
            Days
          </span>
          <div style={{ position: 'absolute', right: 6, top: 6 }}>
            <CountdownImageCell imageUrl={countdown.imageUrl} width={109} height={61} />
          </div>
        </div>
      </div>
    );
  }

  // Variant D: Image on the left + Minutes
  if (variant === 'D') {
    return (
      <div style={{ ...containerBase, gap: 10 }}>
        <CountdownImageCell imageUrl={countdown.imageUrl} width={151} height={96} />
        <CountdownCell value={countdown.minutes} label="Minutes" />
      </div>
    );
  }

  // Variant E: Text message "Starts in 3 days"
  if (variant === 'E') {
    return (
      <div style={{ ...containerBase }}>
        <div style={{
          flex: 1,
          background: 'rgba(255,255,255,0.02)',
          borderRadius: 16,
          paddingTop: 16,
          paddingBottom: 12,
          paddingLeft: 6,
          paddingRight: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 0,
        }}>
          <span style={{
            fontFamily: 'var(--font-family)',
            fontSize: 32,
            fontWeight: 700,
            lineHeight: '40px',
            color: '#fff',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}>
            {countdown.message || 'Starts in 3 days'}
          </span>
        </div>
      </div>
    );
  }

  // Variant F: Compact inline — Days : Hours : Minutes (small)
  return (
    <div style={{ ...containerBase, gap: 6 }}>
      <CountdownCell value={countdown.days} label="Days" compact />
      <CountdownSeparator compact />
      <CountdownCell value={countdown.hours} label="Hours" compact />
      <CountdownSeparator compact />
      <CountdownCell value={countdown.minutes} label="Minutes" compact />
    </div>
  );
}

export function ComponentRenderer({ component, sectionId }: ComponentRendererProps) {
  const selectedComponentId = useMessageStore((s) => s.selectedComponentId);
  const selectComponent = useMessageStore((s) => s.selectComponent);
  const theme = useMessageStore((s) => s.message?.theme);
  const ts = theme?.typography.textStyles ?? defaultTextStyles;

  const isSelected = selectedComponentId === component.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectComponent(component.id, sectionId);
  };

  let content: React.ReactNode = null;
  if (component.settings.type === 'media') {
    content = (
      <WithMarquee marquee={component.settings.settings.marquee}>
        <MediaPreview settings={component.settings.settings} />
      </WithMarquee>
    );
  } else if (component.settings.type === 'text-block') {
    content = <TextBlockPreview settings={component.settings.settings} ts={ts} />;
  } else if (component.settings.type === 'rich-text') {
    content = <RichTextPreview settings={component.settings.settings} componentId={component.id} sectionId={sectionId} />;
  } else if (component.settings.type === 'cta') {
    content = <CTAPreview settings={component.settings.settings} />;
  } else if (component.settings.type === 'grid') {
    content = (
      <WithMarquee marquee={component.settings.settings.marquee}>
        <GridPreview settings={component.settings.settings} />
      </WithMarquee>
    );
  } else if (component.settings.type === 'list') {
    content = <ListPreview settings={component.settings.settings} />;
  }

  const cpSides = parsePadding(theme?.componentPadding);
  const settingsPadding = parsePadding(component.settings.settings.padding);
  const componentPadding = `${Math.max(2, cpSides[0] + settingsPadding[0] + 2)}px ${Math.max(2, cpSides[1] + settingsPadding[1] + 2)}px ${Math.max(2, cpSides[2] + settingsPadding[2] + 2)}px ${Math.max(2, cpSides[3] + settingsPadding[3] + 2)}px`;
  const order: AttachmentKey[] = component.attachmentOrder ?? DEFAULT_ATTACHMENT_ORDER;

  const renderAttachment = (key: AttachmentKey, position: 'above' | 'below') => {
    const spacing = position === 'above' ? { marginBottom: 8 } : { marginTop: 8 };
    if (key === 'callout' && component.callout?.enabled && component.callout.position === position) {
      return <div key={`${key}-${position}`} style={spacing}><CalloutBadge callout={component.callout} /></div>;
    }
    if (key === 'metadata' && component.metadata?.enabled && component.metadata.items.length > 0 && component.metadata.position === position) {
      return <div key={`${key}-${position}`} style={spacing}><MetadataRow metadata={component.metadata} /></div>;
    }
    if (key === 'liveBadge' && component.liveBadge?.enabled && component.liveBadge.position === position) {
      return <div key={`${key}-${position}`} style={spacing}><LiveBadgeRow liveBadge={component.liveBadge} /></div>;
    }
    if (key === 'countdown' && component.countdown?.enabled && component.countdown.position === position) {
      return <div key={`${key}-${position}`} style={spacing}><CountdownBadge countdown={component.countdown} /></div>;
    }
    return null;
  };

  return (
    <div
      data-component-id={component.id}
      onClick={handleClick}
      style={{
        marginBottom: 16,
        padding: componentPadding,
        borderRadius: 8,
        fontFamily: 'var(--font-family)',
        outline: isSelected ? '2px solid rgba(229,77,77,0.4)' : '2px solid transparent',
        boxShadow: isSelected ? '0 0 0 4px rgba(229,77,77,0.2)' : 'none',
        cursor: 'pointer',
        transition: 'outline var(--transition-fast), box-shadow var(--transition-fast)',
      }}
    >
      {order.map((key) => renderAttachment(key, 'above'))}
      {content}
      {order.map((key) => renderAttachment(key, 'below'))}
    </div>
  );
}
