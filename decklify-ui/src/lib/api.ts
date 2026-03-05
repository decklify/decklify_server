import { LayoutSchema, type Layout } from "../types";

export async function fetchLayout(): Promise<Layout> {
  const res = await fetch("/layout");
  if (!res.ok) throw new Error(`Failed to load layout: ${res.statusText}`);
  return LayoutSchema.parse(await res.json());
}
