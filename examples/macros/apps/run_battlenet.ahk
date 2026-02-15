; ============================
; Battle.net: open or bring forward
; ============================

BattleNetPath := "C:\Program Files (x86)\Battle.net\Battle.net Launcher.exe"

if WinExist("ahk_exe Battle.net.exe")
{
    WinActivate
}
else
{
    Run BattleNetPath
}