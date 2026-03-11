<script lang="ts">
  import { fly } from "svelte/transition";
  import { uploadLayout } from "../api";
  import { _state } from "../state/layout.svelte";

  interface Props {
    addPage: () => void;
    deletePage: () => void;
    openPageSettings: () => void;
    addTile: () => void;
    deleteTile: (index: number) => void;
  }

  let { addPage, deletePage, openPageSettings }: Props = $props();

  type Status = "idle" | "success" | "error" | "loading";
  let status = $state<Status>("idle");

  const label = $derived(
    status === "idle"
      ? "Upload"
      : status === "loading"
        ? "Loading..."
        : status === "success"
          ? "✓"
          : "✕",
  );

  async function handleSave() {
    if (status !== "idle") return;
    status = "loading";
    try {
      await uploadLayout();
      status = "success";
      setTimeout(() => (status = "idle"), 2000);
    } catch {
      status = "error";
      setTimeout(() => (status = "idle"), 2000);
    }
  }
</script>

<div
  class="w-full flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-white/10"
>
  <!-- Left: page controls -->
  <div class="flex items-center gap-2">
    <select
      value={_state.currentPageIndex}
      onchange={(e) =>
        (_state.currentPageIndex = Number(
          (e.target as HTMLSelectElement).value,
        ))}
      class="px-2 py-1.5 rounded bg-white/5 border border-white/10 text-white text-sm min-w-35"
    >
      {#each _state.layout.pages as page, i}
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

  <!-- save -->
  <div class="flex items-center gap-2">
    <button
      onclick={handleSave}
      class="overflow-hidden relative px-3 py-1.5 rounded border text-sm transition-colors duration-300
    {status === 'loading'
        ? 'border-orange-500/40 bg-orange-500/15 text-orange-400 hover:bg-orange-500/25'
        : status === 'error'
          ? 'border-red-500/40 bg-red-500/15 text-red-400 hover:bg-red-500/25'
          : 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'}"
      style="min-width: 4rem;"
    >
      <span class="invisible select-none pointer-events-none" aria-hidden="true"
        >Loading...</span
      >
      {#key status}
        <span
          in:fly={{ y: 8, duration: 200, delay: 200 }}
          out:fly={{ y: -8, duration: 200 }}
          class="absolute inset-0 flex items-center justify-center"
          style="will-change: transform;"
        >
          {label}
        </span>
      {/key}
    </button>
  </div>
</div>
