import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Poppins'", "system-ui", "sans-serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      colors: {
        // Warm burgundy-based brand ramp, built from the requested palette.
        brand: {
          50: "#FFF9F3", // warm off-white
          100: "#FBE9EA", // pale rose tint
          200: "#F3A6A8", // soft blush pink
          300: "#D34F63", // dusty rose
          400: "#B276A1", // mauve
          500: "#8B639D", // muted purple
          600: "#8F0028", // deep burgundy (primary)
          700: "#6B001F", // deep burgundy, darker (hover)
          800: "#4A0016",
          900: "#33000F",
        },
        accent: {
          cream: "#F3E5D0",
          ivory: "#FFF9F3",
          blush: "#F3A6A8",
          rose: "#D34F63",
          mauve: "#B276A1",
          purple: "#8B639D",
          indigo: "#45418F",
          burgundy: "#8F0028",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #8F0028 0%, #D34F63 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, #F3A6A8 0%, #FFF9F3 65%)",
        "brand-gradient-wide": "linear-gradient(120deg, #8F0028 0%, #B276A1 55%, #45418F 100%)",
        "mauve-gradient": "linear-gradient(135deg, #F3A6A8 0%, #B276A1 55%, #8B639D 100%)",
      },
      boxShadow: {
        glow: "0 8px 30px -6px rgba(143, 0, 40, 0.35)",
        "glow-lg": "0 20px 45px -12px rgba(143, 0, 40, 0.4)",
        card: "0 2px 10px -2px rgba(74, 0, 22, 0.08)",
      },
    },
  },
  plugins: [typography],
};
