import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";
import replace from "@rollup/plugin-replace";

const pwaOptions: Partial<VitePWAOptions> = {
  mode: "development",
  base: "/",
  includeAssets: [
    "favicon.svg",
    "logo192.png",
    "robots.txt",
    "*.ico",
    "*.css",
    "*.js",
  ],
  manifest: {
    name: "PWA Router",
    short_name: "PWA Router",
    theme_color: "#ffffff",
    icons: [
      {
        src: "logo192.png", // <== don't add slash, for testing
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },
  devOptions: {
    enabled: true,
    /* when using generateSW the PWA plugin will switch to classic */
    type: "module",
    navigateFallback: "index.html",
  },
  /** injectManifest options */
  srcDir: "src",
  filename: "sw.ts",
  strategies: "injectManifest",
  injectManifest: {
    minify: false,
    enableWorkboxModulesLogs: true,
    globPatterns: [
      "**/*.{js,css,html,png,jpg,jpeg,svg,woff2,woff,eot,ttf,json}",
    ],
    injectionPoint: "self.__WB_MANIFEST",
  },
  registerType: "autoUpdate",
};

const replaceOptions = {
  preventAssignment: true,
  __DATE__: new Date().toISOString(),
  __RELOAD_SW__: "true",
};

export default defineConfig({
  base: "/",
  plugins: [react(), VitePWA(pwaOptions), replace(replaceOptions)],
});
