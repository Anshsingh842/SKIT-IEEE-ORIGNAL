@echo off
chcp 65001 >nul
title FraudVeda - AI Threat Watchdog Launcher
color 0B
cd /d "%~dp0"

echo ==============================================================
echo             FRAUDVEDA - AI THREAT WATCHDOG
echo ==============================================================
echo  Starting FraudVeda on your screen...
echo.

:: 1. Launch standalone EXE if present
if exist "%~dp0FraudVeda.exe" (
    start "" "%~dp0FraudVeda.exe"
    goto WAIT_SERVER
)
if exist "%~dp0SocialSentinel_Chowkidaar.exe" (
    start "" "%~dp0SocialSentinel_Chowkidaar.exe"
    goto WAIT_SERVER
)

:: 2. Launch via pythonw if available
where pythonw >nul 2>&1
if %ERRORLEVEL% equ 0 (
    start "" pythonw "%~dp0watchdog_widget.py"
    goto WAIT_SERVER
)

:: 3. Launch via py launcher or python
where py >nul 2>&1
if %ERRORLEVEL% equ 0 (
    start "" py -3 "%~dp0watchdog_widget.py"
    goto WAIT_SERVER
)

where python >nul 2>&1
if %ERRORLEVEL% equ 0 (
    start "" /b python "%~dp0watchdog_widget.py"
    goto WAIT_SERVER
)

echo [ERROR] Neither FraudVeda.exe nor Python was found on this system!
pause
exit /b 1

:WAIT_SERVER
echo  Waiting for FraudVeda local server to initialize...
:: Wait loop with timeout to prevent connection refused race condition
timeout /t 4 /nobreak >nul

echo  Opening FraudVeda Live SOC Dashboard...
start "" "http://127.0.0.1:8765/index.html"

echo  Opening YouTube Shorts...
start "" "https://www.youtube.com/shorts"

cls
echo ==============================================================
echo      [SUCCESS] FRAUDVEDA AI SCREEN PAR CHAL RAHA HAI!
echo ==============================================================
echo.
echo  1. Screen ke bottom-right mein 🛡️ FraudVeda bot activate hai.
echo  2. SOC Analytics Dashboard aapke browser mein open ho gaya.
echo  3. YouTube Shorts scroll kijiye - scam aate hi alert aayega!
echo  4. Bot band karne ke liye 'STOP_FRAUDVEDA.bat' chalayein.
echo.
echo ==============================================================
timeout /t 4 >nul
exit
