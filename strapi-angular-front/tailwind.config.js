/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,css,js,ts}"],
  theme: {
    extend: {
      colors:{
        'primary': '#1DACE3',
        'secondary': '#E9327C',
        'terc': '#001A49'
      }
    },
  },
  plugins: [require('flowbite/plugin')],
  corePlugins: {
    preflight: true,
  }
}
