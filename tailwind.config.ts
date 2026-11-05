import type { Config } from "tailwindcss";

// `<alpha-value>` lets utilities like bg-success/15 work with CSS-variable colors.
const token = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: token("background"),
        foreground: token("foreground"),
        card: token("card"),
        muted: token("muted"),
        "muted-foreground": token("muted-foreground"),
        border: token("border"),
        input: token("input"),
        primary: token("primary"),
        "primary-foreground": token("primary-foreground"),
        accent: token("accent"),
        destructive: token("destructive"),
        success: token("success"),
        warning: token("warning"),
        ring: token("ring"),
      },
    },
  },
  plugins: [],
};

export default config;
