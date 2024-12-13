import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["./lib/queryBuilder.ts"],
    treeshake: true,
    minify: true,
    verbose: true,
    dts: true,
    external: ["react", "react-dom"],
    clean: true,
    outDir: "./design-system/build-sandpack", // build output
  },
]);
