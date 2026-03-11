<script lang="ts">
  import { _state, addTile } from "../state/layout.svelte";
  import TileCell from "./TileCell.svelte";

  const currentPage = $derived(_state.layout.pages[_state.currentPageIndex]);
  const cells = $derived(
    Array.from({ length: currentPage.width * currentPage.height }, (_, i) => i),
  );
</script>

<div class="w-4/5">
  <div
    class="grid gap-5 p-5 rounded-xl bg-cover bg-center w-full"
    style="
      aspect-ratio: 1024 / 550;
      grid-template-columns: repeat({currentPage.width}, 1fr);
      grid-template-rows: repeat({currentPage.height}, 1fr);
      background-image: url('{currentPage.backgroundUrl ?? ''}');
    "
  >
    {#each cells as i}
      {#if i < currentPage.tiles.length}
        <TileCell index={i} tile={currentPage.tiles[i]} />
      {:else if i === currentPage.tiles.length && i < currentPage.width * currentPage.height}
        <button
          onclick={addTile}
          class="w-full h-full rounded-xl border-2 border-dashed border-white/20
             text-white/30 hover:text-white/60 hover:border-white/40
             transition-colors text-3xl flex items-center justify-center"
          >+</button
        >
      {:else}
        <TileCell index={i} />
      {/if}
    {/each}
  </div>
</div>
