/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,tsx,jsx}"],
  theme: {
    extend: {
      colors: {
        'trek-green-dark' : '#004015',
        'trek-green-light' : '#7AEA9F'
      }
    },
    fontFamily: {
      'sans': 'PoetsenOne'
    }
  },
  plugins: [],
}

