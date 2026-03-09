import React, { useState, useCallback } from 'react';
import {
  Eye, Settings, Layers, Palette,
  Sparkles, Send, Undo2, Redo2, Component,
} from 'lucide-react';
import { useMessageStore } from '../../store/messageStore';
import { Canvas } from '../canvas/Canvas';
import { ComponentPalette } from '../sidebar/ComponentPalette';
import { PropertiesPanel } from '../sidebar/PropertiesPanel';
import { ThemePanel, ThemePropertiesPanel, useThemeManager } from '../sidebar/ThemePanel';
import { SectionPanel } from '../sidebar/SectionPanel';
import { EmailPreview } from '../preview/EmailPreview';

type LeftNav = 'theme' | 'section' | 'component';

export const BuilderLayout: React.FC = () => {
  const { message, setView, selectSection, selectedSectionId, selectedComponentId } = useMessageStore();
  const [leftNav, setLeftNav] = useState<LeftNav>('component');
  const [showPreview, setShowPreview] = useState(false);

  const themeManager = useThemeManager();

  const handleCanvasAreaClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) selectSection(null);
  }, [selectSection]);

  if (!message) return null;

  if (showPreview) {
    return <EmailPreview onClose={() => setShowPreview(false)} />;
  }

  const selectedSection = message.sections.find((s) => s.id === selectedSectionId);
  const hasComponentSelected = !!selectedComponentId && !!selectedSection?.components.find((c) => c.id === selectedComponentId);

  const getRightPanelTitle = () => {
    if (hasComponentSelected) {
      const comp = selectedSection?.components.find((c) => c.id === selectedComponentId);
      if (comp) {
        const labels: Record<string, string> = {
          'text-block': 'Text Block',
          'rich-text': 'Rich Text',
          'media': 'Media',
          'cta': 'CTA',
          'grid': 'Grid',
          'list': 'List',
        };
        return labels[comp.type] || 'Component Properties';
      }
      return 'Component Properties';
    }
    if (selectedSectionId && selectedSection?.type === 'content') return 'Section Properties';
    return 'Theme Properties';
  };

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
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '12px 20px',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, var(--color-brand) 0%, #FF6B6B 100%)',
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={16} color="#fff" />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 'var(--font-size-xl)',
            color: 'var(--color-text-primary)',
          }}>
            MEP
          </span>
          <div style={{ width: 1, height: 24, background: 'var(--color-border-default)', margin: '0 4px' }} />
          <span style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
            {message.attributes.name || 'Untitled'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <NavButton icon={<Undo2 size={16} />} tooltip="Undo" />
          <NavButton icon={<Redo2 size={16} />} tooltip="Redo" />
        </div>

        <div style={{ display: 'flex', gap: 8, justifySelf: 'end' }}>
          <HeaderBtn icon={<Eye size={14} />} label="Preview" onClick={() => setShowPreview(true)} />
          <HeaderBtn icon={<Send size={14} />} label="Save" primary onClick={() => {}} />
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '60px 240px 1fr 300px',
        gap: 12,
        overflow: 'hidden',
      }}>
        {/* Vertical Nav */}
        <div style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 16,
          padding: '12px 8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          boxShadow: 'var(--shadow-md)',
        }}>
          <VerticalNavItem icon={<Palette size={18} />} label="Theme" active={leftNav === 'theme'} onClick={() => setLeftNav('theme')} />
          <VerticalNavItem icon={<Layers size={18} />} label="Section" active={leftNav === 'section'} onClick={() => setLeftNav('section')} />
          <VerticalNavItem icon={<Component size={18} />} label="Component" active={leftNav === 'component'} onClick={() => setLeftNav('component')} />
          <div style={{ flex: 1 }} />
          <VerticalNavItem icon={<Settings size={18} />} label="Setup" active={false} onClick={() => setView('setup')} />
        </div>

        {/* Left Panel — Library */}
        <div style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            padding: '18px 20px 14px',
            borderBottom: '1px solid var(--color-border-default)',
            fontSize: 14,
            fontWeight: 500,
            textTransform: 'none',
            letterSpacing: '-0.01em',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-display)',
          }}>
            {leftNav === 'theme' ? 'Theme' : leftNav === 'section' ? 'Section' : 'Component'}
          </div>
          <div style={{ flex: 1, overflow: 'auto', scrollbarWidth: 'none' }}>
            {leftNav === 'theme' && (
              <ThemePanel
                themes={themeManager.themes}
                activeThemeId={themeManager.activeThemeId}
                onSelect={themeManager.selectTheme}
                onDelete={themeManager.deleteTheme}
                onDuplicate={themeManager.duplicateTheme}
                onCreate={themeManager.createNewTheme}
              />
            )}
            {leftNav === 'section' && <SectionPanel />}
            {leftNav === 'component' && <ComponentPalette />}
          </div>
        </div>

        {/* Canvas Area */}
        <div
          onClick={handleCanvasAreaClick}
          style={{
            background: 'var(--color-bg-tertiary)',
            borderRadius: 16,
            border: '1px solid var(--color-border-default)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-border-default) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}>
          <Canvas />
        </div>

        {/* Right Panel — Properties (driven by canvas selection) */}
        <div style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            padding: '18px 20px 14px',
            borderBottom: '1px solid var(--color-border-default)',
            fontSize: 14,
            fontWeight: 500,
            textTransform: 'none',
            letterSpacing: '-0.01em',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-display)',
          }}>
            {getRightPanelTitle()}
          </div>
          <div style={{ flex: 1, overflow: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'var(--color-border-default) transparent' }}>
            {hasComponentSelected ? (
              <PropertiesPanel mode="component" />
            ) : selectedSectionId && selectedSection?.type === 'content' ? (
              <PropertiesPanel mode="section" />
            ) : (
              <ThemePropertiesPanel
                theme={themeManager.activeTheme}
                onUpdate={(updates) => themeManager.updateTheme(themeManager.activeThemeId, updates)}
              />
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

const VerticalNavItem: React.FC<{
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void;
}> = ({ icon, label, active, onClick }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 44, height: 44,
        borderRadius: 'var(--radius-lg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        color: active ? '#fff' : hovered ? 'var(--color-text-secondary)' : 'var(--color-text-tertiary)',
        background: active ? 'var(--color-brand)' : hovered ? 'var(--color-bg-tertiary)' : 'transparent',
        position: 'relative',
      }}
    >
      {icon}
      {active && <div style={{ position: 'absolute', right: -8, width: 3, height: 20, background: 'var(--color-brand)', borderRadius: 2 }} />}
      {hovered && !active && (
        <div style={{
          position: 'absolute', left: 54,
          background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)',
          padding: '6px 10px', borderRadius: 'var(--radius-sm)',
          fontSize: 'var(--font-size-sm)', fontWeight: 500, whiteSpace: 'nowrap',
          border: '1px solid var(--color-border-default)', zIndex: 100, pointerEvents: 'none',
        }}>{label}</div>
      )}
    </div>
  );
};

const NavButton: React.FC<{ icon: React.ReactNode; tooltip: string }> = ({ icon, tooltip }) => {
  const [h, setH] = React.useState(false);
  return (
    <button onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} title={tooltip} style={{
      width: 36, height: 36,
      background: h ? 'var(--color-bg-tertiary)' : 'transparent',
      border: '1px solid transparent', borderRadius: 'var(--radius-md)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', color: h ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
      transition: 'all var(--transition-fast)',
    }}>{icon}</button>
  );
};

const HeaderBtn: React.FC<{
  icon: React.ReactNode; label: string; onClick: () => void; primary?: boolean;
}> = ({ icon, label, onClick, primary }) => {
  const [h, setH] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      padding: '8px 16px', borderRadius: 'var(--radius-md)',
      fontSize: 'var(--font-size-md)', fontWeight: 500, cursor: 'pointer',
      transition: 'all var(--transition-fast)',
      display: 'flex', alignItems: 'center', gap: 6,
      border: primary ? 'none' : '1px solid var(--color-border-default)',
      fontFamily: 'var(--font-family)',
      ...(primary ? {
        background: h ? 'var(--color-brand-hover)' : 'var(--color-brand)', color: '#fff',
        boxShadow: h ? 'var(--shadow-brand)' : 'none',
      } : {
        background: h ? 'var(--color-bg-hover)' : 'var(--color-bg-tertiary)',
        color: h ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
        borderColor: h ? 'var(--color-border-strong)' : 'var(--color-border-default)',
      }),
    }}>{icon}{label}</button>
  );
};

export { BuilderLayout as default };
