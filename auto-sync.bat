@echo off
echo UčimZnam - Auto GitHub Sync
echo =============================

echo 1. Proveravam status...
git status

echo.
echo 2. Dodajem sve izmene...
git add .

echo.
echo 3. Commit-ujem izmene...
git commit -m "Auto sync - %date% %time%"

echo.
echo 4. Šaljem na GitHub...
git push origin master

echo.
echo 5. Proveravam status nakon sync-a...
git status

echo.
echo Sync završen! Pritisni Enter za zatvaranje...
pause
