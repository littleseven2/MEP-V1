import { useMessageStore } from '../../store/messageStore';
import { ComponentRenderer, CalloutBadge, MetadataRow, LiveBadgeRow, CountdownBadge } from './ComponentRenderer';
import type { Section } from '../../types/message';

interface SectionRendererProps {
  section: Section;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  const selectedSectionId = useMessageStore((s) => s.selectedSectionId);
  const selectedComponentId = useMessageStore((s) => s.selectedComponentId);
  const selectSection = useMessageStore((s) => s.selectSection);
  const theme = useMessageStore((s) => s.message?.theme);

  const isActive = selectedSectionId === section.id;
  const isSectionOnly = isActive && !selectedComponentId;
  const sectionPadding = (section.padding ?? 0) + (theme?.sectionPadding ?? 0);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectSection(section.id);
  };

  return (
    <div
      data-section-id={section.id}
      onClick={handleClick}
      style={{
        borderLeft: isActive ? '2px solid var(--color-brand)' : '2px solid transparent',
        background: section.background.value,
        padding: sectionPadding,
        borderRadius: section.backgroundRadius
          ? `${section.backgroundRadius[0]}px ${section.backgroundRadius[1]}px ${section.backgroundRadius[2]}px ${section.backgroundRadius[3]}px`
          : 0,
        ...(section.strokeWidth && section.strokeColor && section.strokeColor !== 'transparent'
          ? { boxShadow: `inset 0 0 0 ${section.strokeWidth}px ${section.strokeColor}` }
          : {}),
        transition: 'border-color var(--transition-fast)',
        fontFamily: 'var(--font-family)',
      }}
    >
      {isActive && (
        <div
          style={{
            padding: '6px 12px',
            background: 'linear-gradient(90deg, var(--color-brand-subtle) 0%, transparent 100%)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            color: isSectionOnly ? 'var(--color-text-secondary)' : 'rgba(255,255,255,0.35)',
          }}
        >
          <span style={{ textTransform: 'capitalize' }}>Section</span>
        </div>
      )}

      <div style={{ padding: 16 }}>
        {section.type === 'header' && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>
              Netflix
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              View in Browser
            </span>
          </div>
        )}

        {section.type === 'footer' && (
          <div
            style={{
              padding: '12px 0',
              fontSize: 11,
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            Unsubscribe · Privacy · Help Center
          </div>
        )}

        {section.type === 'content' && (
          <>
            {section.callout?.enabled && section.callout.position === 'above' && (
              <div style={{ marginBottom: 8 }}><CalloutBadge callout={section.callout} /></div>
            )}
            {section.liveBadge?.enabled && section.liveBadge.position === 'above' && (
              <div style={{ marginBottom: 8 }}><LiveBadgeRow liveBadge={section.liveBadge} /></div>
            )}
            {section.metadata?.enabled && section.metadata.items.length > 0 && section.metadata.position === 'above' && (
              <div style={{ marginBottom: 8 }}><MetadataRow metadata={section.metadata} /></div>
            )}
            {section.countdown?.enabled && section.countdown.position === 'above' && (
              <div style={{ marginBottom: 8 }}><CountdownBadge countdown={section.countdown} /></div>
            )}
            {section.components.length === 0 ? (
              <div
                style={{
                  padding: 32,
                  textAlign: 'center',
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: 14,
                }}
              >
                Empty section. Add components from the palette.
              </div>
            ) : (
              section.components
                .sort((a, b) => a.order - b.order)
                .map((comp) => <ComponentRenderer key={comp.id} component={comp} sectionId={section.id} />)
            )}
            {section.countdown?.enabled && section.countdown.position === 'below' && (
              <div style={{ marginTop: 8 }}><CountdownBadge countdown={section.countdown} /></div>
            )}
            {section.metadata?.enabled && section.metadata.items.length > 0 && section.metadata.position === 'below' && (
              <div style={{ marginTop: 8 }}><MetadataRow metadata={section.metadata} /></div>
            )}
            {section.liveBadge?.enabled && section.liveBadge.position === 'below' && (
              <div style={{ marginTop: 8 }}><LiveBadgeRow liveBadge={section.liveBadge} /></div>
            )}
            {section.callout?.enabled && section.callout.position === 'below' && (
              <div style={{ marginTop: 8 }}><CalloutBadge callout={section.callout} /></div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
