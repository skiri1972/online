# Firebase Setup za UčimZnam sinhronizaciju

## Korak-po-korak uputstvo

### 1. Kreiraj Firebase projekt
1. Odi na [firebase.google.com](https://firebase.google.com)
2. Klikni "Get started" ili "Go to console"
3. Kreiraj novi projekt: "UčimZnam"
4. Skipni Google Analytics (opciono)

### 2. Postavi Realtime Database
1. U Firebase console, idi na "Build" → "Realtime Database"
2. Klikni "Create Database"
3. Izaberi lokaciju (npr. europe-west1)
4. Start u "test mode" (dozvoli read/write)
5. Klikni "Enable"

### 3. Kopiraj Firebase URL
Nakon što kreiraš bazu, videćeš URL kao:
```
https://ucimznam-default-rtdb.firebaseio.com
```

### 4. Ažuriraj sync-config.js
Zameni postojeći URL sa tvojim:
```javascript
const SyncConfig = {
    USE_API: true,
    API_BASE_URL: 'https://tvoj-firebase-url.firebaseio.com',
    // ...
};
```

### 5. Postavi Firebase pravila
U Firebase Realtime Database → Rules, postavi:
```json
{
  "rules": {
    ".read": "true",
    ".write": "true"
  }
}
```

### 6. Testiraj sinhronizaciju
1. Otvori sajt na desktop browseru
2. Napravi napredak u lekciji
3. Otvori isti sajt na mobilnom uređaju
4. Proveri da li se napredak sinhronizovao

## Alternativa: Koristi moj Firebase URL

Možeš koristiti moj već kreiran Firebase URL:
```
https://ucimznam-default-rtdb.firebaseio.com
```

Ovaj URL je već podešen u sync-config.js fajlu.

## Šta se desava?

- Podaci se čuvaju u Firebase Realtime Database
- Svi uređaji vide iste podatke
- Automatska sinhronizacija u real-time
- Fallback na localStorage ako Firebase ne radi

## Troubleshooting

### CORS greška?
Firebase podržava CORS za web aplikacije.

### Podaci se ne sinhronizuju?
- Proveri console za greške
- Verifikuj Firebase URL
- Proveri internet konekciju

### Firebase ne radi?
Aplikacija automatski pada na localStorage mod.

## Next Steps

1. Kreiraj Firebase projekat
2. Kopiraj URL
3. Testiraj sinhronizaciju
4. Commit i push na GitHub
