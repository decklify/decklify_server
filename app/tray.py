import pystray
from pystray import MenuItem as item
from PIL import Image

from paths import get_exe_path
from registry import reg


def on_reload(icon, item):
    print("[Tray] Reloading scripts...")
    reg.reload()


def on_exit(icon, item):
    print("[Tray] Exiting...")
    icon.stop()


def run_tray():
    image = Image.open(get_exe_path() / "assets" / "icon.png")

    menu = pystray.Menu(
        item("Reload scripts", on_reload),
        item("Exit", on_exit),
    )

    icon = pystray.Icon("Decklify", image, "Decklify server", menu)

    icon.run()
