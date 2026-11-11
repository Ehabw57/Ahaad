import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const toolGuides = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/tool-guides" }),
  schema: z
    .object({
      title: z.string().min(1),
      description: z.string().min(70).max(160),
      updated: z.coerce.date(),
      published: z.coerce.date().optional(),
      faq: z
        .array(
          z.object({
            q: z.string().min(1),
            a: z.string().min(1),
          }),
        )
        .max(10)
        .optional(),
    })
    .transform((data) => ({
      ...data,
      published: data.published ?? data.updated,
    })),
});

export const collections = { "tool-guides": toolGuides };
