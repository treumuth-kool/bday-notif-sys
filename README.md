# Sünnipäevade teavitussüsteem

Võimaldab kasutajatel registreeruda, sisse logida, vaadata eelseisvaid sünnipäevi ja saada e-posti teel teavitusi sünnipäevade kohta.

### Frontend
- `frontend/index.html`: Peamine HTML-fail kasutajaliidese jaoks
- `frontend/script.js`: JavaScript-fail, mis suhtleb API-ga
- `frontend/styles.css`: CSS-fail kujunduse jaoks

### Backend
- `backend/server.js`: Peamine serveri fail
- `backend/config/db.js`: Andmebaasiga ühenduse loomine (kasutusel MySQL)
- `backend/controllers/`: Sisaldab kontrolleri faile kasutaja, õpilase ja e-posti funktsionaalsuse jaoks
- `backend/models/`: Pisike mudel, aga mitte Sequelize, vaid niisama klassina
- `backend/routes/`: API endpointid
- `backend/database/schema.sql`: Andmebaasi tabelite loomiseks

### Konfiguratsioon
- `.env`: andmebaasi kasutaja, parool jms

### Skriptid
- `backend/import_data_to_db.py`: Pythoni skript õpilaste andmete importimiseks CSV-failist (esmane ühekordne import)

### Swagger
- Swagger API dokumentatsioon saadaval `/api-docs` 

## API endpoints
- `/api/users/register`: Registreeri uus kasutaja
- `/api/users/login`: Logi kasutaja sisse
- `/api/users/logout`: Logi kasutaja välja
- `/api/users/verify-token`: Kontrolli kasutaja võtit
- `/api/students/upcoming-birthdays`: Leia eelseisvad sünnipäevad
- `/api/email/send-birthday-emails`: Saada teavituskirjad

## Stack

- Front: HTML, CSS, JavaScript
- Back: Node.js, Express.js
- Andmebaas: MySQL
- Autentimine: JSON Web Tokens (JWT)
- API Dokumentatsioon: Swagger
- E-post: Nodemailer (kohaliku SMTP serveri jaoks)
