<script lang="ts">
  import { _state } from "../state/layout.svelte";
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
      <TileCell index={i} tile={currentPage.tiles[i]} />
    {/each}
  </div>
</div>
