import React from 'react';
import { LayoutTemplate, Database } from 'lucide-react';
import { useMessageStore } from '../../store/messageStore';
import type { ComponentType } from '../../types/message';

interface SectionTemplate {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  components: ComponentType[];
}

const sectionTemplates: SectionTemplate[] = [
  {
    id: 'empty',
    icon: <LayoutTemplate size={18} />,
    label: 'Empty',
    description: 'Blank section',
    components: [],
  },
  {
    id: 'entity',
    icon: <Database size={18} />,
    label: 'Entity',
    description: 'Data-driven section',
    components: [],
  },
];

export function SectionPanel() {
  const addSection = useMessageStore((s) => s.addSection);
  const addComponent = useMessageStore((s) => s.addComponent);
  const selectSection = useMessageStore((s) => s.selectSection);
  const message = useMessageStore((s) => s.message);

  const handleAddTemplate = (template: SectionTemplate) => {
    addSection('content');

    const state = useMessageStore.getState();
    const newSectionId = state.selectedSectionId;
    if (!newSectionId) return;

    for (const compType of template.components) {
      addComponent(newSectionId, compType);
    }

    selectSection(newSectionId);
  };

  return (
    <div style={{ padding: 20 }}>
      {!message && (
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 12 }}>
          Create a message first.
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {sectionTemplates.map((template) => (
          <div
            key={template.id}
            className="mep-panel-item"
            role="button"
            tabIndex={0}
            data-disabled={!message || undefined}
            onClick={() => handleAddTemplate(template)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddTemplate(template);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 12,
              borderRadius: 12,
              border: '1px solid transparent',
              cursor: !message ? 'not-allowed' : 'pointer',
              opacity: !message ? 0.25 : 1,
            }}
          >
            <div
              data-icon-box
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'var(--color-bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-secondary)',
                transition: 'var(--transition-fast)',
              }}
            >
              {template.icon}
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-family)',
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--color-text-primary)',
              }}>
                {template.label}
              </div>
              <div style={{
                fontFamily: 'var(--font-family)',
                fontSize: 12,
                color: 'var(--color-text-secondary)',
              }}>
                {template.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
