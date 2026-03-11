import os

import pystray
from pystray import MenuItem as item
from PIL import Image
import webbrowser
from paths import get_exe_path
from registry import reg
import logging

logger = logging.getLogger(__name__)


def on_reload(icon, item):
    logger.info("Reloading scripts...")
    reg.reload()
    logger.info("Done reloading scripts!")


def open_config(icon, item):
    logger.info("Opening config folder...")
    path = os.path.expandvars(r"%localappdata%/Decklify/Decklify")
    os.startfile(path)
    logger.info("Done opening config folder!")


def open_editor(icon, item):
    logger.info("Opening editor in browser...")
    webbrowser.open("http://localhost:8000/index.html")
    logger.info("Done opening editor in browser!")


def on_exit(icon, item):
    logger.info("Exiting...")
    icon.stop()


def run_tray():
    image = Image.open(get_exe_path() / "assets" / "icon.png")

    menu = pystray.Menu(
        item("Reload scripts", on_reload),
        item("Open editor", open_editor),
        item("Open config folder", open_config),
        item("Exit", on_exit),
    )

    icon = pystray.Icon("Decklify", image, "Decklify server", menu)

    icon.run()
