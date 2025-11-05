import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

// Register the 'recipes' collection for files in src/content/recipes/**/*.{md,mdx}
const recipes = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/recipes" }),
  // Add a schema later for stronger typing/validation
});

export const collections = { recipes };
