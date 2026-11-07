/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Windows 7 / Aero Glass / Frutiger Aero Palette
        background: {
          DEFAULT: '#0078D7',           // Classic Win7 blue
          gradientStart: '#0096FF',     // Sky blue (top)
          gradientEnd: '#003399',       // Deep blue (bottom)
          classic: '#003399',           // Classic dark blue
        },
        surface: {
          DEFAULT: 'rgba(255, 255, 255, 0.2)',    // Aero Glass base
          elevated: 'rgba(255, 255, 255, 0.25)',  // Slightly more opaque
          hover: 'rgba(255, 255, 255, 0.3)',      // Hover state
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.3)',
          highlight: 'rgba(255, 255, 255, 0.5)',  // Top border highlight
          subtle: 'rgba(255, 255, 255, 0.15)',
        },
        accent: {
          DEFAULT: '#0078D7',           // Windows blue
          hover: '#005A9E',             // Darker blue
          pressed: '#004578',           // Pressed state
          glow: 'rgba(0, 120, 215, 0.4)',
        },
        text: {
          DEFAULT: '#FFFFFF',           // White text on glass
          muted: 'rgba(255, 255, 255, 0.7)',
          dim: 'rgba(255, 255, 255, 0.5)',
          dark: '#003399',              // Dark blue for light backgrounds
        },
        button: {
          gradientStart: '#3399FF',     // Light blue
          gradientEnd: '#0066CC',       // Medium blue
          gradientPressedStart: '#0055AA',
          gradientPressedEnd: '#004488',
        },
        input: {
          bg: 'rgba(255, 255, 255, 0.15)',
          border: 'rgba(0, 0, 0, 0.3)',
          borderHighlight: 'rgba(255, 255, 255, 0.4)',
          insetShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Verdana', 'system-ui', 'sans-serif'],
        display: ['Segoe UI', 'Tahoma', 'Verdana', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '8px',
        'button': '4px',
        'input': '4px',
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'glass': '0 4px 16px rgba(0, 0, 0, 0.2)',
        'glass-hover': '0 6px 20px rgba(0, 0, 0, 0.25)',
        'aero-highlight': 'inset 0 1px 0 rgba(255, 255, 255, 0.5)',
        'button-gloss': 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
        'button-pressed': 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
        'input-inset': 'inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 255, 255, 0.1)',
        'win95-inset': 'inset 0 2px 2px rgba(0, 0, 0, 0.4), inset 0 -2px 2px rgba(255, 255, 255, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '10px',
        'strong': '20px',
      },
      animation: {
        'spring-in': 'spring-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.3s cubic-bezier(0.175, 0.885, 0.32, 1)',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'spring-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 120, 215, 0.4)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 120, 215, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
