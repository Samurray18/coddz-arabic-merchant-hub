import type { Config } from "tailwindcss";
import stitch from "./design/tailwind.stitch.config.js";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      ...stitch.theme.extend,
    },
  },
};

export default config;