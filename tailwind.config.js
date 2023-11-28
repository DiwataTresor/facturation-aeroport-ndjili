module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
      fontFamily: {
          display: ['Open Sans', 'sans-serif'],
          body: ['Open Sans', 'sans-serif'],
      },
      extend: {
          fontSize: {
              14: '14px',
              13: '13px',
              12: '12px',
              11: '11px',
              10: '10px',
              sm: ['10px', '20px'],
              base: ['16px', '24px'],
              lg: ['20px', '28px'],
              xl: ['24px', '32px'],
          },
          backgroundColor: {
              'main-bg': '#FAFBFB',
              'main-dark-bg': '#20232A',
              'secondary-dark-bg': '#33373E',
              'light-gray': '#F7F7F7',
              'half-transparent': 'rgba(0, 0, 0, 0.5)',
          },
          borderWidth: {
              1: '1px',
          },
          borderColor: {
              color: 'rgba(0, 0, 0, 0.1)',
          },
          width: {
              100: '100px',
              175: '175px',
              200: '200px',
              225: '225px',
              250: '250px',
              275: '275px',
              300: '300px',
              425: '425px',
              450: '450px',
              470: '470px',
              525: '525px',
              550: '550px',
              575: '575px',
              600: '600px',
              625: '625px',
              650: '650px',
              675: '675px',
              760: '760px',
              780: '780px',
              800: '800px',
              1000: '1000px',
              1200: '1200px',
              1400: '1400px',
          },
          height: {
              80: '80px',
          },
          minHeight: {
              590: '590px',
          },
          backgroundImage: {
              'hero-pattern':
                  "url('https://demos.wrappixel.com/premium-admin-templates/react/flexy-react/main/static/media/welcome-bg-2x-svg.25338f53.svg')",
          },
      },
  },
  plugins: [require("daisyui")],
};