; ============================
; Brave: open or bring forward
; ============================

BravePath := "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"

if WinExist("ahk_exe brave.exe")
{
    WinActivate
}
else
{
    Run BravePath
}