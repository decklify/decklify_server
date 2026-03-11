import { LayoutSchema, type Layout } from "../types";
import { _state } from "./state/layout.svelte";

export async function fetchLayout(): Promise<Layout> {
  const res = await fetch("/layout");
  if (!res.ok) throw new Error(`Failed to load layout: ${res.statusText}`);
  return LayoutSchema.parse(await res.json());
}

export async function uploadLayout(): Promise<void> {
  const res = await fetch("/layout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(_state.layout),
  });
  if (!res.ok) throw new Error(`Failed to upload layout: ${res.statusText}`);
  return;
}
