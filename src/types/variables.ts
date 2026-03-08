export interface VariableDefinition {
  key: string;
  label: string;
  category: 'entity' | 'theme';
  group: string;
  valueType: 'text' | 'color' | 'number' | 'url';
  preview?: string;
}

export interface LinkedValue<T = string> {
  mode: 'linked' | 'custom';
  variableKey?: string;
  customValue?: T;
}

export function resolveValue<T>(
  linked: LinkedValue<T> | undefined,
  fallback: T,
  variableLookup: (key: string) => T | undefined,
): T {
  if (!linked) return fallback;
  if (linked.mode === 'custom') return linked.customValue ?? fallback;
  if (linked.variableKey) return variableLookup(linked.variableKey) ?? fallback;
  return fallback;
}
