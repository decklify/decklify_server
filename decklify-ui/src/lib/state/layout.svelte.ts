import { number } from "zod";
import type { Layout, Page, Tile } from "../../types";
import { fetchLayout } from "../api";

const _state = $state({
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
  _state.layout.pages.push({
    width: 3,
    height: 2,
    tiles: [],
    backgroundUrl: "",
  });

  _state.currentPageIndex = _state.layout.pages.length - 1;
}

export function deletePage() {
  _state.layout.pages.pop();

  _state.currentPageIndex = _state.currentPageIndex = 0
    ? 0
    : _state.layout.pages.length - 1;
}

export function addTile() {
  const page = _state.layout.pages[_state.currentPageIndex];
  const capacity = page.width * page.height;

  if (page.tiles.length >= capacity) alert("Page is full.");

  page.tiles.push({
    label: "New Tile",
    iconName: "",
    action: { Macro: { name: "" } },
  });
}

export function deleteTile() {
  _state.layout.pages[_state.currentPageIndex].tiles.pop();
}

export function openTileEditor(index: number) {
  _state.selectedTileIndex = index;
  _state.showTileEditor = true;
}

export function openPageSettings() {
  _state.showPageSettings = true;
}

export function onTileDragStart(ev: DragEvent, index: number) {
  _state.dragSourceIndex = index;
  ev.dataTransfer!.effectAllowed = "move";
}

export function onTileDragEnd() {
  _state.dragSourceIndex = null;
}

export function onTileDrop(ev: DragEvent, targetIndex: number) {
  ev.preventDefault();
  if (_state.dragSourceIndex == null) return;

  const tiles = _state.layout.pages[_state.currentPageIndex].tiles;
  const src = _state.dragSourceIndex;

  if (targetIndex < tiles.length) {
    [tiles[src], tiles[targetIndex]] = [tiles[targetIndex], tiles[src]];
  } else {
    const tile = tiles.splice(src, 1)[0];
    const dest = Math.min(targetIndex, tiles.length);
    tiles.splice(dest, 0, tile);
  }

  _state.dragSourceIndex = null;
  _state.selectedTileIndex = null;
  _state.dragOverIndex = null;
}

export function onTileDragOver(ev: DragEvent, index: number) {
  ev.preventDefault();
  _state.dragOverIndex = index;
}

export function onTileDragLeave() {
  _state.dragOverIndex = null;
}

export function saveTile(newTile: Tile): void {
  if (_state.selectedTileIndex === null) return;
  const tile =
    _state.layout.pages[_state.currentPageIndex].tiles[
      _state.selectedTileIndex
    ];
  tile.label = newTile.label;
  tile.iconName = newTile.iconName;
  tile.action = newTile.action;
}

export async function loadLayout() {
  try {
    _state.loading = true;
    _state.error = null;
    _state.layout = await fetchLayout();
  } catch (e) {
    _state.error = String(e);
  } finally {
    _state.loading = false;
  }
}

export { _state };
