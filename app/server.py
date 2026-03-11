import json
from pathlib import Path
import shutil
from ahk import AHK
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from paths import PATHS, get_exe_path

from registry import reg


app = FastAPI()
ahk = AHK(version="v2")


STATIC_PATH = Path(__file__).parent.parent / "decklify-ui/dist"


@app.get("/")
def root():
    return FileResponse(STATIC_PATH / "index.html")


@app.get("/layout")
async def get_layout():
    CONFIG_FILE = PATHS["config"] / "config.json"

    if not CONFIG_FILE.exists():
        DUMMY_FILE = get_exe_path() / "assets" / "dummy-config.json"
        if not DUMMY_FILE.exists():
            raise HTTPException(status_code=404, detail="dummy-config.json not found")

        CONFIG_FILE.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy(DUMMY_FILE, CONFIG_FILE)

    with CONFIG_FILE.open("r", encoding="utf-8") as f:
        data = json.load(f)

    return data


@app.post("/layout")
async def save_layout(request: Request):
    """
    Accepts JSON layout in the body and writes it to layout.json.
    Basic validation: must contain 'pages' as a list.
    """
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    if (
        not isinstance(data, dict)
        or "pages" not in data
        or not isinstance(data["pages"], list)
    ):
        raise HTTPException(
            status_code=400, detail="Layout must be a JSON object with a 'pages' array"
        )

    try:
        with open(PATHS["config"] / "config.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to write layout: {e}")

    return {"ok": True}


@app.post("/macro/{macro_name}")
def macro(macro_name: str):
    script = reg.getMacro(macro_name)

    if script is None:
        raise HTTPException(status_code=404, detail=f"Unknown macro '{macro_name}'.")

    try:
        ahk.run_script(str(script), blocking=False)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Macro '{macro_name}' failed: {e}")

    return {"status": "ok", "macro": macro_name}


app.mount("/assets/icons", StaticFiles(directory=PATHS["tile_icons"]), name="assets")
app.mount("/", StaticFiles(directory=STATIC_PATH, html=True), name="static")
