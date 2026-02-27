// main app.js — only the frontend part that needs to change
// (assumes server endpoints remain the same)

document.addEventListener("DOMContentLoaded", () => {
  const deckEl = document.getElementById("deck");
  const pageSelect = document.getElementById("pageSelect");

  const addPageBtn = document.getElementById("addPageBtn");
  const deletePageBtn = document.getElementById("deletePageBtn");

  const addTileBtn = document.getElementById("addTileBtn");
  const deleteTileBtn = document.getElementById("deleteTileBtn");
  const saveBtn = document.getElementById("saveBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  const pageOverview = document.getElementById("pageOverview");
  const pageSettingsBtn = document.getElementById("pageSettingsBtn");

  // Tile editor elements
  const tileEditor = document.getElementById("tileEditor");
  const tileLabelInput = document.getElementById("tileLabel");
  const tileIconInput = document.getElementById("tileIcon");
  const tileMacroInput = document.getElementById("tileMacro");
  const saveTileBtn = document.getElementById("saveTile");
  const cancelTileBtn = document.getElementById("cancelTile");

  // Page settings modal
  const pageSettings = document.getElementById("pageSettings");
  const pageWidthInput = document.getElementById("pageWidth");
  const pageHeightInput = document.getElementById("pageHeight");
  const pageBackgroundInput = document.getElementById("pageBackground");
  const savePageSettingsBtn = document.getElementById("savePageSettings");
  const cancelPageSettingsBtn = document.getElementById("cancelPageSettings");

  let layout = null;
  let currentTile = null;
  let currentTileIndex = null;
  let currentPageIndex = 0;

  let dragSourceIndex = null;
  let isDragging = false;
  let pageDragSource = null;

  async function safeFetchJSON(url, opts) {
    try {
      const res = await fetch(url, opts);
      if (!res.ok) {
        let msg;
        try { const j = await res.json(); msg = j.detail || JSON.stringify(j); }
        catch (e) { msg = await res.text(); }
        throw new Error(`HTTP ${res.status}: ${msg}`);
      }
      return await res.json();
    } catch (err) {
      console.error("fetch error:", err);
      throw err;
    }
  }

  async function loadLayout() {
    try { layout = await safeFetchJSON("/layout"); }
    catch (err) {
      console.warn("Failed to load layout — using default.", err);
      layout = { pages: [{ width: 3, height: 2, backgroundUrl: "", tiles: [] }] };
    }

    if (!Array.isArray(layout.pages) || layout.pages.length === 0) {
      layout.pages = [{ width: 3, height: 2, backgroundUrl: "", tiles: [] }];
    }

    buildPageSelector();
    buildPageOverview();
    renderPage(0);
  }

  function buildPageSelector() {
    pageSelect.innerHTML = "";
    layout.pages.forEach((p, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = `Page ${i + 1} (${p.width}×${p.height})`;
      pageSelect.appendChild(opt);
    });
    pageSelect.value = String(currentPageIndex || 0);
    pageSelect.onchange = () => renderPage(Number(pageSelect.value));
  }

  function buildPageOverview() {
    pageOverview.innerHTML = "";
    layout.pages.forEach((p, i) => {
      const thumb = document.createElement("div");
      thumb.className = "page-thumb";
      thumb.draggable = true;
      thumb.dataset.index = i;
      if (i === currentPageIndex) thumb.classList.add("selected");

      // background layer (fills whole thumb)
      const bg = document.createElement("div");
      bg.className = "thumb-bg";
      if (p.backgroundUrl) {
        bg.style.backgroundImage = `url(${p.backgroundUrl})`;
      } else {
        bg.style.backgroundImage = "";
      }
      thumb.appendChild(bg);

      // dimmer overlay so tiles show clearly
      const dim = document.createElement("div");
      dim.className = "thumb-dim";
      thumb.appendChild(dim);

      // content (title + tiny grid) on top
      const content = document.createElement("div");
      content.className = "thumb-content";

      const title = document.createElement("div");
      title.className = "thumb-title";
      title.textContent = `Page ${i + 1}`;
      content.appendChild(title);

      const grid = document.createElement("div");
      grid.className = "thumb-grid";
      grid.style.gridTemplateColumns = `repeat(${p.width}, 1fr)`;
      grid.style.gridTemplateRows = `repeat(${p.height}, 1fr)`;
      // tiny tiles
      const total = p.width * p.height;
      for (let j = 0; j < total; j++) {
        const t = document.createElement("div");
        t.style.boxSizing = "border-box";
        t.style.width = "100%";
        t.style.height = "100%";
        if (j < p.tiles.length) t.className = "thumb-tile";
        else t.className = "thumb-empty";
        grid.appendChild(t);
      }
      content.appendChild(grid);
      thumb.appendChild(content);

      // clicking selects page (stopPropagation so openers don't close modals)
      thumb.addEventListener("click", (ev) => {
        ev.stopPropagation();
        renderPage(i);
        thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      });

      // dragging to reorder pages
      thumb.addEventListener("dragstart", (ev) => {
        pageDragSource = i;
        thumb.classList.add("dragging");
        try { ev.dataTransfer.setData("text/plain", String(i)); } catch (e) {}
        ev.dataTransfer.effectAllowed = "move";
      });
      thumb.addEventListener("dragend", () => {
        pageDragSource = null;
        thumb.classList.remove("dragging");
        document.querySelectorAll(".page-thumb.drop-target").forEach(n => n.classList.remove("drop-target"));
      });
      thumb.addEventListener("dragover", (ev) => { ev.preventDefault(); thumb.classList.add("drop-target"); });
      thumb.addEventListener("dragleave", () => thumb.classList.remove("drop-target"));
      thumb.addEventListener("drop", (ev) => {
        ev.preventDefault();
        const srcStr = ev.dataTransfer.getData("text/plain");
        const src = srcStr ? parseInt(srcStr, 10) : pageDragSource;
        const tgt = i;
        performPageMove(src, tgt);
        thumb.classList.remove("drop-target");
      });

      pageOverview.appendChild(thumb);
    });
  }

  function performPageMove(src, tgt) {
    if (src == null || tgt == null || src === tgt) return;
    const pages = layout.pages;
    const page = pages.splice(src, 1)[0];
    pages.splice(tgt, 0, page);
    currentPageIndex = pages.indexOf(page);
    buildPageSelector();
    buildPageOverview();
    renderPage(currentPageIndex);
  }

  function renderPage(pageIndex) {
    currentPageIndex = pageIndex;
    const page = layout.pages[pageIndex];

    deckEl.style.gridTemplateColumns = `repeat(${page.width}, 1fr)`;
    deckEl.style.gridTemplateRows = `repeat(${page.height}, 1fr)`;
    deckEl.innerHTML = "";

    if (page.backgroundUrl) deckEl.style.backgroundImage = `url(${page.backgroundUrl})`;
    else deckEl.style.backgroundImage = "";

    const totalCells = page.width * page.height;
    for (let i = 0; i < totalCells; i++) {
      let cellEl;
      if (i < page.tiles.length) {
        const tile = page.tiles[i];
        cellEl = document.createElement("div");
        cellEl.className = "tile";
        cellEl.setAttribute("draggable", "true");
        cellEl.dataset.index = i;

        if (tile.iconName) {
          const img = document.createElement("img");
          img.src = `/assets/icons/${tile.iconName}.png`;
          img.className = "icon";
          cellEl.appendChild(img);
        }

        if (tile.label) {
          const lbl = document.createElement("div");
          lbl.className = "label";
          lbl.textContent = tile.label;
          const tileWidth = parseInt(getComputedStyle(deckEl).width, 10) / page.width;
          const fontSize = Math.max(8, Math.min(20, tileWidth * 0.08));
          lbl.style.fontSize = `${fontSize}px`;
          cellEl.appendChild(lbl);
        }

        cellEl.dataset.action = JSON.stringify(tile.action);

        cellEl.addEventListener("click", (ev) => {
          ev.stopPropagation();
          if (isDragging) return;
          currentTile = tile;
          currentTileIndex = i;
          tileLabelInput.value = tile.label ?? "";
          tileIconInput.value = tile.iconName ?? "";
          tileMacroInput.value = tile.action?.Macro?.name ?? "";

          const rect = cellEl.getBoundingClientRect();
          const top = Math.min(window.innerHeight - 260, rect.bottom + window.scrollY + 6);
          const left = Math.min(window.innerWidth - 280, rect.left + window.scrollX);
          tileEditor.style.top = top + "px";
          tileEditor.style.left = left + "px";
          tileEditor.classList.remove("hidden");
        });

        // drag handlers...
        cellEl.addEventListener("dragstart", (ev) => {
          dragSourceIndex = i;
          isDragging = true;
          cellEl.classList.add("dragging");
          try { ev.dataTransfer.setData("text/plain", String(i)); } catch (e) {}
          ev.dataTransfer.effectAllowed = "move";
        });
        cellEl.addEventListener("dragend", () => {
          cellEl.classList.remove("dragging");
          setTimeout(() => { isDragging = false; }, 0);
          dragSourceIndex = null;
          document.querySelectorAll(".cell-drop-target").forEach(n => n.classList.remove("cell-drop-target"));
        });
        cellEl.addEventListener("dragover", (ev) => {
          ev.preventDefault();
          ev.dataTransfer.dropEffect = "move";
          cellEl.classList.add("cell-drop-target");
        });
        cellEl.addEventListener("dragleave", () => cellEl.classList.remove("cell-drop-target"));
        cellEl.addEventListener("drop", (ev) => {
          ev.preventDefault();
          const srcStr = ev.dataTransfer.getData("text/plain");
          const src = srcStr ? parseInt(srcStr, 10) : dragSourceIndex;
          const tgt = parseInt(cellEl.dataset.index, 10);
          performMoveOrSwap(src, tgt);
          cellEl.classList.remove("cell-drop-target");
        });

      } else {
        cellEl = document.createElement("div");
        cellEl.className = "empty";
        cellEl.dataset.index = i;
        cellEl.addEventListener("dragover", (ev) => {
          ev.preventDefault();
          ev.dataTransfer.dropEffect = "move";
          cellEl.classList.add("cell-drop-target");
        });
        cellEl.addEventListener("dragleave", () => cellEl.classList.remove("cell-drop-target"));
        cellEl.addEventListener("drop", (ev) => {
          ev.preventDefault();
          const srcStr = ev.dataTransfer.getData("text/plain");
          const src = srcStr ? parseInt(srcStr, 10) : dragSourceIndex;
          const tgt = parseInt(cellEl.dataset.index, 10);
          performMoveOrSwap(src, tgt);
          cellEl.classList.remove("cell-drop-target");
        });
      }

      deckEl.appendChild(cellEl);
    }

    pageSelect.value = String(currentPageIndex);
    buildPageOverview();
  }

  function performMoveOrSwap(srcIndex, targetIndex) {
    if (srcIndex == null || Number.isNaN(srcIndex) || Number.isNaN(targetIndex)) return;
    const page = layout.pages[currentPageIndex];
    if (srcIndex < 0 || srcIndex >= page.tiles.length) return;

    const occupied = targetIndex < page.tiles.length;
    if (occupied) {
      const tmp = page.tiles[srcIndex];
      page.tiles[srcIndex] = page.tiles[targetIndex];
      page.tiles[targetIndex] = tmp;
    } else {
      const capacity = page.width * page.height;
      let insertIndex = Math.min(targetIndex, capacity - 1);
      const tile = page.tiles.splice(srcIndex, 1)[0];
      if (insertIndex > srcIndex) insertIndex = insertIndex - 1;
      insertIndex = Math.max(0, Math.min(page.tiles.length, insertIndex));
      page.tiles.splice(insertIndex, 0, tile);
    }

    currentTile = null;
    currentTileIndex = null;
    renderPage(currentPageIndex);
  }

  // Page ops
  function addPage() {
    layout.pages.push({ width: 3, height: 2, backgroundUrl: "", tiles: [] });
    currentPageIndex = layout.pages.length - 1;
    buildPageSelector();
    buildPageOverview();
    renderPage(currentPageIndex);
  }
  function deletePage() {
    if (!confirm("Delete current page?")) return;
    layout.pages.splice(currentPageIndex, 1);
    if (layout.pages.length === 0) layout.pages.push({ width: 3, height: 2, backgroundUrl: "", tiles: [] });
    currentPageIndex = Math.max(0, currentPageIndex - 1);
    buildPageSelector();
    buildPageOverview();
    renderPage(currentPageIndex);
  }

  function openPageSettings(ev) {
    // stop the click from bubbling to document-level outside-click handler
    if (ev && ev.stopPropagation) ev.stopPropagation();

    const p = layout.pages[currentPageIndex];
    pageWidthInput.value = p.width;
    pageHeightInput.value = p.height;
    pageBackgroundInput.value = p.backgroundUrl ?? "";
    const deckRect = deckEl.getBoundingClientRect();
    pageSettings.style.top = (deckRect.top + window.scrollY + 20) + "px";
    pageSettings.style.left = (deckRect.left + window.scrollX + 20) + "px";
    pageSettings.classList.remove("hidden");
  }

  function savePageSettings() {
    const p = layout.pages[currentPageIndex];
    const newW = Math.max(1, Math.min(10, parseInt(pageWidthInput.value || p.width, 10)));
    const newH = Math.max(1, Math.min(10, parseInt(pageHeightInput.value || p.height, 10)));
    const newBg = pageBackgroundInput.value || "";

    const newCapacity = newW * newH;
    if (p.tiles.length > newCapacity) p.tiles = p.tiles.slice(0, newCapacity);
    p.width = newW;
    p.height = newH;
    p.backgroundUrl = newBg;

    pageSettings.classList.add("hidden");
    buildPageSelector();
    buildPageOverview();
    renderPage(currentPageIndex);
  }

  // Tiles
  function addTile() {
    const page = layout.pages[currentPageIndex];
    const capacity = page.width * page.height;
    if (page.tiles.length >= capacity) { alert("Page is full."); return; }
    page.tiles.push({ label: "New", iconName: "", action: { Macro: { name: "" } } });
    renderPage(currentPageIndex);
  }
  function deleteTile() {
    if (currentTileIndex == null) { alert("No tile selected."); return; }
    const page = layout.pages[currentPageIndex];
    if (currentTileIndex < 0 || currentTileIndex >= page.tiles.length) { alert("Invalid selection."); return; }
    if (!confirm("Delete selected tile?")) return;
    page.tiles.splice(currentTileIndex, 1);
    currentTileIndex = null; currentTile = null;
    tileEditor.classList.add("hidden");
    renderPage(currentPageIndex);
  }

  // Tile editor
  saveTileBtn.addEventListener("click", () => {
    if (currentTile) {
      currentTile.label = tileLabelInput.value;
      currentTile.iconName = tileIconInput.value;
      currentTile.action = { Macro: { name: tileMacroInput.value } };
      renderPage(currentPageIndex);
      tileEditor.classList.add("hidden");
    }
  });
  cancelTileBtn.addEventListener("click", () => tileEditor.classList.add("hidden"));

  // Save to server
  async function saveToServer() {
    try {
      const res = await fetch("/layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(layout),
      });
      if (!res.ok) {
        let detail = await res.text();
        try { const j = JSON.parse(detail); detail = j.detail || detail; } catch (e) {}
        alert("Save failed: " + detail);
        console.error("Save failed:", res.status, detail);
        return;
      }
      alert("Saved successfully.");
    } catch (err) {
      alert("Save error: " + err);
      console.error("Save error:", err);
    }
  }
  function downloadLayout() { window.location.href = "/layout/download"; }

  // Close modals on outside click
  document.addEventListener("click", (ev) => {
    if (!tileEditor.classList.contains("hidden") && !tileEditor.contains(ev.target)) {
      tileEditor.classList.add("hidden");
      currentTile = null; currentTileIndex = null;
    }
    if (!pageSettings.classList.contains("hidden") && !pageSettings.contains(ev.target)) {
      pageSettings.classList.add("hidden");
    }
  });
  tileEditor.addEventListener("click", ev => ev.stopPropagation());
  pageSettings.addEventListener("click", ev => ev.stopPropagation());
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") {
      tileEditor.classList.add("hidden");
      pageSettings.classList.add("hidden");
      currentTile = null; currentTileIndex = null;
    }
  });

  pageSettingsBtn.addEventListener("click", (ev) => openPageSettings(ev));
  addPageBtn.addEventListener("click", (ev) => { ev.stopPropagation(); addPage(); });
  deletePageBtn.addEventListener("click", (ev) => { ev.stopPropagation(); deletePage(); });

  addTileBtn.addEventListener("click", (ev) => { ev.stopPropagation(); addTile(); });
  deleteTileBtn.addEventListener("click", (ev) => { ev.stopPropagation(); deleteTile(); });
  saveBtn.addEventListener("click", (ev) => { ev.stopPropagation(); saveToServer(); });
  downloadBtn.addEventListener("click", (ev) => { ev.stopPropagation(); downloadLayout(); });

  savePageSettingsBtn.addEventListener("click", (ev) => { ev.stopPropagation(); savePageSettings(); });
  cancelPageSettingsBtn.addEventListener("click", (ev) => { ev.stopPropagation(); pageSettings.classList.add("hidden"); });

  // initial load
  loadLayout();
});