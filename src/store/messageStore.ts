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
  AttachmentKey,
} from '../types/message';
import { computeSectionItemOrder, isAttachmentKey } from '../types/message';
import { getDefaultComponentSettings, defaultTextStyles } from '../data/defaults';

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
    textStyles: { ...defaultTextStyles },
  },
  spacing: 'normal',
  emailPadding: 0,
  sectionPadding: 16,
  componentPadding: 0,
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
    padding: 0,
    backgroundRadius: [0, 0, 0, 0],
    strokeColor: 'transparent',
    strokeWidth: 0,
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
  viewHistory: AppView[];
  viewFuture: AppView[];
  setView: (view: AppView) => void;
  goBack: () => void;
  goForward: () => void;
  message: Message | null;
  selectedSectionId: string | null;
  selectedComponentId: string | null;

  _undoStack: Message[];
  _redoStack: Message[];
  undo: () => void;
  redo: () => void;

  createMessage: (attributes?: Partial<MessageAttributes>) => void;
  updateAttributes: (attrs: Partial<MessageAttributes>) => void;
  setTheme: (theme: ThemeConfig) => void;

  addSection: (type?: SectionType, insertAtIndex?: number) => void;
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
  reorderSectionItems: (sectionId: string, newOrder: string[]) => void;
  reorderComponentItems: (sectionId: string, componentId: string, newOrder: string[]) => void;
  selectComponent: (componentId: string | null, sectionId?: string) => void;
  moveComponentUp: (sectionId: string, componentId: string) => void;
  moveComponentDown: (sectionId: string, componentId: string) => void;
  duplicateComponent: (sectionId: string, componentId: string) => void;

  duplicateMessage: (message: Message) => void;
}

import { create } from 'zustand';

const MAX_UNDO = 50;
let _skipUndo = false;

export const useMessageStore = create<MessageStore>((rawSet, get) => {
  const set: typeof rawSet = (partial) => {
    if (typeof partial === 'function') {
      rawSet((state) => {
        const result = (partial as (s: MessageStore) => Partial<MessageStore>)(state);
        if (!_skipUndo && result.message && state.message && result.message !== state.message) {
          const stack = [...state._undoStack, state.message];
          if (stack.length > MAX_UNDO) stack.shift();
          return { ...result, _undoStack: stack, _redoStack: [] };
        }
        return result;
      });
    } else {
      rawSet(partial);
    }
  };

  return {
      view: 'home' as AppView,
      viewHistory: [] as AppView[],
      viewFuture: [] as AppView[],
      _undoStack: [] as Message[],
      _redoStack: [] as Message[],
      setView: (view) => set((state) => ({
        viewHistory: [...state.viewHistory, state.view],
        viewFuture: [],
        view,
      })),
      goBack: () => set((state) => {
        if (state.viewHistory.length === 0) return {};
        const history = [...state.viewHistory];
        const prev = history.pop()!;
        return { view: prev, viewHistory: history, viewFuture: [state.view, ...state.viewFuture] };
      }),
      goForward: () => set((state) => {
        if (state.viewFuture.length === 0) return {};
        const future = [...state.viewFuture];
        const next = future.shift()!;
        return { view: next, viewHistory: [...state.viewHistory, state.view], viewFuture: future };
      }),

      undo: () => {
        const state = get();
        if (state._undoStack.length === 0 || !state.message) return;
        const stack = [...state._undoStack];
        const prev = stack.pop()!;
        _skipUndo = true;
        rawSet({ message: prev, _undoStack: stack, _redoStack: [state.message, ...state._redoStack] });
        _skipUndo = false;
      },
      redo: () => {
        const state = get();
        if (state._redoStack.length === 0 || !state.message) return;
        const future = [...state._redoStack];
        const next = future.shift()!;
        _skipUndo = true;
        rawSet({ message: next, _undoStack: [...state._undoStack, state.message], _redoStack: future });
        _skipUndo = false;
      },

      message: null,
      selectedSectionId: null,
      selectedComponentId: null,

      createMessage: (attributes = {}) =>
        set((state) => {
          const message = createMessageWithDefaults(attributes);
          return {
            message,
            view: 'builder' as AppView,
            viewHistory: [...state.viewHistory, state.view],
            viewFuture: [],
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

      addSection: (type = 'content', insertAtIndex?: number) =>
        set((state) => {
          if (!state.message) return {};
          const sections = [...state.message.sections];
          let insertIndex: number;
          if (insertAtIndex !== undefined) {
            insertIndex = insertAtIndex;
          } else {
            const footerIndex = sections.findIndex((s) => s.type === 'footer');
            insertIndex = footerIndex >= 0 ? footerIndex : sections.length;
          }
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
          const originalIndex = sections.findIndex((s) => s.id === sectionId);
          const insertIndex = originalIndex + 1;
          const idMap = new Map<string, string>();
          const newComponents = section.components.map((c) => {
            const newId = uuid();
            idMap.set(c.id, newId);
            return { ...JSON.parse(JSON.stringify(c)), id: newId };
          });
          const newItemOrder = section.sectionItemOrder
            ? section.sectionItemOrder.map((id) => idMap.get(id) ?? id)
            : undefined;
          const newSection: Section = {
            ...JSON.parse(JSON.stringify(section)),
            id: uuid(),
            components: newComponents,
            sectionItemOrder: newItemOrder,
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
            const settings = getDefaultComponentSettings(type, state.message!.theme);
            const newComponent: MessageComponent = {
              id: uuid(),
              type,
              settings,
              linkedValues: {},
              attachments: [],
              order: s.components.length,
            };
            const currentOrder = computeSectionItemOrder(s);
            return {
              ...s,
              components: [...s.components, newComponent],
              sectionItemOrder: [...currentOrder, newComponent.id],
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
            const sectionItemOrder = (s.sectionItemOrder ?? computeSectionItemOrder(s))
              .filter((id) => id !== componentId);
            return { ...s, components, sectionItemOrder };
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

      reorderSectionItems: (sectionId, newOrder) =>
        set((state) => {
          if (!state.message) return {};
          const sections = state.message.sections.map((s) => {
            if (s.id !== sectionId) return s;
            const compIds = newOrder.filter((id) => !isAttachmentKey(id));
            const components = [...s.components];
            compIds.forEach((id, i) => {
              const comp = components.find((c) => c.id === id);
              if (comp) comp.order = i;
            });
            return { ...s, sectionItemOrder: newOrder, components };
          });
          return { message: { ...state.message, sections } };
        }),

      reorderComponentItems: (sectionId, componentId, newOrder) =>
        set((state) => {
          if (!state.message) return {};
          const sections = state.message.sections.map((s) => {
            if (s.id !== sectionId) return s;
            const components = s.components.map((c) => {
              if (c.id !== componentId) return c;
              return { ...c, contentItemOrder: newOrder };
            });
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
          const currentOrder = computeSectionItemOrder(section);
          const orderIdx = currentOrder.indexOf(componentId);
          if (orderIdx <= 0) return {};
          const newOrder = [...currentOrder];
          [newOrder[orderIdx - 1], newOrder[orderIdx]] = [newOrder[orderIdx], newOrder[orderIdx - 1]];
          const sections = state.message.sections.map((s) => {
            if (s.id !== sectionId) return s;
            const compIds = newOrder.filter((id) => !isAttachmentKey(id));
            const components = [...s.components];
            compIds.forEach((id, i) => {
              const comp = components.find((c) => c.id === id);
              if (comp) comp.order = i;
            });
            return { ...s, components, sectionItemOrder: newOrder };
          });
          return { message: { ...state.message, sections } };
        }),

      moveComponentDown: (sectionId, componentId) =>
        set((state) => {
          if (!state.message) return {};
          const section = state.message.sections.find((s) => s.id === sectionId);
          if (!section) return {};
          const currentOrder = computeSectionItemOrder(section);
          const orderIdx = currentOrder.indexOf(componentId);
          if (orderIdx < 0 || orderIdx >= currentOrder.length - 1) return {};
          const newOrder = [...currentOrder];
          [newOrder[orderIdx], newOrder[orderIdx + 1]] = [newOrder[orderIdx + 1], newOrder[orderIdx]];
          const sections = state.message.sections.map((s) => {
            if (s.id !== sectionId) return s;
            const compIds = newOrder.filter((id) => !isAttachmentKey(id));
            const components = [...s.components];
            compIds.forEach((id, i) => {
              const comp = components.find((c) => c.id === id);
              if (comp) comp.order = i;
            });
            return { ...s, components, sectionItemOrder: newOrder };
          });
          return { message: { ...state.message, sections } };
        }),

      duplicateComponent: (sectionId, componentId) =>
        set((state) => {
          if (!state.message) return {};
          let newCompId: string | null = null;
          const sections = state.message.sections.map((s) => {
            if (s.id !== sectionId) return s;
            const compIndex = s.components.findIndex((c) => c.id === componentId);
            if (compIndex < 0) return s;
            const comp = s.components[compIndex];
            const newComp: MessageComponent = {
              ...JSON.parse(JSON.stringify(comp)),
              id: uuid(),
              order: compIndex + 1,
            };
            newCompId = newComp.id;
            const components = [...s.components];
            components.splice(compIndex + 1, 0, newComp);
            components.forEach((c, i) => (c.order = i));
            const currentOrder = computeSectionItemOrder(s);
            const orderIdx = currentOrder.indexOf(componentId);
            const newItemOrder = [...currentOrder];
            newItemOrder.splice(orderIdx + 1, 0, newComp.id);
            return { ...s, components, sectionItemOrder: newItemOrder };
          });
          return {
            message: { ...state.message, sections },
            selectedComponentId: newCompId,
          };
        }),

      duplicateMessage: (message) =>
        set((state) => {
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
            viewHistory: [...state.viewHistory, state.view],
            viewFuture: [],
            selectedSectionId: null,
            selectedComponentId: null,
          };
        }),
    } satisfies MessageStore;
});
