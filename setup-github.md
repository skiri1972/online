# GitHub Setup Guide

## 1. Kreiraj GitHub repozitorijum
1. Idi na https://github.com
2. Klikni na "+" → "New repository"
3. Nazovi repozitorijum (npr: `ucimznam`)
4. Ostavi kao "Public" ili "Private"
5. NE štikliraj "Add a README file" (već postoji)
6. Klikni "Create repository"

## 2. Poveži lokalni repozitorijum
Nakon što kreiraš repozitorijum, GitHub će ti pokazati komande. Koristi ovu komandu u terminalu:

```bash
git remote add origin https://github.com/TVOJ_USERNAME/ucimznam.git
```

Zameni `TVOJ_USERNAME` sa tvojim GitHub korisničkim imenom.

## 3. Prvo sinhronizovanje
```bash
# Dodaj sve izmene
git add .

# Commit izmene
git commit -m "Initial responsive fixes and mobile optimizations"

// Push na GitHub
git push -u origin master
```

## 4. Automatska sinhronizacija
Nakon svakih izmena, koristi:
```bash
git add .
git commit -m "Opis izmena"
git push
```

## 5. Skidanje promena sa GitHub-a
Ako radiš na drugom kompjuteru:
```bash
git pull origin master
```

## Brzi setup skript
Možeš koristiti i ovu skriptu za brzo povezivanje:

```bash
# Zameni sa svojim podacima
GITHUB_USERNAME="tvoj-username"
REPO_NAME="ucimznam"

# Poveži repozitorijum
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git

// Prvo sinhronizovanje
git add .
git commit -m "Setup mobile responsive design for iPhone 11"
git push -u origin master
```

## Proveri povezivanje
```bash
git remote -v
```
Treba da prikaže GitHub URL.
