from pathlib import Path
from platformdirs import user_data_dir
import sys


def get_exe_path() -> Path:
    """
    Returns the base path of the executable
    this is useful to access data that has been bundled with the app e.g. its icon
    """
    if getattr(sys, "frozen", False):
        # running in PyInstaller bundle
        return Path(sys.executable).parent / "_internal"
    else:
        # running in dev
        return Path(__file__).resolve().parents[1]


def __paths():
    """
    Returns a dictionary of important app paths
    and ensures they exist.
    """

    APP_NAME = "Decklify"

    if getattr(sys, "frozen", False):
        # running in PyInstaller bundle
        base = Path(user_data_dir(APP_NAME))
    else:
        # running in dev
        base = Path(__file__).resolve().parents[1] / "userdata"

    paths = {
        "base": base,
        "config": base / "config",
        "assets": (assets := base / "assets"),
        "tile_icons": assets / "tile_icons",
        "macros": base / "macros",
        "logs": base / "logs",
    }

    for p in paths.values():
        p.mkdir(parents=True, exist_ok=True)

    return paths


PATHS = __paths()
