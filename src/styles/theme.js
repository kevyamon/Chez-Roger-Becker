/**
 * Systeme de Design et Palette Centrale pour Chez Roger Becker.
 * Respecte strictement la regle des 3 couleurs harmonieuses :
 * - Couleur Principale (50%) : Orange braise gastronomique et chaleureux
 * - Couleur Secondaire (30%) : Ambre dore appétissant
 * - Couleur d'Accent (20%)   : Bleu ardoise doux et moderne
 * Inclut le mode clair (base blanc natif) et le mode nuit complet.
 */

export const theme = {
  // 1. Les 3 couleurs maitresses
  colors: {
    // 50% - Couleur Principale (Orange Braise)
    primary: {
      light: '#FF7A00',
      main: '#E65100',
      dark: '#BF360C',
      contrastText: '#FFFFFF',
      surface: '#FFF3E0'
    },
    // 30% - Couleur Secondaire (Ambre Dore)
    secondary: {
      light: '#FBBF24',
      main: '#D97706',
      dark: '#92400E',
      contrastText: '#FFFFFF',
      surface: '#FEF3C7'
    },
    // 20% - Couleur d'Accent (Bleu Ardoise Doux)
    accent: {
      light: '#38BDF8',
      main: '#0284C7',
      dark: '#0369A1',
      contrastText: '#FFFFFF',
      surface: '#E0F2FE'
    },
    // Statuts fonctionnels
    status: {
      success: '#16A34A',
      warning: '#F59E0B',
      error: '#DC2626',
      info: '#0284C7'
    }
  },

  // 2. Modes d'affichage (Clair & Nuit)
  modes: {
    light: {
      bgPrimary: '#FFFFFF',
      bgSecondary: '#F8FAFC',
      bgElevated: '#FFFFFF',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      textMuted: '#94A3B8',
      border: '#E2E8F0',
      borderFocus: '#E65100',
      cardShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      tabBarBg: 'rgba(255, 255, 255, 0.95)',
      tabBarBorder: '#E2E8F0'
    },
    dark: {
      bgPrimary: '#0B1120',
      bgSecondary: '#0F172A',
      bgElevated: '#1E293B',
      textPrimary: '#F8FAFC',
      textSecondary: '#CBD5E1',
      textMuted: '#64748B',
      border: '#334155',
      borderFocus: '#FF7A00',
      cardShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
      tabBarBg: 'rgba(15, 23, 42, 0.95)',
      tabBarBorder: '#334155'
    }
  },

  // 3. Typographie & Espacements
  typography: {
    fontFamily: "'Plus Jakarta Sans', 'Outfit', -apple-system, sans-serif",
    fontHeading: "'Outfit', 'Plus Jakarta Sans', sans-serif"
  },
  radii: {
    sm: '8px',
    md: '14px',
    lg: '20px',
    full: '9999px'
  }
};

/**
 * Applique dynamiquement les variables CSS a la racine du document
 * @param {boolean} isDark - Active le mode nuit si vrai
 */
export const applyTheme = (isDark = false) => {
  const root = document.documentElement;
  const currentMode = isDark ? theme.modes.dark : theme.modes.light;

  // Injection des couleurs de base
  root.style.setProperty('--color-primary', theme.colors.primary.main);
  root.style.setProperty('--color-primary-light', theme.colors.primary.light);
  root.style.setProperty('--color-primary-dark', theme.colors.primary.dark);
  root.style.setProperty('--color-primary-surface', theme.colors.primary.surface);

  root.style.setProperty('--color-secondary', theme.colors.secondary.main);
  root.style.setProperty('--color-secondary-light', theme.colors.secondary.light);
  root.style.setProperty('--color-secondary-surface', theme.colors.secondary.surface);

  root.style.setProperty('--color-accent', theme.colors.accent.main);
  root.style.setProperty('--color-accent-light', theme.colors.accent.light);
  root.style.setProperty('--color-accent-surface', theme.colors.accent.surface);

  // Injection des couleurs de statut
  root.style.setProperty('--status-success', theme.colors.status.success);
  root.style.setProperty('--status-warning', theme.colors.status.warning);
  root.style.setProperty('--status-error', theme.colors.status.error);
  root.style.setProperty('--status-info', theme.colors.status.info);

  // Injection des variables de mode
  root.style.setProperty('--bg-primary', currentMode.bgPrimary);
  root.style.setProperty('--bg-secondary', currentMode.bgSecondary);
  root.style.setProperty('--bg-elevated', currentMode.bgElevated);
  root.style.setProperty('--text-primary', currentMode.textPrimary);
  root.style.setProperty('--text-secondary', currentMode.textSecondary);
  root.style.setProperty('--text-muted', currentMode.textMuted);
  root.style.setProperty('--border-color', currentMode.border);
  root.style.setProperty('--card-shadow', currentMode.cardShadow);
  root.style.setProperty('--tabbar-bg', currentMode.tabBarBg);
  root.style.setProperty('--tabbar-border', currentMode.tabBarBorder);
  root.style.setProperty('--bg-card-header', isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)');

  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};
