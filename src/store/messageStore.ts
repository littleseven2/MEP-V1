import { v4 as uuid } from 'uuid';
import type {
  AppView,
  Message,
  MessageAttributes,
  Section,
  SectionType,
  MessageComponent,
  ComponentType,
  ThemeConfig,
  ComponentSettings,
} from '../types/message';
import { getDefaultComponentSettings } from '../data/defaults';

const DEFAULT_THEME: ThemeConfig = {
  id: 'default',
  name: 'Default',
  radius: '8px',
  colors: {
    primary: '#e50914',
    secondary: '#333',
    background: '#000',
    text: '#fff',
  },
  typography: {
    headlineFont: 'Netflix Sans',
    bodyFont: 'Netflix Sans',
  },
  spacing: 'normal',
  background: {
    type: 'solid',
    value: '#000000',
    opacity: 1,
  },
};

function createEmptySection(type: SectionType, order: number): Section {
  return {
    id: uuid(),
    type,
    isPrimary: type === 'content',
    hydration: {
      source: 'custom',
    },
    background: {
      type: 'solid',
      value: 'transparent',
      opacity: 1,
    },
    conditions: [],
    components: [],
    order,
  };
}

function createMessageWithDefaults(attributes: Partial<MessageAttributes>): Message {
  const now = new Date().toISOString();
  const header = createEmptySection('header', 0);
  const footer = createEmptySection('footer', 1);

  return {
    id: uuid(),
    attributes: {
      name: '',
      consentCategory: '',
      messageProgram: '',
      cadence: 'temporal',
      messageType: '',
      sendDate: '',
      channel: 'email',
      ...attributes,
    },
    theme: { ...DEFAULT_THEME },
    sections: [header, footer],
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

interface MessageStore {
  view: AppView;
  setView: (view: AppView) => void;
  message: Message | null;
  selectedSectionId: string | null;
  selectedComponentId: string | null;

  createMessage: (attributes?: Partial<MessageAttributes>) => void;
  updateAttributes: (attrs: Partial<MessageAttributes>) => void;
  setTheme: (theme: ThemeConfig) => void;

  addSection: (type?: SectionType) => void;
  updateSection: (sectionId: string, updates: Partial<Section>) => void;
  removeSection: (sectionId: string) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  selectSection: (sectionId: string | null) => void;
  moveSectionUp: (sectionId: string) => void;
  moveSectionDown: (sectionId: string) => void;
  duplicateSection: (sectionId: string) => void;

  addComponent: (sectionId: string, type: ComponentType) => void;
  updateComponent: (sectionId: string, componentId: string, updates: Partial<MessageComponent>) => void;
  updateComponentSettings: (sectionId: string, componentId: string, settings: ComponentSettings) => void;
  removeComponent: (sectionId: string, componentId: string) => void;
  reorderComponents: (sectionId: string, fromIndex: number, toIndex: number) => void;
  selectComponent: (componentId: string | null, sectionId?: string) => void;
  moveComponentUp: (sectionId: string, componentId: string) => void;
  moveComponentDown: (sectionId: string, componentId: string) => void;
  duplicateComponent: (sectionId: string, componentId: string) => void;

  duplicateMessage: (message: Message) => void;
}

import { create } from 'zustand';

export const useMessageStore = create<MessageStore>((set) =>
    ({
      view: 'home' as AppView,
      setView: (view) => set(() => ({ view })),

      message: null,
      selectedSectionId: null,
      selectedComponentId: null,

      createMessage: (attributes = {}) =>
        set(() => {
          const message = createMessageWithDefaults(attributes);
          return {
            message,
            view: 'builder' as AppView,
            selectedSectionId: null,
            selectedComponentId: null,
          };
        }),

      updateAttributes: (attrs) =>
        set((state) => {
          if (!state.message) return {};
          return {
            message: {
              ...state.message,
              attributes: { ...state.message.attributes, ...attrs },
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      setTheme: (theme) =>
        set((state) => {
          if (!state.message) return {};
          return {
            message: {
              ...state.message,
              theme: { ...theme },
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      addSection: (type = 'content') =>
        set((state) => {
          if (!state.message) return {};
          const sections = [...state.message.sections];
          const footerIndex = sections.findIndex((s) => s.type === 'footer');
          const insertIndex = footerIndex >= 0 ? footerIndex : sections.length;
          const newSection = createEmptySection(type, insertIndex);
          const alreadyHasPrimary = sections.some((s) => s.type === 'content' && s.isPrimary);
          if (alreadyHasPrimary) newSection.isPrimary = false;
          sections.splice(insertIndex, 0, newSection);
          sections.forEach((s, i) => (s.order = i));
          return {
            message: { ...state.message, sections },
            selectedSectionId: newSection.id,
            selectedComponentId: null,
          };
        }),

      updateSection: (sectionId, updates) =>
        set((state) => {
          if (!state.message) return {};
          let sections = state.message.sections.map((s) =>
            s.id === sectionId ? { ...s, ...updates } : s
          );
          if (updates.isPrimary) {
            sections = sections.map((s) =>
              s.id !== sectionId && s.type === 'content' ? { ...s, isPrimary: false } : s
            );
          }
          return { message: { ...state.message, sections } };
        }),

      removeSection: (sectionId) =>
        set((state) => {
          if (!state.message) return {};
          const section = state.message.sections.find((s) => s.id === sectionId);
          if (!section || section.type === 'header' || section.type === 'footer') return {};
          const sections = state.message.sections.filter((s) => s.id !== sectionId);
          sections.forEach((s, i) => (s.order = i));
          return {
            message: { ...state.message, sections },
            selectedSectionId: state.selectedSectionId === sectionId ? null : state.selectedSectionId,
          };
        }),

      reorderSections: (fromIndex, toIndex) =>
        set((state) => {
          if (!state.message) return {};
          const sections = [...state.message.sections];
          const [removed] = sections.splice(fromIndex, 1);
          sections.splice(toIndex, 0, removed);
          sections.forEach((s, i) => (s.order = i));
          return { message: { ...state.message, sections } };
        }),

      selectSection: (sectionId) =>
        set(() => ({
          selectedSectionId: sectionId,
          selectedComponentId: null,
        })),

      moveSectionUp: (sectionId) =>
        set((state) => {
          if (!state.message) return {};
          const sections = [...state.message.sections];
          const idx = sections.findIndex((s) => s.id === sectionId);
          if (idx <= 0) return {};
          const prev = sections[idx - 1];
          if (prev.type === 'header' || prev.type === 'footer') return {};
          [sections[idx - 1], sections[idx]] = [sections[idx], sections[idx - 1]];
          sections.forEach((s, i) => (s.order = i));
          return { message: { ...state.message, sections } };
        }),

      moveSectionDown: (sectionId) =>
        set((state) => {
          if (!state.message) return {};
          const sections = [...state.message.sections];
          const idx = sections.findIndex((s) => s.id === sectionId);
          if (idx < 0 || idx >= sections.length - 1) return {};
          const next = sections[idx + 1];
          if (next.type === 'header' || next.type === 'footer') return {};
          [sections[idx], sections[idx + 1]] = [sections[idx + 1], sections[idx]];
          sections.forEach((s, i) => (s.order = i));
          return { message: { ...state.message, sections } };
        }),

      duplicateSection: (sectionId) =>
        set((state) => {
          if (!state.message) return {};
          const section = state.message.sections.find((s) => s.id === sectionId);
          if (!section || section.type === 'header' || section.type === 'footer') return {};
          const sections = [...state.message.sections];
          const footerIndex = sections.findIndex((s) => s.type === 'footer');
          const insertIndex = footerIndex >= 0 ? footerIndex : sections.length;
          const newSection: Section = {
            ...JSON.parse(JSON.stringify(section)),
            id: uuid(),
            components: section.components.map((c) => ({
              ...JSON.parse(JSON.stringify(c)),
              id: uuid(),
            })),
            order: insertIndex,
          };
          sections.splice(insertIndex, 0, newSection);
          sections.forEach((s, i) => (s.order = i));
          return {
            message: { ...state.message, sections },
            selectedSectionId: newSection.id,
            selectedComponentId: null,
          };
        }),

      addComponent: (sectionId, type) =>
        set((state) => {
          if (!state.message) return {};
          const sections = state.message.sections.map((s) => {
            if (s.id !== sectionId) return s;
            const settings = getDefaultComponentSettings(type);
            const newComponent: MessageComponent = {
              id: uuid(),
              type,
              settings,
              attachments: [],
              order: s.components.length,
            };
            return {
              ...s,
              components: [...s.components, newComponent],
            };
          });
          const section = sections.find((s) => s.id === sectionId);
          const newComp = section?.components[section.components.length - 1];
          return {
            message: { ...state.message, sections },
            selectedComponentId: newComp?.id ?? null,
          };
        }),

      updateComponent: (sectionId, componentId, updates) =>
        set((state) => {
          if (!state.message) return {};
          const sections = state.message.sections.map((s) => {
            if (s.id !== sectionId) return s;
            return {
              ...s,
              components: s.components.map((c) =>
                c.id === componentId ? { ...c, ...updates } : c
              ),
            };
          });
          return { message: { ...state.message, sections } };
        }),

      updateComponentSettings: (sectionId, componentId, settings) =>
        set((state) => {
          if (!state.message) return {};
          const sections = state.message.sections.map((s) => {
            if (s.id !== sectionId) return s;
            return {
              ...s,
              components: s.components.map((c) =>
                c.id === componentId ? { ...c, settings } : c
              ),
            };
          });
          return { message: { ...state.message, sections } };
        }),

      removeComponent: (sectionId, componentId) =>
        set((state) => {
          if (!state.message) return {};
          const sections = state.message.sections.map((s) => {
            if (s.id !== sectionId) return s;
            const components = s.components.filter((c) => c.id !== componentId);
            components.forEach((c, i) => (c.order = i));
            return { ...s, components };
          });
          return {
            message: { ...state.message, sections },
            selectedComponentId: state.selectedComponentId === componentId ? null : state.selectedComponentId,
          };
        }),

      reorderComponents: (sectionId, fromIndex, toIndex) =>
        set((state) => {
          if (!state.message) return {};
          const sections = state.message.sections.map((s) => {
            if (s.id !== sectionId) return s;
            const components = [...s.components];
            const [removed] = components.splice(fromIndex, 1);
            components.splice(toIndex, 0, removed);
            components.forEach((c, i) => (c.order = i));
            return { ...s, components };
          });
          return { message: { ...state.message, sections } };
        }),

      selectComponent: (componentId, sectionId) =>
        set((state) => ({
          selectedComponentId: componentId,
          selectedSectionId: sectionId ?? state.selectedSectionId,
        })),

      moveComponentUp: (sectionId, componentId) =>
        set((state) => {
          if (!state.message) return {};
          const section = state.message.sections.find((s) => s.id === sectionId);
          if (!section) return {};
          const idx = section.components.findIndex((c) => c.id === componentId);
          if (idx <= 0) return {};
          const sections = state.message.sections.map((s) => {
            if (s.id !== sectionId) return s;
            const components = [...s.components];
            [components[idx - 1], components[idx]] = [components[idx], components[idx - 1]];
            components.forEach((c, i) => (c.order = i));
            return { ...s, components };
          });
          return { message: { ...state.message, sections } };
        }),

      moveComponentDown: (sectionId, componentId) =>
        set((state) => {
          if (!state.message) return {};
          const section = state.message.sections.find((s) => s.id === sectionId);
          if (!section) return {};
          const idx = section.components.findIndex((c) => c.id === componentId);
          if (idx < 0 || idx >= section.components.length - 1) return {};
          const sections = state.message.sections.map((s) => {
            if (s.id !== sectionId) return s;
            const components = [...s.components];
            [components[idx], components[idx + 1]] = [components[idx + 1], components[idx]];
            components.forEach((c, i) => (c.order = i));
            return { ...s, components };
          });
          return { message: { ...state.message, sections } };
        }),

      duplicateComponent: (sectionId, componentId) =>
        set((state) => {
          if (!state.message) return {};
          const sections = state.message.sections.map((s) => {
            if (s.id !== sectionId) return s;
            const comp = s.components.find((c) => c.id === componentId);
            if (!comp) return s;
            const newComp: MessageComponent = {
              ...JSON.parse(JSON.stringify(comp)),
              id: uuid(),
              order: s.components.length,
            };
            return {
              ...s,
              components: [...s.components, newComp],
            };
          });
          const section = sections.find((s) => s.id === sectionId);
          const newComp = section?.components[section.components.length - 1];
          return {
            message: { ...state.message, sections },
            selectedComponentId: newComp?.id ?? null,
          };
        }),

      duplicateMessage: (message) =>
        set(() => {
          const dup: Message = {
            ...JSON.parse(JSON.stringify(message)),
            id: uuid(),
            sections: message.sections.map((sec) => ({
              ...JSON.parse(JSON.stringify(sec)),
              id: uuid(),
              components: sec.components.map((c) => ({
                ...JSON.parse(JSON.stringify(c)),
                id: uuid(),
              })),
            })),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return {
            message: dup,
            view: 'builder' as AppView,
            selectedSectionId: null,
            selectedComponentId: null,
          };
        }),
    } satisfies MessageStore
));
