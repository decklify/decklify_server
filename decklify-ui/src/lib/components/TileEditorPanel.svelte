<script lang="ts">
  import { _state, deleteTile, saveTile } from "../state/layout.svelte";

  // local form state
  let label = $state("");
  let iconName = $state("");
  let macro = $state("");

  // sync form when selected tile changes
  $effect(() => {
    if (_state.selectedTileIndex !== null) {
      const tile =
        _state.layout.pages[_state.currentPageIndex].tiles[
          _state.selectedTileIndex
        ];
      label = tile.label ?? "";
      iconName = tile.iconName ?? "";
      macro = tile.action?.Macro?.name ?? "";
    }
  });

  function handleSave() {
    saveTile({ label, iconName, action: { Macro: { name: macro } } });
    _state.selectedTileIndex = null;
  }

  function handleClose() {
    _state.selectedTileIndex = null;
  }

  const visible = $derived(_state.selectedTileIndex !== null);
</script>

<!-- overlay to close on outside click -->
{#if visible}
  <div
    role="presentation"
    class="fixed inset-0 z-40"
    onclick={() => {
      handleSave();
      handleClose();
    }}
  ></div>
{/if}

<!-- side panel -->
<div
  class="
  fixed top-0 right-0 h-full w-72 z-50
  bg-[#1a1a1a] border-l border-white/10
  shadow-[-8px_0_32px_rgba(0,0,0,0.4)]
  flex flex-col
  transition-transform duration-300 ease-in-out
  {visible ? 'translate-x-0' : 'translate-x-full'}
"
>
  <!-- header -->
  <div
    class="flex items-center justify-between px-5 py-4 border-b border-white/10"
  >
    <h2 class="text-sm font-semibold text-white/90 m-0">Edit Tile</h2>
    <button
      onclick={handleClose}
      class="text-white/40 hover:text-white/80 transition-colors text-lg leading-none"
      >✕</button
    >
  </div>

  <!-- form -->
  <div class="flex-1 flex flex-col gap-5 px-5 py-5 overflow-y-auto">
    <div class="flex flex-col gap-1.5">
      <label
        for="tile-label"
        class="text-xs font-medium text-white/50 uppercase tracking-wider"
        >Label</label
      >
      <input
        id="tile-label"
        bind:value={label}
        placeholder="Tile label"
        class="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm
               placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
      />
    </div>

    <div class="flex flex-col gap-1.5">
      <label
        for="tile-icon"
        class="text-xs font-medium text-white/50 uppercase tracking-wider"
        >Icon Name</label
      >
      <input
        id="tile-icon"
        bind:value={iconName}
        placeholder="e.g. chrome"
        class="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm
               placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
      />
      {#if iconName}
        <img
          src="/assets/icons/{iconName}.png"
          alt="preview"
          class="w-10 h-10 mt-1 rounded object-contain"
          onerror={(e) =>
            ((e.currentTarget as HTMLImageElement).style.display = "none")}
          onload={(e) =>
            ((e.currentTarget as HTMLImageElement).style.display = "block")}
        />
      {/if}
    </div>

    <div class="flex flex-col gap-1.5">
      <label
        for="tile-macro"
        class="text-xs font-medium text-white/50 uppercase tracking-wider"
        >Macro</label
      >
      <input
        id="tile-macro"
        bind:value={macro}
        placeholder="e.g. run_chrome"
        class="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm
               placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
      />
    </div>

    <button
      onclick={() => {
        if (_state.selectedTileIndex !== null) {
          deleteTile(_state.selectedTileIndex);
          handleClose();
        }
      }}
      class="mt-auto px-2.5 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-colors"
    >
      Delete tile
    </button>
  </div>

  <!-- footer -->
  <div class="px-5 py-4 border-t border-white/10 flex gap-2">
    <button
      onclick={handleSave}
      class="flex-1 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30
             text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-colors"
    >
      Save
    </button>
    <button
      onclick={handleClose}
      class="px-4 py-2 rounded-lg bg-white/5 border border-white/10
             text-white/50 text-sm hover:bg-white/10 transition-colors"
    >
      Cancel
    </button>
  </div>
</div>
