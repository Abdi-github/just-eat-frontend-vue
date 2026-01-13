import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';

const JustEatPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fff3e0',
      100: '#ffe0b2',
      200: '#ffcc80',
      300: '#ffb74d',
      400: '#ffa726',
      500: '#ff8000', // Brand orange
      600: '#e67300',
      700: '#cc6600',
      800: '#b35900',
      900: '#994d00',
      950: '#7a3d00',
    },
    colorScheme: {
      light: {
        primary: {
          color: '#ff8000',
          inverseColor: '#ffffff',
          hoverColor: '#e67300',
          activeColor: '#cc6600',
        },
        surface: {
          0: '#ffffff',
          50: '#f7f7f7',
          100: '#f0f0f0',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#2e3333',
          900: '#1f2626',
          950: '#111a1a',
        },
      },
    },
  },
});

export default JustEatPreset;
