/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/comps/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx}',
    './src/styles/**/*.{scss,css}',
  ],
  theme: {
    extend: {
      colors: {
        'bb-text': '#363223',
        'mm-blue': {
          lightest: '#fbfeff ',
          lighter: '#f5fbfe',
          light: '#8BDFF2',
          mid: '#5CAED8',
          'mid-dark': '#339ace',
          dark: '#2F6583',
        },
        'mm-pink': {
          25: '#FFE9E9',
          50: '#F7BFCC',
          75: '#E88398',
          100: '#D9254C',
        },
        'mm-green': {
          mid: '#29CC8B',
          'dark-mid': '#24b77d',
        },
        'mm-orange': {
          mid: '#FFD49D',
          'dark-mid': '#ffb251',
        },
      },
      spacing: {
        18: '4.5rem',
        19: '4.25rem',
        22: '5.5rem',
        25: '6.25rem',
        26: '6.5rem',
        30: '7.5rem',
        34: '8.5rem',
        35: '8.75rem',
        100: '6.25rem',
        104: '26rem',
        112: '28rem',
        120: '30rem',
        128: '32rem',
        136: '34rem',
        144: '36rem',
        150: '9.375rem',
        152: '38rem',
        160: '40rem',
        168: '42rem',
        176: '44rem',
        184: '46rem',
        192: '48rem',
        200: '12.5rem',
        250: '15.625rem',
        300: '18.75rem',
        350: '21.875rem',
        400: '25rem',
        450: '28.125rem',
        500: '31.25rem',
        550: '34.375rem',
        600: '37.5rem',
        650: '40.625rem',
        700: '43.75rem',
        750: '46.875rem',
        800: '50rem',
        850: '53.125rem',
        900: '56.25rem',
        1.5: '0.375rem',
        2.5: '0.625rem',
        3.5: '0.875rem',
        4.5: '1.125rem',
        5.5: '1.375rem',
        6.5: '1.625rem',
      },
      fontSize: {
        xxxs: [
          '0.625rem',
          {
            lineHeight: '0.75rem',
          },
        ],
        xxs: [
          '0.6875rem',
          {
            lineHeight: '0.875rem',
          },
        ],
        '1.5xl': [
          '1.375rem',
          {
            lineHeight: '1.75rem',
          },
        ],
        '2.5xl': [
          '1.75rem',
          {
            lineHeight: '2.125rem',
          },
        ],
        '3.5xl': [
          '2.05rem',
          {
            lineHeight: '2.4rem',
          },
        ],
      },
    },
  },
  plugins: [],
};
