import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Register the 'recipes' collection for files in src/content/recipes/**/*.{md,mdx}
const recipes = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/recipes",
    // Astro 5.17+: reduce Content Layer store size when raw body is not used.
    retainBody: false,
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      img: image(),
      time: z.union([z.string(), z.number()]).optional(),
      yield: z.string().optional(),
    }),
});

export const collections = { recipes };
