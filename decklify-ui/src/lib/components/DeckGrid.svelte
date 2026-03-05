<script lang="ts">
  import { state } from "../state/layout.svelte";
  import TileCell from "./TileCell.svelte";

  const currentPage = $derived(state.layout.pages[state.currentPageIndex]);
  const cells = $derived(
    Array.from({ length: currentPage.width * currentPage.height }, (_, i) => i),
  );
</script>

<div class="w-full max-w-5xl">
  <div
    class="grid gap-2 p-2 rounded-xl bg-cover bg-center w-full"
    style="
      aspect-ratio: 1024 / 550;
      grid-template-columns: repeat({currentPage.width}, 1fr);
      grid-template-rows: repeat({currentPage.height}, 1fr);
      background-image: url('{currentPage.backgroundUrl ?? ''}');
    "
  >
    {#each cells as i}
      <TileCell index={i} tile={currentPage.tiles[i]} />
    {/each}
  </div>
</div>
