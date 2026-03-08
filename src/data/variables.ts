import type { VariableDefinition } from '../types/variables';

export const entityVariables: VariableDefinition[] = [
  { key: 'entity.title', label: 'entity.title', category: 'entity', group: 'Metadata', valueType: 'text', preview: 'Stranger Things' },
  { key: 'entity.synopsis', label: 'entity.synopsis', category: 'entity', group: 'Metadata', valueType: 'text', preview: 'When a young boy vanishes...' },
  { key: 'entity.eyebrow', label: 'entity.eyebrow', category: 'entity', group: 'Metadata', valueType: 'text', preview: 'NEW SEASON' },
  { key: 'entity.releaseDate', label: 'entity.releaseDate', category: 'entity', group: 'Metadata', valueType: 'text', preview: '2026-03-15' },
  { key: 'entity.rating', label: 'entity.rating', category: 'entity', group: 'Metadata', valueType: 'text', preview: 'TV-14' },
  { key: 'entity.genre', label: 'entity.genre', category: 'entity', group: 'Metadata', valueType: 'text', preview: 'Sci-Fi & Fantasy' },
  { key: 'entity.ctaText', label: 'entity.ctaText', category: 'entity', group: 'Actions', valueType: 'text', preview: 'Watch Now' },
  { key: 'entity.ctaUrl', label: 'entity.ctaUrl', category: 'entity', group: 'Actions', valueType: 'url', preview: 'https://netflix.com/title/...' },
  { key: 'entity.posterUrl', label: 'entity.posterUrl', category: 'entity', group: 'Artwork', valueType: 'url', preview: '/images/stranger-things.jpg' },
  { key: 'entity.bannerUrl', label: 'entity.bannerUrl', category: 'entity', group: 'Artwork', valueType: 'url', preview: '/images/banner.jpg' },
  { key: 'entity.heroUrl', label: 'entity.heroUrl', category: 'entity', group: 'Artwork', valueType: 'url', preview: '/images/hero.jpg' },
];

export const themeVariables: VariableDefinition[] = [
  { key: 'theme.colors.primary', label: 'theme.colors.primary', category: 'theme', group: 'Colors', valueType: 'color', preview: '#E50914' },
  { key: 'theme.colors.secondary', label: 'theme.colors.secondary', category: 'theme', group: 'Colors', valueType: 'color', preview: '#564d4d' },
  { key: 'theme.colors.background', label: 'theme.colors.background', category: 'theme', group: 'Colors', valueType: 'color', preview: '#141414' },
  { key: 'theme.colors.text', label: 'theme.colors.text', category: 'theme', group: 'Colors', valueType: 'text', preview: '#ffffff' },
  { key: 'theme.typography.headlineFont', label: 'theme.headlineFont', category: 'theme', group: 'Typography', valueType: 'text', preview: 'Netflix Sans' },
  { key: 'theme.typography.bodyFont', label: 'theme.bodyFont', category: 'theme', group: 'Typography', valueType: 'text', preview: 'Netflix Sans' },
  { key: 'theme.radius', label: 'theme.radius', category: 'theme', group: 'Layout', valueType: 'text', preview: '8px' },
];

export const allVariables: VariableDefinition[] = [...entityVariables, ...themeVariables];

export function getVariablesByType(valueType: VariableDefinition['valueType']): VariableDefinition[] {
  return allVariables.filter((v) => v.valueType === valueType);
}

export function getVariablesByCategory(category: VariableDefinition['category']): VariableDefinition[] {
  return allVariables.filter((v) => v.category === category);
}

export function getVariable(key: string): VariableDefinition | undefined {
  return allVariables.find((v) => v.key === key);
}
