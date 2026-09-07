/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#08080b",
        "base-soft": "#0e0e13",
        violet: {
          400: "#a855f7",
          500: "#8b27da",
        },
        magenta: "#ef43a3",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  daisyui: {
    rtl: false,
    themes: [
      {
        tushar: {
          primary: "#8b27da",
          secondary: "#ef43a3",
          accent: "#6033e0",
          neutral: "#0e0e13",
          "base-100": "#08080b",
          info: "#77CCFD",
          success: "#54EFB8",
          warning: "#FF916B",
          error: "#A52A2B",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
