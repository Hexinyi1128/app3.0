/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6E96C2',
        deep: '#5580B0',
        mist: '#C6D8EA',
        mistlight: '#EAF1F8',
        page: '#F7F9FB',
        ink: '#2A2D33',
        muted: '#9AA0A8',
        line: '#E8EDF2',
        okay: '#A8D08D',
        off: '#D98880',
      },
      fontFamily: {
        sans: ['DM Sans', 'Noto Sans SC', '-apple-system', 'BlinkMacSystemFont', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
      borderRadius: {
        card: '22px',
        sheet: '26px',
      },
      boxShadow: {
        card: '0 10px 30px rgba(85, 128, 176, 0.08)',
        float: '0 12px 34px rgba(42, 45, 51, 0.14)',
        nav: '0 10px 28px rgba(42, 45, 51, 0.18)',
      },
      backgroundImage: {
        'mist-head': 'linear-gradient(150deg, #9FB9D8, #C6D8EA)',
      },
    },
  },
  plugins: [],
}
