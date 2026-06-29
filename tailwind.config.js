/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  content: [
    "./views/**/*.ejs",  // Scans all EJS files inside the views folder
    "./public/**/*.js"   // Scans any frontend JS files if you have them
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

