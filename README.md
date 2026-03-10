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

#### Web browser editor

To edit the deck configuration

- right click on the tray app
- click `open editor`

This will open the editor in your browser, in case it didn't work you can go to [http://localhost:8000](http://localhost:8000).

In there you'll be able to drag the tiles and pages around and configure them. Once done click the `Save to Server` button and restart the client to load in the new config.

To add macros and icons

- right click on the tray app
- click `open config folder`

To get started take a look at [the example configuration](https://github.com/decklify/decklify_server/tree/master/examples).

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

## Roadmap (not in order)

- [x] Add an editor in the browser to customize the deck (instead of going into the files)
- [x] ~~Add a way to easily change the client's ip address in the editor~~  Add mDNS for automatic pairing
- [ ] Add CONTRIBUTING.md
- [ ] Document code
- [ ] Optional: use https between client and server
- [ ] Change the app icon (or not :))
- [ ] Migrate editor from plain html, js and css to svelte

## License

This project is licensed under the GNU GPLv3 License - see the [COPYING.md](COPYING.md) file for details
