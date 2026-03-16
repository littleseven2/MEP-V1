import React, { useState } from 'react';
import { useMessageStore } from '../../store/messageStore';
import { ComponentRenderer, CalloutBadge, MetadataRow, LiveBadgeRow, CountdownBadge } from './ComponentRenderer';
import type { Section, AttachmentKey } from '../../types/message';
import { addPadding, paddingToCss, computeSectionItemOrder, isAttachmentKey } from '../../types/message';

interface SectionRendererProps {
  section: Section;
}

function renderSectionAttachment(section: Section, key: AttachmentKey) {
  if (key === 'callout' && section.callout?.enabled) {
    return <div key={key} style={{ marginTop: 4, marginBottom: 4 }}><CalloutBadge callout={section.callout} /></div>;
  }
  if (key === 'metadata' && section.metadata?.enabled && section.metadata.items.length > 0) {
    return <div key={key} style={{ marginTop: 4, marginBottom: 4 }}><MetadataRow metadata={section.metadata} /></div>;
  }
  if (key === 'liveBadge' && section.liveBadge?.enabled) {
    return <div key={key} style={{ marginTop: 4, marginBottom: 4 }}><LiveBadgeRow liveBadge={section.liveBadge} /></div>;
  }
  if (key === 'countdown' && section.countdown?.enabled) {
    return <div key={key} style={{ marginTop: 4, marginBottom: 4 }}><CountdownBadge countdown={section.countdown} /></div>;
  }
  return null;
}

function SectionContentWithAttachments({ section }: { section: Section }) {
  const itemOrder = computeSectionItemOrder(section);
  const compMap = new Map(section.components.map((c) => [c.id, c]));

  const hasVisibleItems = itemOrder.some((id) => {
    if (isAttachmentKey(id)) {
      const att = section[id as AttachmentKey];
      return att?.enabled;
    }
    return compMap.has(id);
  });

  if (!hasVisibleItems && section.components.length === 0) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
        Empty section. Add components from the palette.
      </div>
    );
  }

  return (
    <>
      {itemOrder.map((id) => {
        if (isAttachmentKey(id)) {
          return renderSectionAttachment(section, id as AttachmentKey);
        }
        const comp = compMap.get(id);
        if (!comp) return null;
        return <ComponentRenderer key={comp.id} component={comp} sectionId={section.id} />;
      })}
    </>
  );
}

export function SectionRenderer({ section }: SectionRendererProps) {
  const selectedSectionId = useMessageStore((s) => s.selectedSectionId);
  const selectedComponentId = useMessageStore((s) => s.selectedComponentId);
  const selectSection = useMessageStore((s) => s.selectSection);
  const theme = useMessageStore((s) => s.message?.theme);
  const [hovered, setHovered] = useState(false);

  const isActive = selectedSectionId === section.id;
  const isSectionOnly = isActive && !selectedComponentId;
  const sectionPadding = addPadding(section.padding, theme?.sectionPadding);
  const isContent = section.type === 'content';
  const showBars = isContent && (isActive || hovered);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectSection(section.id);
  };

  return (
    <div
      data-section-id={section.id}
      onClick={handleClick}
      onMouseEnter={isContent ? () => setHovered(true) : undefined}
      onMouseLeave={isContent ? () => setHovered(false) : undefined}
      style={{
        position: 'relative',
        background: section.background.value,
        padding: paddingToCss(sectionPadding),
        borderRadius: section.backgroundRadius
          ? `${section.backgroundRadius[0]}px ${section.backgroundRadius[1]}px ${section.backgroundRadius[2]}px ${section.backgroundRadius[3]}px`
          : 0,
        outline: showBars ? '2px solid var(--color-brand)' : '2px solid transparent',
        outlineOffset: -2,
        boxShadow: [
          section.strokeWidth && section.strokeColor && section.strokeColor !== 'transparent'
            ? `inset 0 0 0 ${section.strokeWidth}px ${section.strokeColor}` : '',
        ].filter(Boolean).join(', ') || undefined,
        transition: 'outline-color var(--transition-fast), box-shadow var(--transition-fast)',
        fontFamily: 'var(--font-family)',
      }}
    >
      {isActive && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: 'translateY(-100%)',
            padding: '4px 12px',
            background: 'linear-gradient(90deg, var(--color-brand-subtle) 0%, transparent 100%)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            color: isSectionOnly ? 'var(--color-text-secondary)' : 'rgba(255,255,255,0.35)',
            pointerEvents: 'none',
          }}
        >
          <span style={{ textTransform: 'capitalize' }}>Section</span>
        </div>
      )}

      <div>
        {section.type === 'header' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 0',
            }}
          >
            <img src="/n-symbol.png" alt="N" style={{ width: 28, height: 51, objectFit: 'contain', display: 'block' }} />
          </div>
        )}

        {section.type === 'footer' && (
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', justifyContent: 'center' }}>
            <img src="/n-symbol.png" alt="N" style={{ width: 17, height: 30, objectFit: 'contain', display: 'block', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'var(--font-family)', fontSize: 12, lineHeight: '18px' }}>
              <div>
                <p style={{ margin: 0, color: '#fff' }}>Call 1-866-579-7172</p>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)' }}>100 Winchester Circle</p>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)' }}>Los Gatos, California</p>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)' }}>95032, U.S.A.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <a href="#" style={{ color: '#fff', textDecoration: 'underline', fontSize: 12, lineHeight: '18px' }}>Unsubscribe</a>
                <a href="#" style={{ color: '#fff', textDecoration: 'underline', fontSize: 12, lineHeight: '18px' }}>Terms of Use</a>
                <a href="#" style={{ color: '#fff', textDecoration: 'underline', fontSize: 12, lineHeight: '18px' }}>Privacy</a>
                <a href="#" style={{ color: '#fff', textDecoration: 'underline', fontSize: 12, lineHeight: '18px' }}>Help Center</a>
              </div>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: 12, lineHeight: '18px' }}>
                This message was mailed to you by Netflix as part of your Netflix membership.
              </p>
            </div>
          </div>
        )}

        {section.type === 'content' && (
          <SectionContentWithAttachments section={section} />
        )}
      </div>
    </div>
  );
}
