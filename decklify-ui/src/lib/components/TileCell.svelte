<script lang="ts">
  import type { Tile } from "../../types";
  import {
    onTileDragEnd,
    onTileDragLeave,
    onTileDragOver,
    onTileDragStart,
    onTileDrop,
    openTileEditor,
    _state,
  } from "../state/layout.svelte";

  interface Props {
    tile?: Tile;
    index: number;
  }

  let { tile, index }: Props = $props();
</script>

{#if tile}
  <button
    draggable="true"
    ondragstart={(ev) => onTileDragStart(ev, index)}
    ondragend={onTileDragEnd}
    ondragover={(ev) => onTileDragOver(ev, index)}
    ondragleave={onTileDragLeave}
    ondrop={(ev) => onTileDrop(ev, index)}
    onclick={() => openTileEditor(index)}
    class="
      bg-white/10 rounded-xl flex flex-col items-center justify-center
      w-full h-full border-2 border-white/10 cursor-grab active:cursor-grabbing
      hover:bg-white/10 hover:-translate-y-1 transition-all duration-150
      backdrop-blur-sm hover:border-blue-500
      {_state.selectedTileIndex === index
      ? 'border-blue-400'
      : 'border-white/10'}
      {_state.dragSourceIndex === index ? 'opacity-40 scale-95' : ''}
      {_state.dragOverIndex === index && _state.dragSourceIndex !== index
      ? 'border-dashed border-white/60 bg-white/10'
      : 'border-solid'}
    "
  >
    {#if tile.iconName}
      <img
        src="/assets/icons/{tile.iconName}.png"
        alt="icon"
        class="max-w-[40%] max-h-[40%]"
        draggable="false"
      />
    {/if}
    {#if tile.label}
      <span class="text-sm font-bold mt-2 text-white/85">{tile.label}</span>
    {/if}
  </button>
{:else}
  <div
    role="gridcell"
    aria-label="Empty cell"
    tabindex="-1"
    ondragover={(ev) => onTileDragOver(ev, index)}
    ondragleave={onTileDragLeave}
    ondrop={(ev) => onTileDrop(ev, index)}
    class="
      w-full h-full rounded-xl border transition-all duration-150
      {_state.dragOverIndex === index
      ? 'border-dashed border-white/60 bg-white/10'
      : 'border-dashed border-white/10'}
    "
  ></div>
{/if}
