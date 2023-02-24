/// <reference types="vitest" />
import { UserConfigExport } from "vite";
import eslint from "vite-plugin-eslint";

const config: UserConfigExport = {
  plugins: [eslint()],
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./testSetup.ts",
  },
};

export default config;
