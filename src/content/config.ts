// 1. Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";

// 2. Define your collection(s)
export const pagesCollection = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    path: z.string(),
  }),
});

export const configsCollection = defineCollection({
  type: "data",
  schema: z.object({
    language: z.string(),
    baseDescription: z.string(),
    baseTitle: z.string(),
    avatar: z.string(),
    avatarDescription: z.string(),
    favicon: z.string(),
    layoutComponents: z.array(z.string()),
    navigation: z.array(z.object({ title: z.string(), path: z.string() })),
    socialLinks: z.array(z.object({ name: z.string(), url: z.string() })),
  }),
});

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  pages: pagesCollection,
  configs: configsCollection,
};
