# Decklify Server

The server component of Decklify, written in Python.

## Getting Started

> [!IMPORTANT]
> The installer and AutoHotkey only work on Windows.

### Prerequisites

* [AutoHotkey](https://www.autohotkey.com/) installed and running.

### Installation

Download the installer from the [Releases](https://github.com/decklify/decklify_server/releases) page and run it.

> [!NOTE]
> Because the binary is not digitally signed, Windows Defender may flag the installer as potentially dangerous. This is expected. You can safely proceed if you downloaded it from this repository's Releases page. For extra assurance, verify the file checksum provided alongside the release.

### Configuration

#### Web Browser Editor

To edit the deck configuration:

1. Right-click the tray icon.
2. Click **Open Editor**.

This opens the editor in your browser. If it doesn't open automatically, navigate to [http://localhost:8000/ui/index.html](http://localhost:8000/ui/index.html).

From there, you can drag tiles and pages to rearrange them and configure each one. When you're done, click **Upload**, then tap **Reload** on the client to apply the new configuration.

To add macros and icons:

1. Right-click the tray icon.
2. Click **Open Config Folder**.

To get started customizing your deck, check out [the example configuration](https://github.com/decklify/decklify_server/tree/master/examples).

#### Folder Structure
```
Decklify/
├── assets/
│   └── tile_icons/
├── config/
├── logs/
└── macros/
```

* **assets** - Media files served to the client.
  * **tile_icons** - Icons displayed on tiles.
* **config** - A JSON file describing the page layout, tiles, actions, labels, and icons.
* **logs** - Server log files.
* **macros** - AutoHotkey scripts.

## Built With

* [Python](https://www.python.org/) - Language
* [uv](https://docs.astral.sh/uv/) - Package manager
* [FastAPI](https://fastapi.tiangolo.com/) - Web server
* [pystray](https://github.com/moses-palmer/pystray) - System tray integration
* [ahk](https://github.com/spyoungtech/ahk) - AutoHotkey Python wrapper
* [Pillow](https://pillow.readthedocs.io/en/stable/) - Image manipulation
* [platformdirs](https://github.com/tox-dev/platformdirs) - Platform directory resolution
* [zeroconf](https://github.com/python-zeroconf/python-zeroconf) - mDNS library
* [PyInstaller](https://pyinstaller.org/en/stable/) - Bundler
* [Inno Setup](https://jrsoftware.org/isinfo.php) - Windows installer builder

## Roadmap (not in order)

- [x] Add a browser-based editor for deck customization
- [x] ~~Add a way to manually change the client's IP in the editor~~ Add mDNS for automatic pairing
- [x] Migrate editor from plain HTML/JS/CSS to Svelte
- [ ] Add CONTRIBUTING.md
- [ ] Document code
- [ ] Change the app icon (or not :))
- [ ] Optional: use HTTPS between client and server

## License

This project is licensed under the GNU GPLv3 License - see the [COPYING.md](COPYING.md) file for details.