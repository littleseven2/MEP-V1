import React, { useState } from 'react';
import {
  ArrowLeft, Eye, Save, Settings, Layers, Palette,
  LayoutGrid, Sparkles, Send, Undo2, Redo2,
} from 'lucide-react';
import { useMessageStore } from '../../store/messageStore';
import { Canvas } from '../canvas/Canvas';
import { ComponentPalette } from '../sidebar/ComponentPalette';
import { PropertiesPanel } from '../sidebar/PropertiesPanel';
import { ThemePanel } from '../sidebar/ThemePanel';
import { EmailPreview } from '../preview/EmailPreview';

type LeftNav = 'components' | 'layers';
type RightNav = 'properties' | 'theme';

export const BuilderLayout: React.FC = () => {
  const { message, setView } = useMessageStore();
  const [leftNav, setLeftNav] = useState<LeftNav>('components');
  const [rightTab, setRightTab] = useState<RightNav>('properties');
  const [showPreview, setShowPreview] = useState(false);

  if (!message) return null;

  if (showPreview) {
    return <EmailPreview onClose={() => setShowPreview(false)} />;
  }

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
          <HeaderBtn icon={<Settings size={14} />} label="Settings" onClick={() => setView('setup')} />
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
          <VerticalNavItem icon={<LayoutGrid size={18} />} label="Components" active={leftNav === 'components'} onClick={() => setLeftNav('components')} />
          <VerticalNavItem icon={<Layers size={18} />} label="Layers" active={leftNav === 'layers'} onClick={() => setLeftNav('layers')} />
          <div style={{ width: 28, height: 1, background: 'var(--color-border-default)', margin: '8px 0' }} />
          <VerticalNavItem icon={<ArrowLeft size={18} />} label="Back" active={false} onClick={() => setView('home')} />
          <div style={{ flex: 1 }} />
        </div>

        {/* Left Panel */}
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
            padding: '16px 20px 12px',
            borderBottom: '1px solid var(--color-border-default)',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 'var(--letter-spacing-wide)',
            color: 'var(--color-text-tertiary)',
            fontFamily: 'var(--font-display)',
          }}>
            {leftNav === 'components' ? 'Components' : 'Layers'}
          </div>
          <div style={{ flex: 1, overflow: 'auto', scrollbarWidth: 'none' }}>
            <ComponentPalette />
          </div>
        </div>

        {/* Canvas Area */}
        <div style={{
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

        {/* Right Panel */}
        <div style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border-default)' }}>
            <PanelTab active={rightTab === 'properties'} icon={<Layers size={13} />} label="Properties" onClick={() => setRightTab('properties')} />
            <PanelTab active={rightTab === 'theme'} icon={<Palette size={13} />} label="Theme" onClick={() => setRightTab('theme')} />
          </div>
          <div style={{ flex: 1, overflow: 'auto', scrollbarWidth: 'none' }}>
            {rightTab === 'properties' ? <PropertiesPanel /> : <ThemePanel />}
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

const PanelTab: React.FC<{
  active: boolean; icon: React.ReactNode; label: string; onClick: () => void;
}> = ({ active, icon, label, onClick }) => {
  const [h, setH] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      padding: '12px 16px', background: 'none', border: 'none',
      borderBottom: `2px solid ${active ? 'var(--color-brand)' : 'transparent'}`,
      color: active ? 'var(--color-text-primary)' : h ? 'var(--color-text-secondary)' : 'var(--color-text-tertiary)',
      fontSize: 'var(--font-size-sm)', fontWeight: 500, fontFamily: 'var(--font-display)',
      cursor: 'pointer', transition: 'all var(--transition-fast)',
    }}>{icon}{label}</button>
  );
};

export { BuilderLayout as default };
