# UčimZnam - Dokumentacija Sajta

## Pregled

UčimZnam je edukativna platforma za učenje informatike namenjena učenicima 5. razreda. Sajt omogućava interaktivno učenje kroz lekcije, kvizove i multimedijalni sadržaj.

---

## 🎯 Glavne Funkcionalnosti

### 👤 Sistem Autentifikacije

#### Prijava Učenika
- **Email i lozinka** - Bezbedna prijava za odobrene učenike
- **Test nalog** - `test@ucenik.rs` / `test123`
- **Trajna sesija** - Ostaje prijavljen nakon osvežavanja
- **Automatska odjava** - Mogućnost odjave i čišćenja sesije

#### Registracija i Odobrenje
- **Zahtev za pristup** - Novi učenici mogu poslati zahtev
- **Nastavnicki panel** - Nastavnici odobravaju zahteve
- **Automatska lozinka** - Generisanje lozinke pri odobrenju
- **Email obaveštenja** - Sistem spreman za slanje emailova

---

## 📚 Sistem Učenja

### Individualni Napredak
- **Lični napredak** - Svaki učenik ima svoj napredak
- **Trajno pamćenje** - Podaci se čuvaju po email-u
- **Napredak bar** - Vizuelni prikaz procenta završenosti
- **Otključavanje lekcija** - Sekvencijalno otključavanje

### Struktura Lekcija
- **Poglavlja** - Organizacija lekcija u poglavlja
- **Multimedija** - Video i PDF materijali
- **Ključne tačke** - Sažeti najvažnije informacije
- **Interaktivni kvizovi** - Provera znanja nakon svake lekcije

---

## 🏫 Nastavnicki Panel

### Upravljanje Sadržajem
- **Kreiranje poglavlja** - Dodavanje novih poglavlja sa dugmetom na dnu tabele
- **Kreiranje lekcija** - Dodavanje lekcija unutar svakog poglavlja
- **Uređivanje sadržaja** - Izmena postojećih lekcija i kvizova
- **Brisanje lekcija** - Uklanjanje nepotrebnih sadržaja
- **Export opcije** - Izvoz lekcija u Word formatu

### Upravljanje Učenicima
- **Pregled zahteva** - Lista čekajućih zahteva za pristup
- **Odobravanje učenika** - Automatsko generisanje lozinki
- **Odobreni učenici** - Lista svih odobrenih učenika
- **Uklanjanje pristupa** - Brisanje učenika iz sistema

### Kreiranje Kvizova
- **Dodavanje pitanja** - Neograničen broj pitanja po lekciji
- **Višestruki odgovori** - 4 ponuđena odgovora po pitanju
- **Označavanje tačnog** - Biranje tačnog odgovora
- **Uređivanje kviza** - Izmena postojećih pitanja
- **Automatsko mešanje** - Pitanja i odgovori se nasumično mešaju
- **Ispravno praćenje** - Tačan odgovor se ispravno prati nakon mešanja
- **Brisanje pitanja** - Moguće uklanjanje pojedinačnih pitanja
- **Mapiranje indeksa** - Ispravno praćenje tačnog odgovora nakon mešanja

---

## 🎨 Korisnički Interfejs

### Responsive Dizajn
- **Mobilni uređaji** - Potpuno optimizovan za mobilne telefone
- **Tablet uređaji** - Prilagođen za tablete
- **Desktop uređaji** - Puna funkcionalnost na velikim ekranima

### Navigacija
- **Glavni meni** - Laka navigacija kroz aplikaciju
- **Napredak indikator** - Vizuelni prikaz napretka
- **Bread crumbs** - Navigacija unutar lekcija
- **Brze akcije** - Dugmi za brzi pristup

### Export Funkcionalnosti
- **Word export** - Izvoz svih lekcija u Word format
- **Formatiran dokument** - Profesionalno formatiran sa CSS stilovima
- **Kompletan sadržaj** - Sva poglavlja, lekcije i kvizovi
- **Automatski download** - Fajl se automatski preuzima
- **Datum u nazivu** - Lakše praćenje verzija fajlova

---

## 💾 Podaci i Čuvanje

### LocalStorage
- **Trajno čuvanje** - Svi podaci se čuvaju lokalno
- **Individualni napredak** - Razdvojeni podaci po učenicima
- **Odobreni učenici** - Trajna lista odobrenih
- **Prijavljeni korisnik** - Sesija se pamti

### Struktura Podataka
```javascript
{
  "student_progress": {
    "email@ucenik.rs": {
      "lesson-1": true,
      "lesson-2": false
    }
  },
  "approved_students_permanent": [
    {
      "id": "student-1",
      "email": "test@ucenik.rs",
      "password": "test123",
      "approvedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 🔧 Tehničke Karakteristike

### Frontend Tehnologije
- **HTML5** - Moderni HTML sa semantičkim tagovima
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Icons** - Moderna ikonska biblioteka
- **Vanilla JavaScript** - Čist JavaScript bez frameworkova

### Performanse
- **Brzo učitavanje** - Optimizovani resursi
- **Minimalni dependency** - Samo neophodne biblioteke
- **Efikasno renderovanje** - Dinamički update UI-a
- **Lagane animacije** - CSS transitions za glatke animacije

---

## 📱 Korisničko Iskustvo

### Učenik
1. **Prijava** - Brza prijava sa email i lozinkom
2. **Odabir poglavlja** - Vizuelni pregled svih poglavlja
3. **Učenje** - Interaktivne lekcije sa multimedijom
4. **Kviz** - Provera znanja sa trenutnim rezultatom
5. **Napredak** - Praćenje sopstvenog napretka

### Nastavnik
1. **Prijava** - Pristup nastavnickom panelu
2. **Upravljanje učenicima** - Odobravanje i upravljanje nalozima
3. **Kreiranje sadržaja** - Dodavanje lekcija i kvizova
4. **Organizacija** - Uređivanje i brisanje sadržaja
5. **Praćenje** - Pregled svih učenika i njihovog napretka

---

## 🚀 Buduće Mogućnosti

### Planirane Funkcionalnosti
- **Email notifikacije** - Automatsko slanje emailova
- **Napredni izveštaji** - Detaljna analitika napretka
- **Multimedijalni upload** - Direktno uploadovanje fajlova
- **Chat podrška** - Komunikacija između učenika i nastavnika
- **Gamifikacija** - Bodovi, značke i rang liste

### Tehnička Unapređenja
- **Backend integracija** - Povezivanje sa serverom
- **Baza podataka** - Migracija sa localStorage na bazu
- **API endpoint-i** - RESTful API za integracije
- **Sigurnost** - Dodatne mere sigurnosti

---

## 📞 Kontakt i Podrška

### Tehnička Podrška
- **Dokumentacija** - Detaljna dokumentacija svih funkcionalnosti
- **Tutorijali** - Vodiči za korišćenje platforme
- **FAQ** - Najčešća pitanja i odgovori
## 📈 Statistika

### 📊 Trenutno Stanje
- **✅ Autentifikacija** - Potpuno implementirana
- **✅ Individualni napredak** - Funkcioniše za sve učenike
- **✅ Nastavnicki panel** - Sve funkcionalnosti aktivne
- **✅ Kviz sistem** - Kreiranje i upravljanje kvizovima
- **✅ Automatsko mešanje** - Pitanja i odgovori se nasumično mešaju
- **✅ Word export** - Izvoz lekcija u Word format
- **✅ Responsive dizajn** - Potpuna optimizacija za sve uređaje
- **✅ LocalStorage** - Trajno čuvanje svih podataka
- **✅ Organizacija interfejsa** - Čišći i logičniji raspored elemenata

---

## 🎯 Zaključak

UčimZnam predstavlja kompletnu edukativnu platformu koja omogućava:
- **Kvalitetno učenje** - Interaktivne i zanimljive lekcije
- **Jednostavno upravljanje** - Intuitivan nastavnicki panel
- **Pouzdanost** - Stabilan sistem sa trajnim čuvanjem
- **Pristupačnost** - Dostupan sa svih uređaja

Platforma je spremna za upotrebu i pruža sve potrebne alate za efikasno učenje informatike u 5. razredu.

---

*Poslednja ažuriranje: 10. Maj 2026.*
*Verzija: 1.0.0*
