@echo off
setlocal

cd /d "%~dp0"

set "NODE_EXE=C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
set "TEST_URL=http://localhost:5173"

echo Starting plant-app local test server...
echo.
echo Keep this window open while testing.
echo Open this address if the browser does not open automatically:
echo %TEST_URL%
echo.

start "" powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Sleep -Seconds 1; Start-Process '%TEST_URL%'"

if exist "%NODE_EXE%" (
  "%NODE_EXE%" server.js
) else (
  node server.js
)

pause
