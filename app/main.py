import threading
import uvicorn
from server import app
from tray import run_tray


server: uvicorn.Server | None = None


def start_server():
    global server

    config = uvicorn.Config(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info",
    )
    server = uvicorn.Server(config)
    server.run()


if __name__ == "__main__":
    server_thread = threading.Thread(target=start_server)
    server_thread.start()

    run_tray()

    if server:
        server.should_exit = True

        server_thread.join()
