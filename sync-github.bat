@echo off
echo ========================================
echo    UčimZnam - GitHub Sinhronizacija
echo ========================================
echo.

:: Proveri da li je Git dostupan
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo GRESKA: Git nije instaliran!
    echo Molimo instalirajte Git sa https://git-scm.com/download/win
    pause
    exit /b 1
)

:: Prikazi status repozitorijuma
echo Trenutni status repozitorijuma:
echo ----------------------------------------
git status
echo.

:: Dodaj sve izmene
echo Dodavanje izmena...
git add .
if %errorlevel% neq 0 (
    echo GRESKA pri dodavanju fajlova!
    pause
    exit /b 1
)

:: Pitaj za commit poruku
set /p commit_msg="Unesite poruku za commit (pritisnite Enter za default): "
if "%commit_msg%"=="" set commit_msg=Auto sync %date% %time%

:: Napravi commit
echo.
echo Commit izmena: "%commit_msg%"
git commit -m "%commit_msg%"
if %errorlevel% neq 0 (
    echo GRESKA pri commit-u!
    pause
    exit /b 1
)

:: Push na GitHub
echo.
echo Slanje izmena na GitHub...
git push origin master
if %errorlevel% neq 0 (
    echo GRESKA pri push-u na GitHub!
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Sinhronizacija uspešno završena!
echo ========================================
echo.
timeout /t 3 >nul
exit /b 0
