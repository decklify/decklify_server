<script lang="ts">
  import { onMount } from "svelte";
  import TopBar from "./lib/components/TopBar.svelte";
  import {
    loadLayout,
    state,
    addPage,
    addTile,
    deletePage,
    deleteTile,
    openPageSettings,
    openTileEditor,
  } from "./lib/state/layout.svelte";
  import DeckGrid from "./lib/components/DeckGrid.svelte";

  onMount(loadLayout);
</script>

<!-- <svelte:window onclick={closeAll} /> -->

{#if state.loading}
  <p>Loading...</p>
{:else if state.error}
  <p>Error: {state.error}</p>
{:else}
  <div class="min-h-screen bg-[#121212] text-white flex flex-col font-sans">
    <TopBar {addPage} {addTile} {deletePage} {deleteTile} {openPageSettings} />

    <main class="flex-1 flex flex-col items-center justify-center p-[18px]">
      <header class="mb-12">
        <h1 class="text-xl font-bold m-0">Decklify Editor</h1>
      </header>

      <DeckGrid />
    </main>
  </div>
{/if}
