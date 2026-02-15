; ============================
; PowerShell 7: open or bring forward
; ============================

PwshPath := "C:\Program Files\PowerShell\7\pwsh.exe"

if WinExist("ahk_exe WindowsTerminal.exe")
{
    WinActivate
}
else
{
    Run PwshPath
}
