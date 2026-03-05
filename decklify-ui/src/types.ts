import { z } from "zod";

export const ActionSchema = z.object({
  Macro: z.object({
    name: z.string(),
  }),
});

export const TileSchema = z.object({
  label: z.string().optional(),
  iconName: z.string().optional(),
  action: ActionSchema.optional(),
});

export const PageSchema = z.object({
  width: z.number(),
  height: z.number(),
  backgroundUrl: z.string().optional(),
  tiles: z.array(TileSchema),
});

export const LayoutSchema = z.object({
  pages: z.array(PageSchema),
});

export type Action = z.infer<typeof ActionSchema>;
export type Tile = z.infer<typeof TileSchema>;
export type Page = z.infer<typeof PageSchema>;
export type Layout = z.infer<typeof LayoutSchema>;
