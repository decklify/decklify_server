; ============================
; Steam: open or bring forward
; ============================

SteamPath := "C:\Program Files (x86)\Steam\steam.exe"

if WinExist("ahk_exe steam.exe")
{
    WinActivate
}
else
{
    Run SteamPath
}
