from pathlib import Path
from paths import PATHS


AHK_SUFFIX = ".ahk"


class Registry:
    def __init__(self):
        self.__reg = {}
        self.reload()

    def reload(self):
        self.__reg.clear()

        for script in PATHS["macros"].rglob(f"*{AHK_SUFFIX}"):
            if script.is_file():
                self.__reg[script.stem] = script

    def getMacro(self, macro_name: str) -> Path | None:
        return self.__reg.get(macro_name)


reg = Registry()
