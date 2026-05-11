@echo off
setlocal enabledelayedexpansion

:: Boje za ispis
set "GREEN=[32m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "RESET=[0m"

echo %BLUE%========================================%RESET%
echo %BLUE%   UčimZnam - GitHub Sinhronizacija%RESET%
echo %BLUE%========================================%RESET%
echo.

:: Proveri da li je Git dostupan
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%GRESKA: Git nije instaliran!%RESET%
    echo Molimo instalirajte Git sa https://git-scm.com/download/win
    pause
    exit /b 1
)

:: Proveri da li smo u Git repozitorijumu
if not exist ".git" (
    echo %RED%GRESKA: Ovo nije Git repozitorijum!%RESET%
    echo Inicijalizujem repozitorijum...
    git init
    if %errorlevel% neq 0 (
        echo %RED%GRESKA pri inicijalizaciji!%RESET%
        pause
        exit /b 1
    )
    echo %GREEN%Repozitorijum inicijalizovan.%RESET%
)

:: Prikazi informacije o repozitorijumu
echo %YELLOW%Informacije o repozitorijumu:%RESET%
echo ----------------------------------------
git remote -v
echo.
git status --short
echo.

:: Proveri da li ima izmena
git diff --quiet
if %errorlevel% equ 0 (
    echo %GREEN%Nema izmena za sinhronizaciju.%RESET%
    echo.
    set /p choice="Da li želite da forsirate push? (y/N): "
    if /i "!choice!" neq "y" (
        echo Operacija otkazana.
        pause
        exit /b 0
    )
)

:: Pull pre push-a da bi izbegli konflikte
echo %YELLOW%Preuzimanje poslednjih izmena sa GitHub...%RESET%
git pull origin master
if %errorlevel% neq 0 (
    echo %YELLOW%Upozorenje: Pull nije uspeo, nastavljam...%RESET%
)

:: Dodaj sve izmene
echo %YELLOW%Dodavanje izmena...%RESET%
git add .
if %errorlevel% neq 0 (
    echo %RED%GRESKA pri dodavanju fajlova!%RESET%
    pause
    exit /b 1
)

:: Prikazi šta će biti commit-ovano
echo.
echo %BLUE%Fajlovi za commit:%RESET%
git status --short
echo.

:: Pitaj za commit poruku
set /p commit_msg="Unesite poruku za commit (pritisnite Enter za default): "
if "%commit_msg%"=="" set commit_msg=Auto sync %date% %time%

:: Napravi commit
echo.
echo %YELLOW%Commit izmena: "%commit_msg%"%RESET%
git commit -m "%commit_msg%"
if %errorlevel% neq 0 (
    echo %RED%GRESKA pri commit-u!%RESET%
    pause
    exit /b 1
)

:: Push na GitHub
echo.
echo %YELLOW%Slanje izmena na GitHub...%RESET%
git push origin master
if %errorlevel% neq 0 (
    echo %RED%GRESKA pri push-u na GitHub!%RESET%
    echo Proverite internet vezu i GitHub pristup.
    pause
    exit /b 1
)

echo.
echo %GREEN%========================================%RESET%
echo %GREEN%   Sinhronizacija uspešno završena!%RESET%
echo %GREEN%========================================%RESET%
echo.

:: Prikazi statistiku
echo %BLUE%Statistika:%RESET%
git log --oneline -5
echo.

timeout /t 3 >nul
exit /b 0
