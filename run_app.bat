@echo off
setlocal
title Jewellery Calculator Launcher

:: Stop any existing instance
taskkill /F /FI "WINDOWTITLE eq Jewellery_Server*" /T >nul 2>nul

echo Checking for Node.js...
where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Node.js found. Starting server...
    start "Jewellery_Server" /MIN cmd /c "title Jewellery_Server && node server.js"
    echo Waiting for server to start...
    timeout /t 2 /nobreak >nul
    start http://localhost:3000
    goto :WaitToClose
)

echo Checking for Python...
where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Python found. Starting server...
    start "Jewellery_Server" /MIN cmd /c "title Jewellery_Server && python -m http.server 3000"
    echo Waiting for server to start...
    timeout /t 2 /nobreak >nul
    start http://localhost:3000
    goto :WaitToClose
)

echo ERROR: Neither Node.js nor Python is installed!
echo.
echo Please install Node.js to run this application locally.
echo Instructions:
echo 1. Download installer from https://nodejs.org
echo 2. OR open PowerShell and run: winget install OpenJS.NodeJS
echo.
pause
exit /b 1

:WaitToClose
echo.
echo ==================================================
echo Jewellery Calculator is running at http://localhost:3000
echo ==================================================
echo.
echo Press any key to stop the server and exit...
pause >nul

echo Stopping server...
taskkill /F /FI "WINDOWTITLE eq Jewellery_Server*" /T >nul 2>nul
echo Server stopped. Goodbye!
timeout /t 2 >nul
