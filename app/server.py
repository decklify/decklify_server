import json
from ahk import AHK
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from paths import PATHS

from registry import reg


app = FastAPI()
ahk = AHK(version="v2")

app.mount("/assets/icons", StaticFiles(directory=PATHS["tile_icons"]), name="assets")

CONFIG_PATH = PATHS["config"] / "config.json"


@app.get("/layout")
async def get_layout():
    if not CONFIG_PATH.exists():
        raise HTTPException(status_code=404, detail="Config file not found")

    with CONFIG_PATH.open("r", encoding="utf-8") as f:
        data = json.load(f)

    return data


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
