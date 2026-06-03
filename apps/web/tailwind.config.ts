import type { Config } from 'tailwindcss';
import sharedConfig from '@feed-mind/tailwindcss/theme.json';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    ...sharedConfig,
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          foreground: 'hsl(var(--muted-foreground))',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;