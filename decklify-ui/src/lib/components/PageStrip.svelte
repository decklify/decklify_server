<script lang="ts">
  import { _state, addPage } from "../state/layout.svelte";

  let dragSource = $state<number | null>(null);
  let dragOver = $state<number | null>(null);

  function onDragStart(ev: DragEvent, i: number) {
    dragSource = i;
    ev.dataTransfer!.effectAllowed = "move";
  }

  function onDragOver(ev: DragEvent, i: number) {
    ev.preventDefault();
    dragOver = i;
  }

  function onDragLeave() {
    dragOver = null;
  }

  function onDrop(ev: DragEvent, target: number) {
    ev.preventDefault();
    if (dragSource === null || dragSource === target) {
      dragSource = null;
      dragOver = null;
      return;
    }
    const page = _state.layout.pages.splice(dragSource, 1)[0];
    _state.layout.pages.splice(target, 0, page);
    _state.currentPageIndex = target;
    dragSource = null;
    dragOver = null;
  }

  function onDragEnd() {
    dragSource = null;
    dragOver = null;
  }

  function cells(width: number, height: number) {
    return Array.from({ length: width * height }, (_, i) => i);
  }
</script>

<div class="w-4/5 flex items-center gap-2 mb-3 overflow-x-auto pb-1">
  {#each _state.layout.pages as page, i}
    <button
      draggable="true"
      ondragstart={(ev) => onDragStart(ev, i)}
      ondragover={(ev) => onDragOver(ev, i)}
      ondragleave={onDragLeave}
      ondrop={(ev) => onDrop(ev, i)}
      ondragend={onDragEnd}
      onclick={() => (_state.currentPageIndex = i)}
      class="
        relative shrink-0 w-32 rounded-lg p-1.5 box-border border-2 transition-all duration-150 cursor-grab active:cursor-grabbing
        flex flex-col gap-1 overflow-hidden
        {i === _state.currentPageIndex
        ? 'border-blue-500/60 bg-blue-500/10'
        : 'border-white/10 bg-white/5 hover:bg-white/10'}
        {dragSource === i ? 'opacity-40 scale-95' : ''}
        {dragOver === i && dragSource !== i
        ? 'border-dashed border-white/60 bg-white/10'
        : ''}
      "
      style="background-image: url('{page.backgroundUrl ??
        ''}'); background-size: cover; background-position: center; aspect-ratio: 1024 / 550;"
      aria-label="Page {i + 1}"
    >
      <div
        class="absolute inset-0 bg-black/40 rounded-lg pointer-events-none"
      ></div>

      <div
        class="relative z-10 grid gap-0.5 flex-1 w-full"
        style="grid-template-columns: repeat({page.width}, 1fr);"
      >
        {#each cells(page.width, page.height) as ci}
          <div
            class="rounded-xs {ci < page.tiles.length
              ? 'bg-white/60'
              : 'bg-white/10'}"
          ></div>
        {/each}
      </div>

      <div
        class="relative z-10 text-[10px] text-white/70 text-center leading-none"
      >
        {i + 1}
      </div>
    </button>
  {/each}

  <button
    onclick={addPage}
    class="shrink-0 w-10 rounded-lg border border-dashed border-white/20
           bg-transparent text-white/30 hover:text-white/60 hover:border-white/40
           transition-colors text-xl flex items-center justify-center"
    style="aspect-ratio: 1024 / 550;"
    aria-label="Add page">+</button
  >
</div>
