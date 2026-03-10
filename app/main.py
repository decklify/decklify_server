import sys
import threading
import uvicorn
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


server: uvicorn.Server | None = None


PORT = 8000


def start_server():
    global server

    config = uvicorn.Config(
        app, host="0.0.0.0", port=PORT, log_level="info", reload=False, log_config=None
    )
    server = uvicorn.Server(config)
    server.run()


if __name__ == "__main__":
    multiprocessing.freeze_support()

    server_thread = threading.Thread(target=start_server)
    server_thread.start()

    start_mdns(PORT)

    run_tray()

    if server:
        server.should_exit = True

        server_thread.join()

    stop_mdns()
