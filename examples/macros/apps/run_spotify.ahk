; ============================
; Spotify: open or bring forward
; ============================

SpotifyShortcut := A_ScriptDir "\..\shortcuts\Spotify.lnk"

if WinExist("ahk_exe Spotify.exe")
{
    WinActivate
}
else
{
    Run SpotifyShortcut
}
