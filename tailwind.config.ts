import type { Config } from "tailwindcss";
export default {
  darkMode: "class", // ✅ โหมด class
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
} satisfies Config;
