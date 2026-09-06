export interface PaletteOption {
  id: string;
  name: string;
  accentColor: string;
  accentHover: string;
  accentLight: string;
  description: string;
  isDark?: boolean;
  colors?: string[];
}

export const PALETTES: PaletteOption[] = [
  {
    id: 'crimson',
    name: 'Crimson',
    accentColor: '#E63946',
    accentHover: '#8B1E2D',
    accentLight: '#F4D35E',
    description: 'YouTube Red & Gold',
    colors: ['#8B1E2D', '#E63946', '#F4D35E', '#457B9D'],
  },
  {
    id: 'pearl',
    name: 'Warm Pearl',
    accentColor: '#F62440',
    accentHover: '#D9142E',
    accentLight: '#FFE5BF',
    description: 'Ivory & Crimson Punch',
    colors: ['#FFFAF3', '#FFF2DB', '#FFE5BF', '#F62440'],
  },
  {
    id: 'noir-rose',
    name: 'Noir Rose',
    accentColor: '#CB2957',
    accentHover: '#A61B40',
    accentLight: '#DDDDDD',
    description: 'Midnight & Crimson Rose',
    isDark: true,
    colors: ['#000000', '#CB2957', '#DDDDDD', '#EEEEEE'],
  },
  { id: 'cobalt', name: 'Cobalt', accentColor: '#2340B8', accentHover: '#1D3499', accentLight: '#93C5FD', description: 'Classic Deep Blue' },
  { id: 'emerald', name: 'Emerald', accentColor: '#059669', accentHover: '#047857', accentLight: '#6EE7B7', description: 'Studio Green' },
  { id: 'violet', name: 'Violet', accentColor: '#7C3AED', accentHover: '#6D28D9', accentLight: '#C4B5FD', description: 'Electric Violet' },
  { id: 'amber', name: 'Amber', accentColor: '#D97706', accentHover: '#B45309', accentLight: '#FCD34D', description: 'Warm Bronze' },
  { id: 'cyan', name: 'Cyan', accentColor: '#0891B2', accentHover: '#0E7490', accentLight: '#67E8F9', description: 'Cyber Cyan' },
  { id: 'obsidian', name: 'Obsidian', accentColor: '#3B82F6', accentHover: '#2563EB', accentLight: '#93C5FD', description: 'Dark Mode', isDark: true },
  { id: 'sand', name: 'Sand', accentColor: '#C2410C', accentHover: '#9A3412', accentLight: '#FDBA74', description: 'Editorial Paper' },
];
