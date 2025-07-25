module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Child Sunshine Theme
        sunshine: {
          primary: '#FFD700',
          secondary: '#FFA500',
          accent: '#87CEEB',
          bg: '#F0FFF0',
          surface: '#FFFEF7',
          text: '#2F4F4F',
          'text-secondary': '#4A5568',
          border: '#E2E8F0'
        },
        // Child Moon Theme (softer than admin dark)
        moon: {
          primary: '#9BB5FF',
          secondary: '#B19CD9',
          accent: '#FFB6C1',
          bg: '#4A5568',
          surface: '#5A6B7D',
          text: '#F7FAFC',
          'text-secondary': '#E2E8F0',
          border: '#6B7280'
        },
        // Admin themes
        admin: {
          light: {
            primary: '#3B82F6',
            secondary: '#6366F1',
            accent: '#8B5CF6',
            bg: '#FFFFFF',
            surface: '#F8FAFC',
            text: '#1F2937',
            'text-secondary': '#6B7280',
            border: '#E5E7EB'
          },
          dark: {
            primary: '#60A5FA',
            secondary: '#818CF8',
            accent: '#A78BFA',
            bg: '#111827',
            surface: '#1F2937',
            text: '#F9FAFB',
            'text-secondary': '#D1D5DB',
            border: '#374151'
          }
        }
      }
    }
  }
}
