@echo off
title Hina Habiba Official Website Server
cd /d "%~dp0"
echo ========================================================
echo Starting Hina Habiba Official Website Preview Server...
echo ========================================================
start "" "http://localhost:8080"
node local-server.js 8080
pause
