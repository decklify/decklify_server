import { number } from "zod";
import type { Layout, Page } from "../../types";
import { fetchLayout } from "../api";

const state = $state({
  layout: { pages: [] } as Layout,
  currentPageIndex: 0,
  selectedTileIndex: null as null | number,
  showTileEditor: false,
  showPageSettings: false,

  dragSourceIndex: null as number | null,
  dragOverIndex: null as number | null,

  loading: true,
  error: null as string | null,
});

export function addPage() {
  state.layout.pages.push({
    width: 3,
    height: 2,
    tiles: [],
    backgroundUrl: "",
  });

  state.currentPageIndex = state.layout.pages.length - 1;
}

export function deletePage() {
  state.layout.pages.pop();

  state.currentPageIndex = state.currentPageIndex = 0
    ? 0
    : state.layout.pages.length - 1;
}

export function addTile() {
  const page = state.layout.pages[state.currentPageIndex];
  const capacity = page.width * page.height;

  if (page.tiles.length >= capacity) alert("Page is full.");

  page.tiles.push({
    label: "New Tile",
    iconName: "",
    action: { Macro: { name: "" } },
  });
}

export function deleteTile() {
  state.layout.pages[state.currentPageIndex].tiles.pop();
}

export function openTileEditor(index: number) {
  state.selectedTileIndex = index;
  state.showTileEditor = true;
}

export function openPageSettings() {
  state.showPageSettings = true;
}

export function onTileDragStart(ev: DragEvent, index: number) {
  state.dragSourceIndex = index;
  ev.dataTransfer!.effectAllowed = "move";
}

export function onTileDragEnd() {
  state.dragSourceIndex = null;
}

export function onTileDrop(ev: DragEvent, targetIndex: number) {
  ev.preventDefault();
  if (state.dragSourceIndex == null) return;

  const tiles = state.layout.pages[state.currentPageIndex].tiles;
  const src = state.dragSourceIndex;

  if (targetIndex < tiles.length) {
    [tiles[src], tiles[targetIndex]] = [tiles[targetIndex], tiles[src]];
  } else {
    const tile = tiles.splice(src, 1)[0];
    const dest = Math.min(targetIndex, tiles.length);
    tiles.splice(dest, 0, tile);
  }

  state.dragSourceIndex = null;
  state.selectedTileIndex = null;
  state.dragOverIndex = null;
}

export function onTileDragOver(ev: DragEvent, index: number) {
  ev.preventDefault();
  state.dragOverIndex = index;
}

export function onTileDragLeave() {
  state.dragOverIndex = null;
}

export async function loadLayout() {
  try {
    state.loading = true;
    state.error = null;
    state.layout = await fetchLayout();
  } catch (e) {
    state.error = String(e);
  } finally {
    state.loading = false;
  }
}

export { state };
