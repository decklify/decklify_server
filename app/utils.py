import sys
from pathlib import Path


def resource_path(*relative_parts: str) -> Path:
    """
    Returns an absolute Path to a resource file or folder.

    Works in:
    - normal Python execution
    - PyInstaller --onefile frozen executables

    Usage:
        icon = resource_path("ressources", "icon", "icon.png")
        config = resource_path("data", "layout", "config.json")
    """
    if getattr(sys, "_MEIPASS", False):
        # Running in a PyInstaller onefile executable
        base = Path(sys._MEIPASS)  # type: ignore
    else:
        # Running normally, base is directory one level above main.py
        base = Path(__file__).resolve().parent.parent

    return base.joinpath(*relative_parts)
