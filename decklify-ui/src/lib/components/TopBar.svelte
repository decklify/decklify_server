<script lang="ts">
  import { state } from "../state/layout.svelte";

  interface Props {
    addPage: () => void;
    deletePage: () => void;
    openPageSettings: () => void;
    addTile: () => void;
    deleteTile: () => void;
  }

  let { addPage, deletePage, openPageSettings, addTile, deleteTile }: Props =
    $props();
</script>

<div
  class="w-full flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-white/10"
>
  <!-- Left: page controls -->
  <div class="flex items-center gap-2">
    <select
      value={state.currentPageIndex}
      onchange={(e) =>
        (state.currentPageIndex = Number(
          (e.target as HTMLSelectElement).value,
        ))}
      class="px-2 py-1.5 rounded bg-white/5 border border-white/10 text-white text-sm min-w-[140px]"
    >
      {#each state.layout.pages as page, i}
        <option class="text-black" value={i}
          >Page {i + 1} ({page.width}x{page.height})</option
        >
      {/each}
    </select>

    <button
      onclick={openPageSettings}
      class="px-2.5 py-1.5 rounded border border-white/10 bg-white/5 text-white text-sm hover:bg-white/10 transition-colors"
    >
      ⚙ Settings
    </button>
    <button
      onclick={addPage}
      class="px-2.5 py-1.5 rounded border border-white/10 bg-white/5 text-white text-sm hover:bg-white/10 transition-colors"
    >
      + Page
    </button>
    <button
      onclick={deletePage}
      class="px-2.5 py-1.5 rounded border border-red-500/30 bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-colors"
    >
      - Page
    </button>
  </div>

  <!-- Right: tile + save controls -->
  <div class="flex items-center gap-2">
    <button
      onclick={addTile}
      class="px-2.5 py-1.5 rounded border border-white/10 bg-white/5 text-white text-sm hover:bg-white/10 transition-colors"
    >
      + Tile
    </button>
    <button
      onclick={deleteTile}
      class="px-2.5 py-1.5 rounded border border-red-500/30 bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-colors"
    >
      - Tile
    </button>

    <div class="w-px h-5 bg-white/10 mx-1"></div>

    <button
      onclick={() => {
        console.error("Not implemented");
      }}
      class="px-3 py-1.5 rounded border border-emerald-500/40 bg-emerald-500/15 text-emerald-400 text-sm font-medium hover:bg-emerald-500/25 transition-colors"
    >
      Save
    </button>
  </div>
</div>
