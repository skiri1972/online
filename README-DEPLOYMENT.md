# UčimZnam - Deployment Guide

## Overview
UčimZnam sada podržava punu bazu podataka umesto localStorage, omogućavajući rad na internetu sa trajnim čuvanjem podataka.

## Database Options

### 1. SQLite (Development/Small Scale)
- **Prednosti**: Jednostavno podešavanje, fajl-bazirana, bez dodatnih servisa
- **Nedostaci**: Ne podržava konkurentnost, ograničena skalabilnost
- **Korišćenje**: Podrazumevana opcija

### 2. PostgreSQL (Production/Scale)
- **Prednosti**: Visoka performanse, podrška za više korisnika, napredne funkcije
- **Nedostaci**: Zahteva PostgreSQL server
- **Korišćenje**: Preporučeno za produkciju

## Setup Instructions

### 1. Backend Setup

```bash
# Instaliraj dependencies
npm install

# Kopiraj environment fajl
cp .env.example .env

# Edituj .env fajl
nano .env
```

### 2. Database Setup

#### SQLite (podrazumevano):
```bash
# Kreiraj SQLite bazu
node scripts/migrate.js
```

#### PostgreSQL:
```bash
# Instaliraj PostgreSQL
# Ubuntu/Debian:
sudo apt-get install postgresql postgresql-contrib

# Kreiraj bazu
sudo -u postgres createdb ucimznam
sudo -u postgres createuser --interactive ucimznam_user

# Importuj šemu
psql -U ucimznam_user -d ucimznam -f database-schema.sql
```

### 3. Pokretanje servera

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Prijava
- `POST /api/auth/register` - Registracija (zahtev za odobrenje)

### Chapters
- `GET /api/chapters` - Sva poglavlja
- `POST /api/chapters` - Novo poglavlje (admin/teacher)

### Lessons
- `GET /api/chapters/:id/lessons` - Lekcije u poglavlju
- `GET /api/lessons/:id` - Detalji lekcije
- `POST /api/lessons` - Nova lekcija
- `PUT /api/lessons/:id` - Izmena lekcije
- `DELETE /api/lessons/:id` - Brisanje lekcije

### Progress
- `GET /api/progress/:userId` - Napredak korisnika
- `POST /api/progress` - Sačuvaj napredak

### Student Requests
- `GET /api/student-requests` - Lista zahteva (admin/teacher)
- `POST /api/student-requests/:id/approve` - Odobri zahtev
- `POST /api/student-requests/:id/reject` - Odbij zahtev

## Frontend Integration

### 1. Dodaj API client u HTML
```html
<script src="api-client.js"></script>
```

### 2. Zameni localStorage pozive sa API pozivima

**Pre (localStorage):**
```javascript
const data = localStorage.getItem('uz_chapters');
```

**Posle (API):**
```javascript
const data = await api.getChapters();
```

### 3. Autentifikacija
```javascript
// Prijava
try {
    const result = await api.login(email, password);
    // Uspešna prijava
} catch (error) {
    // Greška
}

// Provera autentifikacije
const user = api.getCurrentUser();
if (user) {
    // Korisnik je prijavljen
}
```

## Deployment Options

### 1. Vercel (Recommended)
```bash
# Instaliraj Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 2. Heroku
```bash
# Kreiraj Heroku app
heroku create ucimznam-api

# Postavi environment variables
heroku config:set NODE_ENV=production
heroku config:set DB_TYPE=postgresql
heroku config:set JWT_SECRET=tvoj-secret

# Deploy
git push heroku main
```

### 3. DigitalOcean
```bash
# Kreiraj droplet sa Node.js
# Postavi PostgreSQL
# Koristi PM2 za process management
pm2 start server.js --name ucimznam-api
```

### 4. Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Security Considerations

1. **JWT Secret**: Koristi jak, nasumičan secret
2. **Environment Variables**: Nikada ne commituj .env fajl
3. **HTTPS**: Uvek koristi HTTPS u produkciji
4. **Rate Limiting**: Već implementirano
5. **Input Validation**: Server-side validacija
6. **Password Hashing**: Bcrypt za sve lozinke

## Monitoring

### Logs
```bash
# Proveri logove
pm2 logs ucimznam-api
```

### Database Backup (PostgreSQL)
```bash
# Daily backup
pg_dump ucimznam > backup_$(date +%Y%m%d).sql
```

### Performance Monitoring
- Koristi monitoring alate kao što su:
  - New Relic
  - DataDog
  - Uptime Robot

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Proveri environment variables
   - Verifikuj da server radi

2. **CORS Error**
   - Postavi FRONTEND_URL u .env
   - Proveri origin podešavanja

3. **JWT Token Error**
   - Proveri JWT_SECRET
   - Verifikaj token format

4. **Permission Denied**
   - Proveri role korisnika
   - Verifikaj is_approved status

## Migration from localStorage

1. **Backup postojeće podatke**
2. **Importuj u bazu podataka**
3. **Update frontend kod**
4. **Testiraj sve funkcionalnosti**
5. **Deploy**

## Support

Za tehničku podršku:
- Proveri logove
- Testiraj API endpointe
- Verifikuj database konekciju
- Kontaktiraj development tim
