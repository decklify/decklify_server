import threading
import uvicorn
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


server: uvicorn.Server | None = None


def start_server():
    global server

    config = uvicorn.Config(
        app, host="0.0.0.0", port=8000, log_level="info", reload=False, log_config=None
    )
    server = uvicorn.Server(config)
    server.run()


if __name__ == "__main__":
    multiprocessing.freeze_support()

    server_thread = threading.Thread(target=start_server)
    server_thread.start()

    run_tray()

    if server:
        server.should_exit = True

        server_thread.join()
