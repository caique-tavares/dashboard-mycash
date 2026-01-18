/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores Semânticas (do Design System)
        background: {
          400: '#F5F6F8', // fundo da página
        },
        surface: {
          500: '#FFFFFF', // superfície de cards, sidebar
        },
        primary: {
          500: '#D7FF00', // cor primária - amarelo/verde vibrante
        },
        secondary: {
          900: '#060A11', // texto principal, botões escuros
          50: '#E7E8EA', // bordas, elementos secundários
        },

        // Cores Adicionais Encontradas
        stroke: {
          4: '#E5E7EB', // bordas de cards
        },
        fill: {
          'AN4W7D': '#080B12', // texto escuro
          '7BUOF2': '#C4E703', // verde claro - gráficos
          'AWNPQ8': '#2A89EF', // azul - saldo positivo
          'TLMKWS': '#15BE78', // verde - receitas
          'MUDLK6': '#E61E32', // vermelho - despesas
          'NG5QA6': '#9CA3AF', // bordas de inputs
          'W3RSY5': '#D1D5DB', // cinza médio
          'BSKG3K': '#D9D9D9', // cinza claro
        },

        // Mapeamento para primitivas (conversões)
        gray: {
          50: '#F5F6F8', // --color-background-400
          100: '#FAFAFA', // fundo secundário
          200: '#E5E7EB', // --color-stroke-4 (bordas)
          300: '#D1D5DB', // --color-fill-W3RSY5
          400: '#9CA3AF', // --color-fill-NG5QA6
          500: '#6B7280', // cinza médio
          600: '#4B5563', // cinza escuro
          700: '#374151', // cinza mais escuro
          800: '#1F2937', // quase preto
          900: '#080B12', // --color-fill-AN4W7D (texto escuro)
        },
        red: {
          500: '#E61E32', // --color-fill-MUDLK6 (erro/despesas)
        },
        green: {
          400: '#C4E703', // --color-fill-7BUOF2
          500: '#15BE78', // --color-fill-TLMKWS (sucesso/receitas)
        },
        blue: {
          500: '#2A89EF', // --color-fill-AWNPQ8 (info/saldo)
        },
        yellow: {
          500: '#D7FF00', // --color-primary-500
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        // Label
        'label-xs': ['12px', { lineHeight: '1.33', letterSpacing: '0.025em' }],
        'label-sm': ['14px', { lineHeight: '1.14', letterSpacing: '0.0214em' }],
        'label-md': ['16px', { lineHeight: '1.25', letterSpacing: '0.0188em' }],
        'label-lg': ['18px', { lineHeight: '1.33', letterSpacing: '0.0167em' }],

        // Paragraph
        'paragraph-xs': ['12px', { lineHeight: '1.67', letterSpacing: '0.025em' }],
        'paragraph-sm': ['14px', { lineHeight: '1.43', letterSpacing: '0.0214em' }],
        'paragraph-lg': ['18px', { lineHeight: '1.56', letterSpacing: '0.0167em' }],

        // Heading
        'heading-xs': ['20px', { lineHeight: '1.4' }],
        'heading-sm': ['24px', { lineHeight: '1.33' }],
        'heading-md': ['28px', { lineHeight: '1.29' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      spacing: {
        // Espaçamentos padrão
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '18': '18px',
        '20': '20px',
        '24': '24px',
        '32': '32px',
        '50': '50px',
        '56': '56px',
        '118': '118px',

        // Sidebar
        'sidebar-width': '300px',
        'sidebar-padding': '32px',
        'sidebar-gap-vertical': '118px',
        'sidebar-gap-sections': '24px',

        // Main content
        'main-padding': '32px',
        'main-gap': '32px',
      },
      borderRadius: {
        'none': '0',
        'sm': '8px',
        'md': '20px',
        'full': '100px',
      },
      boxShadow: {
        'card': '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}