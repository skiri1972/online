# UčimZnam - Data Synchronization Guide

## Problem
Aplikacija na GitHub Pages koristi **localStorage** koji je specifičan za svaki browser i uređaj. Zbog toga podaci nisu sinhronizovani između mobilnog i desktop uređaja.

## Solution
Kreirana je **SyncConfig** klasa koja omogućava automatsko prebacivanje između localStorage i API modova.

## How to Fix Data Synchronization

### Option 1: Deploy Backend API (Recommended)

1. **Deploy Backend na Vercel/Heroku:**
```bash
# Clone backend repo
git clone <backend-repo>
cd ucimznam-backend

# Deploy na Vercel
vercel --prod

# Ažuriraj URL u sync-config.js
```

2. **Postavi USE_API = true:**
```javascript
// U sync-config.js
const SyncConfig = {
    USE_API: true, // Promeni u true
    API_BASE_URL: 'https://your-backend.vercel.app/api', // Tvoj deployed URL
    // ...
};
```

3. **Commit i push na GitHub:**
```bash
git add .
git commit -m "Enable API synchronization"
git push origin main
```

### Option 2: Cloud Storage (Quick Fix)

Možeš koristiti Firebase ili drugi cloud storage za sinhronizaciju:

1. **Firebase Realtime Database:**
```javascript
// Dodaj u sync-config.js
async loadFromFirebase() {
    const response = await fetch('https://your-firebase-url.firebaseio.com/data.json');
    return await response.json();
}

async saveToFirebase(key, data) {
    await fetch(`https://your-firebase-url.firebaseio.com/${key}.json`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}
```

### Option 3: GitHub Pages Fallback (Current)

Aplikacija trenutno radi u localStorage modu. Podaci će biti sinhronizovani samo unutar istog browsera na istom uređaju.

## Testing Synchronization

### Test Steps:
1. **Otvori sajt na desktop browseru**
2. **Napravi neke promene (napravi napredak u lekcijama)**
3. **Otvori isti sajt na mobilnom uređaju**
4. **Proveri da li su podaci isti**

### Expected Results:
- **Bez backend-a**: Podaci će biti različiti
- **Sa backend-om**: Podaci će biti sinhronizovani

## Backend Deployment Instructions

### Vercel Deployment:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy backend
cd backend-folder
vercel --prod

# Kopiraj URL i postavi u sync-config.js
```

### Heroku Deployment:
```bash
# Create Heroku app
heroku create ucimznam-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set DB_TYPE=postgresql
heroku config:set JWT_SECRET=tvoj-secret

# Deploy
git push heroku main
```

### Environment Variables:
```bash
# .env fajl
DB_TYPE=postgresql
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=ucimznam
DB_USER=postgres
DB_PASSWORD=your-password
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-username.github.io/ucimznam
```

## Current Status

✅ **Responsive design** - Svi modali rade na mobilnim uređajima  
✅ **SyncConfig created** - Spreman za API mod  
✅ **Fallback system** - Automatsko prebacivanje  
⏳ **Backend deployment** - Potrebno za sinhronizaciju  

## Next Steps

1. **Deploy backend API** na Vercel/Heroku
2. **Update USE_API = true** u sync-config.js
3. **Test synchronization** između uređaja
4. **Commit changes** na GitHub

## Troubleshooting

### Data not syncing?
- Proveri da li je USE_API = true
- Verifikuj API_BASE_URL
- Proveri console za greške

### API not working?
- Proveri da li backend radi
- Verifikaj CORS podešavanja
- Proveri environment variables

### LocalStorage issues?
- Clear browser cache
- Proveri localStorage quota
- Test u drugom browseru

## Support

Za pomoć sa deployment-om:
1. Proveri console logove
2. Testiraj API endpointe
3. Verifikuj environment variables
4. Kontaktiraj development tim
