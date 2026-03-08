import React from 'react';
import { Plus, Star, Trash2, ChevronUp, ChevronDown, Copy } from 'lucide-react';
import { useMessageStore } from '../../store/messageStore';

export function SectionPanel() {
  const message = useMessageStore((s) => s.message);
  const selectedSectionId = useMessageStore((s) => s.selectedSectionId);
  const addSection = useMessageStore((s) => s.addSection);
  const selectSection = useMessageStore((s) => s.selectSection);
  const removeSection = useMessageStore((s) => s.removeSection);
  const updateSection = useMessageStore((s) => s.updateSection);
  const moveSectionUp = useMessageStore((s) => s.moveSectionUp);
  const moveSectionDown = useMessageStore((s) => s.moveSectionDown);
  const duplicateSection = useMessageStore((s) => s.duplicateSection);

  if (!message) return null;

  const contentSections = message.sections.filter((s) => s.type === 'content');
  const hasHeader = message.sections.some((s) => s.type === 'header');
  const hasFooter = message.sections.some((s) => s.type === 'footer');

  const handleSetPrimary = (sectionId: string) => {
    message.sections.forEach((s) => {
      if (s.type === 'content') {
        updateSection(s.id, { isPrimary: s.id === sectionId });
      }
    });
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Fixed sections */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600,
          color: 'var(--color-text-tertiary)', letterSpacing: 'var(--letter-spacing-wide)',
          marginBottom: 8,
        }}>
          Structure
        </div>
        {hasHeader && (
          <SectionRow
            label="Header"
            type="header"
            selected={selectedSectionId === message.sections.find((s) => s.type === 'header')?.id}
            onClick={() => selectSection(message.sections.find((s) => s.type === 'header')?.id ?? null)}
          />
        )}
        {contentSections.map((section, idx) => (
          <SectionRow
            key={section.id}
            label={`Section ${idx + 1}`}
            type="content"
            isPrimary={section.isPrimary}
            selected={selectedSectionId === section.id}
            onClick={() => selectSection(section.id)}
            componentCount={section.components.length}
            onSetPrimary={() => handleSetPrimary(section.id)}
            onMoveUp={idx > 0 ? () => moveSectionUp(section.id) : undefined}
            onMoveDown={idx < contentSections.length - 1 ? () => moveSectionDown(section.id) : undefined}
            onDuplicate={() => duplicateSection(section.id)}
            onDelete={() => removeSection(section.id)}
          />
        ))}
        {hasFooter && (
          <SectionRow
            label="Footer"
            type="footer"
            selected={selectedSectionId === message.sections.find((s) => s.type === 'footer')?.id}
            onClick={() => selectSection(message.sections.find((s) => s.type === 'footer')?.id ?? null)}
          />
        )}
      </div>

      <button
        type="button"
        onClick={() => addSection('content')}
        style={{
          width: '100%',
          padding: '10px 16px',
          border: '2px dashed var(--color-border-default)',
          borderRadius: 10,
          background: 'transparent',
          color: 'var(--color-text-secondary)',
          fontFamily: 'var(--font-family)',
          fontSize: 13,
          cursor: 'pointer',
          transition: 'var(--transition-fast)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-brand)';
          e.currentTarget.style.background = 'var(--color-brand-subtle)';
          e.currentTarget.style.color = 'var(--color-brand)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border-default)';
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--color-text-secondary)';
        }}
      >
        <Plus size={14} />
        Add Section
      </button>
    </div>
  );
}

function SectionRow({
  label,
  type,
  isPrimary,
  selected,
  onClick,
  componentCount,
  onSetPrimary,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}: {
  label: string;
  type: 'header' | 'content' | 'footer';
  isPrimary?: boolean;
  selected: boolean;
  onClick: () => void;
  componentCount?: number;
  onSetPrimary?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}) {
  const [hovered, setHovered] = React.useState(false);
  const isFixed = type === 'header' || type === 'footer';

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 10px',
        borderRadius: 8,
        cursor: 'pointer',
        transition: 'var(--transition-fast)',
        background: selected ? 'var(--color-brand-subtle)' : hovered ? 'var(--color-bg-tertiary)' : 'transparent',
        border: selected ? '1px solid var(--color-brand)' : '1px solid transparent',
        marginBottom: 2,
      }}
    >
      {isPrimary && (
        <Star size={12} fill="var(--color-brand)" color="var(--color-brand)" style={{ flexShrink: 0 }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 500,
          color: selected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {label}
        </div>
        {componentCount !== undefined && (
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 1 }}>
            {componentCount} component{componentCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>
      {!isFixed && (hovered || selected) && (
        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {onSetPrimary && !isPrimary && (
            <ActionBtn icon={<Star size={11} />} title="Set as primary" onClick={onSetPrimary} />
          )}
          {onMoveUp && <ActionBtn icon={<ChevronUp size={11} />} title="Move up" onClick={onMoveUp} />}
          {onMoveDown && <ActionBtn icon={<ChevronDown size={11} />} title="Move down" onClick={onMoveDown} />}
          {onDuplicate && <ActionBtn icon={<Copy size={11} />} title="Duplicate" onClick={onDuplicate} />}
          {onDelete && <ActionBtn icon={<Trash2 size={11} />} title="Delete" onClick={onDelete} />}
        </div>
      )}
      {isFixed && (
        <div style={{ fontSize: 10, color: 'var(--color-text-muted)', fontStyle: 'italic', flexShrink: 0 }}>
          fixed
        </div>
      )}
    </div>
  );
}

function ActionBtn({ icon, title, onClick }: { icon: React.ReactNode; title: string; onClick: () => void }) {
  const [h, setH] = React.useState(false);
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: 22, height: 22, borderRadius: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: h ? 'var(--color-bg-tertiary)' : 'transparent',
        border: 'none', cursor: 'pointer', padding: 0,
        color: h ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
      }}
    >
      {icon}
    </button>
  );
}
