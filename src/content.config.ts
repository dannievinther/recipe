import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Register the 'recipes' collection for files in src/content/recipes/**/*.{md,mdx}
const recipes = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/recipes",
    // Astro 5.17+: reduce Content Layer store size when raw body is not used.
    retainBody: false,
  }),
  schema: z.object({
    title: z.string(),
    img: z.string().min(1),
    time: z.union([z.string(), z.number()]).optional(),
    yield: z.string().optional(),
  }),
});

export const collections = { recipes };
