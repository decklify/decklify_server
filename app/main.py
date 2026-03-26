import sys
import threading
import uvicorn
import win32con
import win32gui
from mdns import start_mdns, stop_mdns
from paths import PATHS
from server import app
from tray import run_tray
import multiprocessing
import logging


formatter = logging.Formatter("%(asctime)s [%(levelname)s] [%(name)s] %(message)s")

file_handler = logging.FileHandler(PATHS["logs"] / "decklify.log", encoding="utf-8")
file_handler.setFormatter(formatter)
file_handler.setLevel(logging.INFO)

root_logger = logging.getLogger()
root_logger.setLevel(logging.INFO)
root_logger.addHandler(file_handler)

if sys.stdout is not None:
    stream_handler = logging.StreamHandler(sys.stdout)
    stream_handler.setFormatter(formatter)
    root_logger.addHandler(stream_handler)

logger = logging.getLogger(__name__)

server: uvicorn.Server | None = None
server_thread: threading.Thread | None = None

PORT = 8000


def cleanup():
    logger.info("Shutting down...")
    stop_mdns()
    if server:
        server.should_exit = True
    if server_thread:
        server_thread.join(timeout=5)
        logger.info("Server thread joined")


def start_server():
    global server

    config = uvicorn.Config(
        app, host="0.0.0.0", port=PORT, log_level="info", reload=False, log_config=None
    )
    server = uvicorn.Server(config)
    server.run()


def create_shutdown_listener():
    def wnd_proc(hwnd, msg, wparam, lparam):
        if msg == win32con.WM_ENDSESSION:
            cleanup()
        return win32gui.DefWindowProc(hwnd, msg, wparam, lparam)

    def message_loop():
        wc = win32gui.WNDCLASS()
        wc.lpfnWndProc = wnd_proc  # type: ignore
        wc.lpszClassName = "DecklifyShutdownListener"  # type: ignore
        win32gui.RegisterClass(wc)
        win32gui.CreateWindow(wc.lpszClassName, "", 0, 0, 0, 0, 0, 0, 0, None, None)  # type: ignore

        win32gui.PumpMessages()

    thread = threading.Thread(target=message_loop, daemon=True)
    thread.start()


if __name__ == "__main__":
    multiprocessing.freeze_support()

    create_shutdown_listener()

    server_thread = threading.Thread(target=start_server)
    server_thread.start()

    start_mdns(PORT)

    run_tray()

    cleanup()
