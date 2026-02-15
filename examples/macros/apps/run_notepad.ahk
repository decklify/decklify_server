; ============================
; Notepad++: open or bring forward
; ============================

NppPath := "C:\Program Files\Notepad++\notepad++.exe"

if WinExist("ahk_exe notepad++.exe")
{
    WinActivate
}
else
{
    Run NppPath
}
