import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  // Keep prefetch selective: only links marked with `data-astro-prefetch`.
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "tap",
  },
  integrations: [mdx()],
});
