/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx,js,jsx}',
    './index.html'
  ],
  // Performance optimizations
  corePlugins: {
    // Disable unused features to reduce CSS bundle size
    backdropSepia: false,
    backdropGrayscale: false,
    backdropHueRotate: false,
    backdropInvert: false,
    backdropContrast: false,
    backdropBrightness: false,
    backdropSaturate: false,
  },
  // Safelist critical classes that might be dynamically generated
  safelist: [
    'animate-fade-in',
    'animate-slide-in-from-bottom',
    'animate-scale-in',
    {
      pattern: /^(bg|text|border)-(gaming|slate|indigo|emerald|red|yellow|blue)-(50|100|200|300|400|500|600|700|800|900)$/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /^(w|h)-(4|5|6|8|10|12|16|20|24)$/,
    }
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Essential gaming colors only
        'gaming': {
          'primary': '#DD3624',
          'secondary': '#0143FF',
          'accent': '#00D4FF',
          'dark': '#1D1D1D',
          'darker': '#0A0A0A',
          'gold': '#FFD700',
          'silver': '#C0C0C0',
          'bronze': '#CD7F32',
          'success': '#10B981',
          'warning': '#F59E0B',
          'error': '#EF4444',
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Optimize animations - keep only essential ones
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          from: { transform: "scale(0.9)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "pulse-ring": {
          "0%": { 
            transform: "scale(1)",
            opacity: "1"
          },
          "100%": { 
            transform: "scale(1.5)",
            opacity: "0"
          },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.4s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 1.5s ease-in-out infinite",
      },
      // Optimize spacing - include only used values
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} 