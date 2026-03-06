<script lang="ts">
  import { _state } from "../state/layout.svelte";

  // local form _state
  let width = $state(3);
  let height = $state(2);
  let background = $state("");

  // sync when panel opens
  $effect(() => {
    if (_state.showPageSettings) {
      const page = _state.layout.pages[_state.currentPageIndex];
      width = page.width;
      height = page.height;
      background = page.backgroundUrl ?? "";
    }
  });

  function handleSave() {
    const page = _state.layout.pages[_state.currentPageIndex];
    const newW = Math.max(1, Math.min(10, Number(width)));
    const newH = Math.max(1, Math.min(10, Number(height)));
    const newCap = newW * newH;
    if (page.tiles.length > newCap) page.tiles = page.tiles.slice(0, newCap);
    page.width = newW;
    page.height = newH;
    page.backgroundUrl = background || "";
    _state.showPageSettings = false;
  }

  function handleClose() {
    _state.showPageSettings = false;
  }

  const visible = $derived(_state.showPageSettings);
</script>

<!-- overlay -->
{#if visible}
  <div
    role="presentation"
    class="fixed inset-0 z-40"
    onclick={handleClose}
  ></div>
{/if}

<!-- panel slides in from left -->
<div
  class="
  fixed top-0 left-0 h-full w-72 z-50
  bg-[#1a1a1a] border-r border-white/10
  shadow-[8px_0_32px_rgba(0,0,0,0.4)]
  flex flex-col
  transition-transform duration-300 ease-in-out
  {visible ? 'translate-x-0' : '-translate-x-full'}
"
>
  <!-- header -->
  <div
    class="flex items-center justify-between px-5 py-4 border-b border-white/10"
  >
    <h2 class="text-sm font-semibold text-white/90 m-0">Page Settings</h2>
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
        for="page-column"
        class="text-xs font-medium text-white/50 uppercase tracking-wider"
        >Columns</label
      >
      <div class="flex items-center gap-3">
        <input
          id="page-column"
          type="range"
          min="1"
          max="10"
          bind:value={width}
          class="flex-1 accent-blue-500"
        />
        <span class="text-white text-sm w-4 text-center">{width}</span>
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <label
        for="page-row"
        class="text-xs font-medium text-white/50 uppercase tracking-wider"
        >Rows</label
      >
      <div class="flex items-center gap-3">
        <input
          id="page-row"
          type="range"
          min="1"
          max="10"
          bind:value={height}
          class="flex-1 accent-blue-500"
        />
        <span class="text-white text-sm w-4 text-center">{height}</span>
      </div>
    </div>

    <!-- background url -->
    <div class="flex flex-col gap-1.5">
      <label
        for="page-background"
        class="text-xs font-medium text-white/50 uppercase tracking-wider"
        >Background URL</label
      >
      <input
        id="page-background"
        bind:value={background}
        placeholder="https://..."
        class="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm
      placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
      />
    </div>

    <!-- grid preview -->
    <div class="flex flex-col gap-1.5">
      <label
        for="page-preview"
        class="text-xs font-medium text-white/50 uppercase tracking-wider"
        >Preview</label
      >
      <div
        class="grid gap-1.5 w-full rounded-lg bg-white/5 border border-white/10 p-1.5 bg-cover bg-center"
        style="grid-template-columns: repeat({width}, 1fr); aspect-ratio: 1024 / 550;
            background-image: url('{background}');"
      >
        {#each Array.from({ length: width * height }) as _}
          <div class="bg-white/10 rounded backdrop-blur-sm"></div>
        {/each}
      </div>
    </div>

    <details class="group">
      <summary
        class="text-xs font-medium text-white/50 uppercase tracking-wider cursor-pointer select-none
                  list-none flex items-center gap-1.5 hover:text-white/70 transition-colors"
      >
        <span class="transition-transform duration-200 group-open:rotate-90"
          >👉</span
        >
        Background preview
      </summary>

      {#if background}
        <div
          class="w-full rounded-lg bg-cover bg-center border border-white/10 mt-2"
          style="background-image: url('{background}'); aspect-ratio: 1024 / 550;"
        ></div>
      {:else}
        <p class="text-xs text-white/30 mt-2">No background URL set.</p>
      {/if}
    </details>
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
