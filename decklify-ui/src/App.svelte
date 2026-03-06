<script lang="ts">
  import { onMount } from "svelte";
  import TopBar from "./lib/components/TopBar.svelte";
  import {
    loadLayout,
    _state,
    addPage,
    addTile,
    deletePage,
    deleteTile,
    openPageSettings,
  } from "./lib/state/layout.svelte";
  import DeckGrid from "./lib/components/DeckGrid.svelte";
  import TileEditorPanel from "./lib/components/TileEditorPanel.svelte";
  import PageSettingsPanel from "./lib/components/PageSettingsPanel.svelte";
  import PageStrip from "./lib/components/PageStrip.svelte";

  onMount(loadLayout);
</script>

{#if _state.loading}
  <p>Loading...</p>
{:else if _state.error}
  <p>Error: {_state.error}</p>
{:else}
  <div class="min-h-screen bg-[#121212] text-white flex flex-col font-sans">
    <TopBar {addPage} {addTile} {deletePage} {deleteTile} {openPageSettings} />

    <main class="flex-1 flex flex-col items-center justify-center p-4.5">
      <PageStrip />
      <DeckGrid />
    </main>
  </div>

  <TileEditorPanel />
  <PageSettingsPanel />
{/if}
