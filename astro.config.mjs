import { defineConfig } from "astro/config";
import image from "@astrojs/image";
import mdx from "@astrojs/mdx";

import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  trailingSlash: "always",
  integrations: [image({
    serviceEntryPoint: "@astrojs/image/sharp"
  }), mdx(), compress()]
});