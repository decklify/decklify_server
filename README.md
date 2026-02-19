# Decklify server

The server for the Decklify client written in Python.

## Getting started

> [!Important]
> The installer and Auto Hot key only work on Windows

### Prerequisites

* [Auto Hot key](https://www.autohotkey.com/) installed and runnning.

### Installing

Download the installer from the releases and install the server.

> [!NOTE]
> Since the binary is not digitally signed, Windows Defender may warn that the installer is potentially dangerous. This warning is expected. You can safely proceed if you downloaded the installer from this repository’s Releases section. For extra assurance, you may verify the file checksum provided along in the releases.

### Configuration

To configure the server and macros, press `Win + r` and go to `%localappdata%/Decklify/Decklify`. To get started take a look at [the example configuration](https://github.com/decklify/decklify_server/tree/master/examples).

#### Folder structure

```
Decklify/
├── assets/
│   └── tile_icons/
├── config/
├── logs/
└── macros/
```

* assets: contains media that can be requested by the client.
    * tile_icons: contains the icon of the tiles.
* config: contains a json file that describes the page layout, the tiles, their action, their label (optional) and their icon (optional).
* logs: contains the logs of the server.
* macros: contains the ahk scripts.

## Built With

* [Python](https://www.python.org/) - The language
* [uv](https://docs.astral.sh/uv/) - The package manager
* [FastAPI](https://fastapi.tiangolo.com/) - The webserver
* [pystray](https://github.com/moses-palmer/pystray) - The tray
* [ahk](https://github.com/spyoungtech/ahk) - The Auto Hot Key Python wrapper
* [Pillow](https://pillow.readthedocs.io/en/stable/) - Image manipulation
* [platformdirs](https://github.com/tox-dev/platformdirs) - Platform directory handler
* [PyInstaller](https://pyinstaller.org/en/stable/) - The bundler
* [Inno Setup](https://jrsoftware.org/isinfo.php) - The installation builder for Windows

## Roadmap

- [ ] Add CONTRIBUTING.md
- [ ] Document code
- [ ] Add an editor in the browser to customize the deck (instead of going into the files)
- [ ] Change the app icon (or not :))
- [ ] Think of more things to do

## License

This project is licensed under the GNU GPLv3 License - see the [COPYING.md](COPYING.md) file for details
