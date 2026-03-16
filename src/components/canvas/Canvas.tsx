import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Plus, ChevronUp, ChevronDown, Copy, Trash2, Star } from 'lucide-react';
import { useMessageStore } from '../../store/messageStore';
import { paddingToCss } from '../../types/message';
import type { Section } from '../../types/message';
import { SectionRenderer } from './SectionRenderer';
import { ControlButton } from './FloatingControls';

export const Canvas: React.FC = () => {
  const {
    message, addSection, updateSection,
    selectedSectionId, selectedComponentId, selectSection,
    moveSectionUp, moveSectionDown, duplicateSection, removeSection,
    moveComponentUp, moveComponentDown, duplicateComponent, removeComponent,
  } = useMessageStore();

  const frameRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const [controlsTop, setControlsTop] = useState(0);
  const [primaryStarTop, setPrimaryStarTop] = useState<number | null>(null);

  const updatePositions = useCallback(() => {
    if (!frameRef.current || !scrollRef.current) return;
    const frameRect = frameRef.current.getBoundingClientRect();

    let el: HTMLElement | null = null;
    if (selectedComponentId) {
      el = scrollRef.current.querySelector(`[data-component-id="${selectedComponentId}"]`);
    } else if (selectedSectionId) {
      el = scrollRef.current.querySelector(`[data-section-id="${selectedSectionId}"]`);
    }
    if (el) {
      const elRect = el.getBoundingClientRect();
      setControlsTop(Math.max(0, elRect.top - frameRect.top));
    }

    // Track primary section star position
    if (!message) { setPrimaryStarTop(null); return; }
    const primarySection = message.sections.find((s) => s.type === 'content' && s.isPrimary);
    if (primarySection) {
      const primaryEl = scrollRef.current.querySelector(`[data-section-id="${primarySection.id}"]`);
      if (primaryEl) {
        const r = primaryEl.getBoundingClientRect();
        setPrimaryStarTop(Math.max(0, r.top - frameRect.top));
      } else {
        setPrimaryStarTop(null);
      }
    } else {
      setPrimaryStarTop(null);
    }
  }, [selectedSectionId, selectedComponentId, message]);

  useEffect(() => {
    updatePositions();
  }, [updatePositions]);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    scrollEl.addEventListener('scroll', updatePositions);
    return () => scrollEl.removeEventListener('scroll', updatePositions);
  }, [updatePositions]);

  if (!message) return null;

  const headerSection = message.sections.find((s) => s.type === 'header');
  const footerSection = message.sections.find((s) => s.type === 'footer');
  const contentSections = message.sections.filter((s) => s.type === 'content');

  const bgStyle: React.CSSProperties = {};
  if (message.theme.background.type === 'solid') bgStyle.background = message.theme.background.value;
  else if (message.theme.background.type === 'gradient') bgStyle.background = message.theme.background.value;

  const selectedSection = message.sections.find((s) => s.id === selectedSectionId);
  const selectedComponent = selectedSection?.components.find((c) => c.id === selectedComponentId);
  const isSectionSelected = selectedSectionId && !selectedComponentId && selectedSection?.type === 'content';
  const isComponentSelected = !!selectedComponentId && !!selectedComponent;
  const contentIdx = contentSections.findIndex((s) => s.id === selectedSectionId);
  const compIdx = selectedSection?.components.findIndex((c) => c.id === selectedComponentId) ?? -1;
  const canMoveUp = isComponentSelected ? compIdx > 0 : isSectionSelected ? contentIdx > 0 : false;
  const canMoveDown = isComponentSelected
    ? selectedSection ? compIdx < selectedSection.components.length - 1 : false
    : isSectionSelected ? contentIdx < contentSections.length - 1 : false;
  const showControls = isSectionSelected || isComponentSelected;
  const isPrimary = isSectionSelected && selectedSection?.isPrimary;

  const handleMoveUp = () => {
    if (isComponentSelected && selectedSectionId && selectedComponentId) moveComponentUp(selectedSectionId, selectedComponentId);
    else if (isSectionSelected && selectedSectionId) moveSectionUp(selectedSectionId);
  };
  const handleMoveDown = () => {
    if (isComponentSelected && selectedSectionId && selectedComponentId) moveComponentDown(selectedSectionId, selectedComponentId);
    else if (isSectionSelected && selectedSectionId) moveSectionDown(selectedSectionId);
  };
  const handleDuplicate = () => {
    if (isComponentSelected && selectedSectionId && selectedComponentId) duplicateComponent(selectedSectionId, selectedComponentId);
    else if (isSectionSelected && selectedSectionId) duplicateSection(selectedSectionId);
  };
  const handleDelete = () => {
    if (isComponentSelected && selectedSectionId && selectedComponentId) removeComponent(selectedSectionId, selectedComponentId);
    else if (isSectionSelected && selectedSectionId) removeSection(selectedSectionId);
  };
  const handleTogglePrimary = () => {
    if (isSectionSelected && selectedSectionId) {
      updateSection(selectedSectionId, { isPrimary: !isPrimary });
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as Node;
    if (frameRef.current?.contains(target) || controlsRef.current?.contains(target)) return;
    selectSection(null);
  };

  return (
    <div
      onClick={handleBackgroundClick}
      style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        width: '100%', height: '100%', padding: 20, gap: 16,
      }}>
      {/* Left column — primary section star */}
      <div style={{
        width: 30, position: 'relative',
        minHeight: 720,
      }}>
        {primaryStarTop !== null && (
          <div title="Primary section" style={{
            position: 'absolute',
            top: primaryStarTop,
            left: 0,
            transition: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-brand-subtle)',
            border: '1px solid rgba(229,77,77,0.3)',
          }}>
            <Star size={14} fill="var(--color-brand)" color="var(--color-brand)" />
          </div>
        )}
      </div>

      {/* Device frame */}
      <div ref={frameRef} style={{
        width: 375, minHeight: 720, maxHeight: 'calc(100vh - 160px)',
        background: '#000', borderRadius: 32, border: '8px solid #1a1a1a',
        position: 'relative', overflow: 'hidden', flexShrink: 0,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 25px 50px -12px rgba(0,0,0,0.8)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div ref={scrollRef} className="animate-in" style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          scrollbarWidth: 'none', padding: paddingToCss(message.theme.emailPadding), borderRadius: 24, ...bgStyle,
        }}>
          {headerSection && <SectionRenderer section={headerSection} />}
          {contentSections.map((s) => (
            <SectionWithInsert
              key={s.id}
              section={s}
              onInsertAbove={() => {
                const idx = message.sections.indexOf(s);
                addSection('content', idx);
              }}
              onInsertBelow={() => {
                const idx = message.sections.indexOf(s) + 1;
                addSection('content', idx);
              }}
            />
          ))}
          {contentSections.length === 0 && (
            <button onClick={() => addSection()} style={{
              margin: '8px 12px', padding: '32px 16px', background: 'transparent',
              border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 'var(--radius-lg)',
              color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)',
              cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 'var(--space-2)', fontFamily: 'var(--font-family)',
              transition: 'all var(--transition-normal)', width: 'calc(100% - 24px)',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(229,77,77,0.4)'; e.currentTarget.style.color = 'var(--color-text-brand)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--color-text-tertiary)'; }}
            >
              <Plus size={18} strokeWidth={1.5} />
              <span style={{ fontWeight: 500 }}>Add Section</span>
            </button>
          )}
          {footerSection && <SectionRenderer section={footerSection} />}
        </div>
      </div>

      {/* Right column — floating controls */}
      <div ref={controlsRef} style={{
        width: 50, display: 'flex', flexDirection: 'column', gap: 6,
        paddingTop: controlsTop,
        transition: 'opacity var(--transition-fast)',
        opacity: showControls ? 1 : 0, pointerEvents: showControls ? 'auto' : 'none',
      }}>
        <ControlButton icon={<ChevronUp size={18} />} onClick={handleMoveUp} title="Move up" disabled={!canMoveUp} />
        <ControlButton icon={<ChevronDown size={18} />} onClick={handleMoveDown} title="Move down" disabled={!canMoveDown} />
        <ControlButton icon={<Copy size={18} />} onClick={handleDuplicate} title="Duplicate" />
        <ControlButton icon={<Trash2 size={18} />} onClick={handleDelete} title="Delete" variant="delete" />
        {isSectionSelected && (
          <ControlButton
            icon={<Star size={18} fill={isPrimary ? 'currentColor' : 'none'} />}
            onClick={handleTogglePrimary}
            title={isPrimary ? 'Remove primary' : 'Set as primary'}
            variant={isPrimary ? 'primary' : 'default'}
          />
        )}
      </div>
    </div>
  );
};

const SectionWithInsert: React.FC<{
  section: Section;
  onInsertAbove: () => void;
  onInsertBelow: () => void;
}> = ({ section, onInsertAbove, onInsertBelow }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative' }}
    >
      {hovered && <AddSectionBtn position="top" onClick={onInsertAbove} />}
      <SectionRenderer section={section} />
      {hovered && <AddSectionBtn position="bottom" onClick={onInsertBelow} />}
    </div>
  );
};

const AddSectionBtn: React.FC<{ position: 'top' | 'bottom'; onClick: () => void }> = ({ position, onClick }) => {
  const [btnHovered, setBtnHovered] = useState(false);
  return (
    <div style={{
      position: 'absolute',
      left: 0,
      right: 0,
      [position === 'top' ? 'top' : 'bottom']: 0,
      transform: position === 'top' ? 'translateY(-50%)' : 'translateY(50%)',
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        height: 2,
        borderRadius: 1,
        background: 'var(--color-brand)',
        transition: 'opacity 0.15s ease',
        opacity: btnHovered ? 1 : 0.6,
      }} />
      <button
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        style={{
          position: 'relative',
          pointerEvents: 'auto',
          padding: '8px 16px',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-md)',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          border: 'none',
          fontFamily: 'var(--font-family)',
          background: btnHovered ? 'var(--color-brand-hover)' : 'var(--color-brand)',
          color: '#fff',
          boxShadow: btnHovered ? 'var(--shadow-brand)' : 'none',
        }}
      >
        <Plus size={14} strokeWidth={2} />
        Add Section
      </button>
    </div>
  );
};
