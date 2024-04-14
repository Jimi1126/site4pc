/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    darkMode: ['selector', '[theme="dark"]'],
    extend: {
      gridTemplateColumns: {
        // Simple 16 column grid
        auto: 'repeat(auto-fill, 20rem)'
      }
    },
    backgroundColor: {},
    textColor: {},
    theme: {
      container: {
        center: true,
        padding: '2rem'
      }
    }
  },
  plugins: []
}
