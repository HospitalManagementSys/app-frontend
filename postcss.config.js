module.exports = {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    }
  };
  
  /** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"], // ✅ Verifică ca aceste fișiere să fie incluse
  theme: {
    extend: {},
  },
  plugins: [],
};
