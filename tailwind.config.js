import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';
import animatePlugin from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',

  content: ['./app/**/*.{js,ts,jsx,tsx}'],

  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },

    extend: {
      colors: {
        /* Custom Shopify colors */
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },

        contrast: 'rgb(var(--color-contrast) / <alpha-value>)',

        notice: 'rgb(var(--color-accent) / <alpha-value>)',

        shopPay: 'rgb(var(--color-shop-pay) / <alpha-value>)',

        /* shadcn / CommerCN */
        background: 'hsl(var(--background))',

        foreground: 'hsl(var(--foreground))',

        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },

        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },

        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },

        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },

        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        border: 'hsl(var(--border))',

        input: 'hsl(var(--input))',

        ring: 'hsl(var(--ring))',
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      screens: {
        sm: '32em',
        md: '48em',
        lg: '64em',
        xl: '80em',
        '2xl': '96em',

        'sm-max': {
          max: '48em',
        },

        'sm-only': {
          min: '32em',
          max: '48em',
        },

        'md-only': {
          min: '48em',
          max: '64em',
        },

        'lg-only': {
          min: '64em',
          max: '80em',
        },

        'xl-only': {
          min: '80em',
          max: '96em',
        },

        '2xl-only': {
          min: '96em',
        },
      },

      spacing: {
        nav: 'var(--height-nav)',
        screen: 'var(--screen-height, 100vh)',
      },

      height: {
        screen: 'var(--screen-height, 100vh)',

        'screen-no-nav':
          'calc(var(--screen-height, 100vh) - var(--height-nav))',

        'screen-dynamic': 'var(--screen-height-dynamic, 100vh)',
      },

      width: {
        mobileGallery: 'calc(100vw - 3rem)',
      },

      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        unbounded: ['Unbounded', 'sans-serif'],
      },

      fontSize: {
        display: ['var(--font-size-display)', '1.1'],
        heading: ['var(--font-size-heading)', '1.25'],
        lead: ['var(--font-size-lead)', '1.333'],
        copy: ['var(--font-size-copy)', '1.5'],
        fine: ['var(--font-size-fine)', '1.333'],
      },

      maxWidth: {
        'prose-narrow': '45ch',
        'prose-wide': '80ch',
      },

      boxShadow: {
        border: 'inset 0px 0px 0px 1px rgb(var(--color-primary) / 0.08)',

        darkHeader: 'inset 0px -1px 0px 0px rgba(21, 21, 21, 0.4)',

        lightHeader: 'inset 0px -1px 0px 0px rgba(21, 21, 21, 0.05)',
      },
    },
  },

  plugins: [formsPlugin, typographyPlugin, animatePlugin],
};
