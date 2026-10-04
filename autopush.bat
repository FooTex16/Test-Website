@echo off
title EduVerse - Auto-Push ke GitHub & Vercel
color 0B
cd /d "%~dp0"
echo ========================================================
echo   EduVerse Git Auto-Push Listener
echo ========================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0autopush.ps1"
pause
