@echo off
echo ========================================
echo    UčimZnam - GitHub Setup
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

:: Inicijalizuj repozitorijum ako ne postoji
if not exist ".git" (
    echo Inicijalizujem Git repozitorijum...
    git init
    if %errorlevel% neq 0 (
        echo GRESKA pri inicijalizaciji!
        pause
        exit /b 1
    )
    echo Git repozitorijum inicijalizovan.
) else (
    echo Git repozitorijum vec postoji.
)

:: Prikazi trenutni remote
echo.
echo Trenutni remote repozitorijumi:
git remote -v
echo.

:: Pitaj za GitHub URL
set /p github_url="Unesite GitHub repozitorijum URL (npr. https://github.com/username/ucimznam.git): "
if "%github_url%"=="" (
    echo Niste uneli URL!
    pause
    exit /b 1
)

:: Dodaj remote ako ne postoji
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo Dodajem GitHub remote...
    git remote add origin "%github_url%"
    if %errorlevel% neq 0 (
        echo GRESKA pri dodavanju remote-a!
        pause
        exit /b 1
    )
    echo GitHub remote dodat.
) else (
    echo Remote vec postoji, ažuriram...
    git remote set-url origin "%github_url%"
    echo GitHub remote ažuriran.
)

:: Prvi commit ako nema
git log --oneline >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo Pravljenje prvog commit-a...
    git add .
    git commit -m "Initial commit - UčimZnam projekat"
    if %errorlevel% neq 0 (
        echo GRESKA pri prvom commit-u!
        pause
        exit /b 1
    )
    echo Prvi commit napravljen.
)

echo.
echo ========================================
echo    GitHub setup završen!
echo ========================================
echo.
echo Sada možete koristiti sync-github.bat za sinhronizaciju.
echo.
timeout /t 3 >nul
exit /b 0
