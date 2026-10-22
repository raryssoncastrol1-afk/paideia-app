/**
 * PAIDEIA: Design System - Romanità do Século XX
 * Cores nobres lapidares, mármores, bronze e púrpura imperial
 */

export const Colors = {
  // Fundos & Mármores
  marbleTravertine: '#F5F2EB', // Fundo claro clássico
  marbleDark: '#121316',       // Basalto / Fundo noturno imperial
  cardTravertine: '#EAE5D9',   // Cartões modo claro
  cardDark: '#1B1D22',         // Cartões modo escuro

  // Cores de Autoridade & Virtude
  tyrianPurple: '#4A1525',     // Púrpura Imperial (Símbolo de Ranks altos)
  tyrianPurpleLight: '#6B2036',// Púrpura de destaque
  bronzeGold: '#C5A059',       // Ouro envelhecido / Bronze imperial
  bronzeDark: '#8A6D3B',       // Bronze esculpido

  // Textos & Gravações Lapidares
  stoneInk: '#222326',         // Tinta de escrita sépia escura
  stoneMuted: '#68655E',       // Cinza pedra para legendas
  stoneLight: '#E2DFD2',       // Texto claro sobre basalto

  // Status & Alertas Estóicos
  expiatioRed: '#8B1E1E',      // Alerta de quebra de hábito / Falha
  virtusGreen: '#2D5A3F',      // Cumprimento do dever cívico
};

export const Typography = {
  // Hierarquia Tipográfica
  monumentalTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: 2.5,
    textTransform: 'uppercase' as const,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  latinMotto: {
    fontSize: 14,
    fontStyle: 'italic' as const,
    letterSpacing: 0.8,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  caption: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
