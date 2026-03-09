import { useState, useRef, useEffect } from 'react';
import { Link2, Unlink2, ChevronDown } from 'lucide-react';
import type { VariableDefinition } from '../types/variables';
import type { LinkedValue } from '../types/message';

const typeIcons: Record<VariableDefinition['valueType'], string> = {
  text: 'T',
  color: '◆',
  number: '#',
  url: '⌘',
};

function useClickOutside(ref: React.RefObject<HTMLDivElement | null>, onClose: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [active, ref, onClose]);
}

function VariablePicker({
  groups,
  onSelect,
  activeKey,
}: {
  groups: Record<string, VariableDefinition[]>;
  onSelect: (v: VariableDefinition) => void;
  activeKey?: string;
}) {
  return (
    <div style={{
      position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
      background: 'var(--color-bg-tertiary)',
      border: '1px solid var(--color-border-default)',
      borderRadius: 8, overflow: 'hidden', zIndex: 1000,
      boxShadow: 'var(--shadow-lg)',
      maxHeight: 240, overflowY: 'auto',
      scrollbarWidth: 'thin',
      scrollbarColor: 'var(--color-border-default) transparent',
    }}>
      {Object.entries(groups).map(([group, vars]) => (
        <div key={group}>
          <div style={{
            padding: '8px 10px 4px',
            fontSize: 10, fontWeight: 600,
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            {group}
          </div>
          {vars.map((v) => (
            <button
              key={v.key}
              type="button"
              onClick={() => onSelect(v)}
              className="mep-toolbar-btn"
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 10px', border: 'none',
                background: v.key === activeKey ? 'rgba(229, 9, 20, 0.1)' : 'transparent',
                color: v.key === activeKey ? '#E50914' : 'var(--color-text-primary)',
                fontFamily: 'var(--font-family)', fontSize: 12,
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span style={{
                width: 18, height: 18, borderRadius: 3,
                background: v.key === activeKey ? 'rgba(229, 9, 20, 0.2)' : 'rgba(255,255,255,0.06)',
                color: v.key === activeKey ? '#E50914' : 'var(--color-text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700, flexShrink: 0,
              }}>
                {typeIcons[v.valueType]}
              </span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {v.label}
              </span>
              {v.preview && (
                <span style={{
                  fontSize: 10, color: 'var(--color-text-muted)',
                  maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {v.preview}
                </span>
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

function LinkedChip({
  activeVar,
  linked,
  pickerOpen,
  onTogglePicker,
  onDetach,
  groups,
  onSelect,
}: {
  activeVar: VariableDefinition;
  linked: LinkedValue;
  pickerOpen: boolean;
  onTogglePicker: () => void;
  onDetach: () => void;
  groups: Record<string, VariableDefinition[]>;
  onSelect: (v: VariableDefinition) => void;
}) {
  const [hoverDetach, setHoverDetach] = useState(false);
  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', height: 36, borderRadius: 8,
        background: 'var(--color-bg-tertiary)',
        border: '1px solid var(--color-border-default)',
        overflow: 'hidden',
        transition: 'var(--transition-fast)',
      }}>
        <button
          type="button"
          onClick={onTogglePicker}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 6,
            padding: '0 8px', height: '100%',
            background: 'transparent', border: 'none',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-family)', fontSize: 12,
            cursor: 'pointer', overflow: 'hidden',
            minWidth: 0,
          }}
        >
          <span style={{
            width: 20, height: 20, borderRadius: 4,
            background: 'rgba(229, 9, 20, 0.15)',
            color: '#E50914',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700, flexShrink: 0,
          }}>
            {typeIcons[activeVar.valueType]}
          </span>
          <span style={{
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            opacity: 0.85,
          }}>
            {activeVar.label}
          </span>
          <ChevronDown size={12} style={{ opacity: 0.4, flexShrink: 0, marginLeft: 'auto' }} />
        </button>
        <button
          type="button"
          onClick={onDetach}
          onMouseEnter={() => setHoverDetach(true)}
          onMouseLeave={() => setHoverDetach(false)}
          title="Detach variable"
          style={{
            width: 32, height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: hoverDetach ? 'rgba(255,255,255,0.06)' : 'transparent',
            border: 'none', borderLeft: '1px solid var(--color-border-default)',
            color: hoverDetach ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            cursor: 'pointer', flexShrink: 0,
            transition: 'var(--transition-fast)',
          }}
        >
          <Unlink2 size={13} />
        </button>
      </div>
      {pickerOpen && <VariablePicker groups={groups} onSelect={onSelect} activeKey={linked.variableKey} />}
    </>
  );
}

function LinkButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Link to variable"
      style={{
        width: 28, height: 28, borderRadius: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent',
        border: '1px solid var(--color-border-default)',
        color: 'var(--color-text-muted)',
        cursor: 'pointer', flexShrink: 0,
        transition: 'var(--transition-fast)',
        padding: 0,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)'; e.currentTarget.style.borderColor = 'var(--color-border-strong)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-border-default)'; }}
    >
      <Link2 size={12} />
    </button>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  fontFamily: 'var(--font-display)',
  color: 'var(--color-text-secondary)',
  marginBottom: 4,
};

// --- LinkedField: for text and color inputs ---

interface LinkedFieldProps {
  label?: string;
  value: string;
  linked?: LinkedValue;
  onChange: (value: string) => void;
  onLink: (linked: LinkedValue) => void;
  variables: VariableDefinition[];
  placeholder?: string;
  type?: 'text' | 'color';
}

export function LinkedField({
  label,
  value,
  linked,
  onChange,
  onLink,
  variables,
  placeholder,
  type = 'text',
}: LinkedFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isLinked = linked?.mode === 'linked' && linked.variableKey;
  const activeVar = isLinked ? variables.find((v) => v.key === linked.variableKey) : undefined;

  useClickOutside(containerRef, () => setPickerOpen(false), pickerOpen);

  const groups = variables.reduce<Record<string, VariableDefinition[]>>((acc, v) => {
    (acc[v.group] ??= []).push(v);
    return acc;
  }, {});

  const handleSelect = (variable: VariableDefinition) => {
    onLink({ mode: 'linked', variableKey: variable.key });
    if (variable.preview) onChange(variable.preview);
    setPickerOpen(false);
  };

  if (isLinked && activeVar) {
    return (
      <div ref={containerRef} style={{ position: 'relative' }}>
        {label && <label style={labelStyle}>{label}</label>}
        <LinkedChip
          activeVar={activeVar}
          linked={linked}
          pickerOpen={pickerOpen}
          onTogglePicker={() => setPickerOpen(!pickerOpen)}
          onDetach={() => onLink({ mode: 'custom', customValue: value })}
          groups={groups}
          onSelect={handleSelect}
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 0,
        height: 36, borderRadius: 8,
        background: 'var(--color-bg-tertiary)',
        border: '1px solid var(--color-border-default)',
        overflow: 'hidden',
        transition: 'var(--transition-fast)',
      }}>
        {type === 'color' && (
          <input
            type="color"
            className="mep-color-picker"
            value={value === 'transparent' ? '#000000' : value}
            onChange={(e) => onChange(e.target.value)}
            style={{ marginLeft: 0 }}
          />
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (linked?.mode === 'linked') onLink({ mode: 'custom', customValue: e.target.value });
          }}
          placeholder={placeholder}
          className="mep-input"
          style={{
            flex: 1, height: '100%', border: 'none', background: 'transparent',
            color: 'var(--color-text-primary)', fontFamily: 'var(--font-family)',
            fontSize: 13, padding: '0 8px', outline: 'none', minWidth: 0,
          }}
        />
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          title="Link to variable"
          style={{
            width: 32, height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none',
            borderLeft: '1px solid var(--color-border-default)',
            color: 'var(--color-text-muted)',
            cursor: 'pointer', flexShrink: 0,
            transition: 'var(--transition-fast)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <Link2 size={13} />
        </button>
      </div>
      {pickerOpen && <VariablePicker groups={groups} onSelect={handleSelect} activeKey={linked?.variableKey} />}
    </div>
  );
}

// --- LinkedWrapper: wraps any control (select, toggle, stepper, etc.) ---

interface LinkedWrapperProps {
  label?: string;
  linked?: LinkedValue;
  onLink: (linked: LinkedValue) => void;
  variables: VariableDefinition[];
  currentValue?: string;
  onValueFromVariable?: (preview: string) => void;
  children: React.ReactNode;
}

export function LinkedWrapper({
  label,
  linked,
  onLink,
  variables,
  currentValue,
  onValueFromVariable,
  children,
}: LinkedWrapperProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isLinked = linked?.mode === 'linked' && linked.variableKey;
  const activeVar = isLinked ? variables.find((v) => v.key === linked.variableKey) : undefined;

  useClickOutside(containerRef, () => setPickerOpen(false), pickerOpen);

  const groups = variables.reduce<Record<string, VariableDefinition[]>>((acc, v) => {
    (acc[v.group] ??= []).push(v);
    return acc;
  }, {});

  const handleSelect = (variable: VariableDefinition) => {
    onLink({ mode: 'linked', variableKey: variable.key });
    if (variable.preview && onValueFromVariable) onValueFromVariable(variable.preview);
    setPickerOpen(false);
  };

  if (isLinked && activeVar) {
    return (
      <div ref={containerRef} style={{ position: 'relative' }}>
        {label && <label style={labelStyle}>{label}</label>}
        <LinkedChip
          activeVar={activeVar}
          linked={linked}
          pickerOpen={pickerOpen}
          onTogglePicker={() => setPickerOpen(!pickerOpen)}
          onDetach={() => onLink({ mode: 'custom', customValue: currentValue })}
          groups={groups}
          onSelect={handleSelect}
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {children}
        </div>
        <LinkButton onClick={() => setPickerOpen(true)} />
      </div>
      {pickerOpen && <VariablePicker groups={groups} onSelect={handleSelect} activeKey={linked?.variableKey} />}
    </div>
  );
}
