# 🚀 Firebase Kreiranje - Korak po Korak

## 🔥 KORAK 1: Kreiranje Firebase Projekta

### 1.1 Otvori Firebase Console
- Odi na: **[firebase.google.com](https://firebase.google.com)**
- Klikni **"Go to console"** (gore desno)
- Sign in sa Google nalogom

### 1.2 Kreiraj Novi Projekt
- Klikni **"Add project"**
- Naziv projekta: **`ucimznam-sync`**
- Klikni **"Continue"**
- **Isključi Google Analytics** (ne treba nam)
- Klikni **"Create project"**
- Sačekaj da se projekat kreira (1-2 minuta)

## 🗄️ KORAK 2: Realtime Database Setup

### 2.1 Kreiraj Realtime Database
- U Firebase dashboard, idi na **"Build"** meni (leva strana)
- Klikni **"Realtime Database"**
- Klikni **"Create Database"**

### 2.2 Database Podešavanja
- **Lokacija:** Izaberi **"europe-west1"** (bliže nam je)
- **Security rules:** Izaberi **"Start in test mode"**
- **Cloud storage location:** Izaberi **"europe-west1"**
- Klikni **"Enable"**

### 2.3 Dobij Firebase URL
Nakon što se baza kreira, videćeš URL kao:
```
https://ucimznam-sync-default-rtdb.firebaseio.com
```

**Ovaj URL kopiraj!**

## ⚙️ KORAK 3: Postavi Security Rules

### 3.1 Idi na Rules Tab
- U Realtime Database, klikni **"Rules"** tab
- Zameni postojeće pravila sa:

```json
{
  "rules": {
    ".read": "true",
    ".write": "true"
  }
}
```

### 3.2 Publikuj Pravila
- Klikni **"Publish"**
- Potvrdi sa **"Publish"**

## 🔧 KORAK 4: Ažuriraj SyncConfig

### 4.1 Otvori sync-config.js
- U folderu `c:\Users\PC1\Desktop\UcimZnam\sync-config.js`
- Nađi liniju 7

### 4.2 Zameni Firebase URL
```javascript
// Pre:
API_BASE_URL: 'https://ucimznam-sync-default-rtdb.firebaseio.com',

// Posle (sa tvojim URL-om):
API_BASE_URL: 'https://ucimznam-sync-abc123.firebaseio.com',
```

## 🧪 KORAK 5: Testiranje

### 5.1 Test API Connection
Otvori browser i idi na:
```
https://tvoj-firebase-url.firebaseio.com/data.json
```

Treba da vidiš: `null` (prazna baza)

### 5.2 Test Synchronization
1. **Otvori GitHub Pages sajt na desktop browseru**
2. **Login kao student** (bilo koji email/password)
3. **Napravi neki napredak** (otvori lekciju)
4. **Otvori isti sajt na mobilnom uređaju**
5. **Proveri da li se napredak preneo**

## 📱 KORAK 6: Mobilni Test

### 6.1 Desktop Test
- Otvori sajt na Chrome/Firefox
- Login i napravi napredak

### 6.2 Mobile Test  
- Otvori isti sajt na mobilnom browseru
- Proveri da li su podaci isti

## ✅ Šta će se desiti:

- **Podaci se čuvaju u Firebase bazi**
- **Svi uređaji vide iste podatke**
- **Automatska sinhronizacija u real-time**
- **Fallback na localStorage ako Firebase ne radi**

## 🎯 Nakon što završiš:

1. **Commit i push na GitHub**
2. **Testiraj na više uređaja**
3. **Uživaj u sinhronizovanim podacima!**

---

## 🔥 Brzi Cheatsheet:

```
1. firebase.google.com → Go to console
2. Add project → "ucimznam-sync"
3. Build → Realtime Database → Create Database
4. Europe-west1 → Test mode → Enable
5. Rules → Paste JSON rules → Publish
6. Kopiraj URL → sync-config.js → Save
7. Test na desktop i mobilnom! 🎉
```

**Sve je spremno - samo prati korake!** 🚀
