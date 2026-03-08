import { useMessageStore } from '../../store/messageStore';
import { ComponentRenderer } from './ComponentRenderer';
import type { Section } from '../../types/message';

interface SectionRendererProps {
  section: Section;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  const selectedSectionId = useMessageStore((s) => s.selectedSectionId);
  const selectedComponentId = useMessageStore((s) => s.selectedComponentId);
  const selectSection = useMessageStore((s) => s.selectSection);

  const isActive = selectedSectionId === section.id;
  const isSectionOnly = isActive && !selectedComponentId;

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
        padding: section.padding ?? 0,
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
          </>
        )}
      </div>
    </div>
  );
}
