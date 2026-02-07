import pystray
from pystray import MenuItem as item
from PIL import Image
from utils import resource_path

from registry import reg


def on_reload(icon, item):
    print("[Tray] Reloading scripts...")
    reg.reload()


def on_show_logs(icon, item):
    print("[Tray] Logs are in the console window")


def on_exit(icon, item):
    print("[Tray] Exiting...")
    icon.stop()


def run_tray():
    image = Image.open(resource_path("resources", "icon", "icon.png"))

    menu = pystray.Menu(
        item("Reload scripts", on_reload),
        item("Show logs", on_show_logs),
        item("Exit", on_exit),
    )

    icon = pystray.Icon("MacroServer", image, "Macro Server", menu)

    icon.run()
