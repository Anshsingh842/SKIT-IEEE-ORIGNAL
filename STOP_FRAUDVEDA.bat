@echo off
title Stop FraudVeda AI
color 0C
cd /d "%~dp0"

echo Stopping FraudVeda AI background processes...
taskkill /F /IM FraudVeda.exe >nul 2>&1
taskkill /F /IM SocialSentinel_Chowkidaar.exe >nul 2>&1

:: Safely terminate only the server process listening on port 8765 without touching browser tabs
for /f "tokens=5" %%a in ('netstat -aon ^| findstr /R /C:":8765 .*LISTENING"') do taskkill /F /PID %%a >nul 2>&1

echo.
echo FraudVeda successfully stopped!
timeout /t 2 >nul
exit
