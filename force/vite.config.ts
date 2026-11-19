import { defineConfig } from "vite";
import prefixer from "postcss-prefix-selector";

// Builds the Force Lab module into www/force/ for inclusion in the Gym Log page.
export default defineConfig({
  root: __dirname,
  css: {
    postcss: {
      plugins: [
        prefixer({
          prefix: "#view-force",
          transform(prefix, selector, prefixed) {
            if (selector.startsWith("#view-force")) return selector;
            if (selector.startsWith("@")) return selector;
            return prefixed;
          },
        }),
      ],
    },
  },
  build: {
    outDir: "../www/force",
    emptyOutDir: true,
    target: "es2020",
    lib: { entry: "src/main.ts", formats: ["es"], fileName: () => "force.js" },
    rollupOptions: { output: { assetFileNames: "force.[ext]", inlineDynamicImports: true } },
    cssCodeSplit: false,
  },
});
