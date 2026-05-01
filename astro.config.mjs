import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  image: {
    responsiveStyles: true,
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Object Sans",
      cssVariable: "--font-object-sans",
      fallbacks: ["system-ui", "sans-serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/object-sans-var.woff2"],
            weight: "100 900",
            style: "normal",
          },
        ],
      },
    },
  ],
  // Keep prefetch selective: only links marked with `data-astro-prefetch`.
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "tap",
  },
  experimental: {
    queuedRendering: {
      enabled: true,
      contentCache: true,
    },
  },
  vite: {
    optimizeDeps: {
      include: ["js-confetti"],
    },
  },
  integrations: [mdx()],
});
