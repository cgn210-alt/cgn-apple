@echo off
cd /d "%~dp0"

if not exist ".git" (
  echo [0/3] git init ...
  git init
  git branch -M main
  git remote add origin https://github.com/cgn210-alt/cgn-apple.git
)

echo ============================================
echo   Uploading site to GitHub ...
echo ============================================
echo.

echo [1/3] git add ...
git add .

echo [2/3] git commit ...
git commit -m "site update"

echo [3/3] git push ...
git push -u origin main

echo.
echo ============================================
echo   DONE!  ( site updated )
echo   Refresh the website in 1-2 minutes:
echo   https://cgn210-alt.github.io/cgn-apple/
echo   ( press Ctrl + F5 to force refresh )
echo ============================================
echo.
echo This window can be closed.
pause
