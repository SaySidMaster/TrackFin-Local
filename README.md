# TrackFin

> Application de Gestion Financière Simplifiée — Laravel 11 · React 19 · MySQL 8

**🌐 Demo en ligne :** [https://front-end-track-fin.vercel.app](https://front-end-track-fin.vercel.app)

---

## Table des matières

1. [Architecture](#1-architecture)
2. [Installation locale](#2-installation-locale)
3. [Déploiement en ligne](#3-déploiement-en-ligne)
4. [Fonctionnalités](#4-fonctionnalités)
5. [Rôles & Permissions](#5-rôles--permissions)
6. [Référence API](#6-référence-api)

---

## 1. Architecture

TrackFin est une application web full-stack organisée en deux projets distincts communiquant via une API REST sécurisée.

| Composant | Technologie | Rôle |
|---|---|---|
| Backend | Laravel 11 / PHP 8.2 | API REST, authentification, logique métier |
| Frontend | React 19 + Vite 7 | Interface SPA responsive |
| Base de données | MySQL 8 | Stockage des données |
| Auth | Laravel Sanctum | Tokens Bearer |

**Schéma de communication :**

```
Navigateur (React)  ──[HTTPS + Bearer token]──▶  Laravel API  ──[MySQL internal]──▶  Base de données
```

### Structure des dossiers

**Backend — `BackEnd-TrackFin/`**

```
app/Http/Controllers/   → Controllers de l'API (Auth, Transaction, Debt, Budget...)
app/Http/Middleware/    → CheckRole.php — gestion des rôles
app/Models/             → Modèles Eloquent (User, Transaction, Debt, Budget, Contact...)
config/cors.php         → Configuration CORS
database/migrations/    → Migrations des tables
routes/api.php          → Définition des routes
```

**Frontend — `FrontEnd-TrackFin/`**

```
src/pages/        → Dashboard, Transactions, Debts, Budgets, Contacts, Parametres, Login
src/components/   → Composants réutilisables (Banner, DialogForm, DebtBox, BudgetBox...)
src/services/     → Fonctions d'appel API (TransactionServices, DebtServices...)
src/context/      → DialogContext — gestion globale des modales
src/hooks/        → usePagination — hook de pagination réutilisable
```

---

## 2. Installation Locale

### Prérequis

| Outil | Version |
|---|---|
| PHP | 8.2+ |
| Composer | 2.x |
| Node.js | 18+ |
| npm | 9+ |
| MySQL | 8.0+ |

### Backend (Laravel)

```bash
cd BackEnd-TrackFin
composer install
cp .env.example .env
```

Configurer `.env` :

```env
APP_NAME=TrackFin
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=trackfin
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe

FRONTEND_URL=http://localhost:5173
```

```bash
php artisan key:generate

# Option A — base vide via migrations
php artisan migrate

# Option B — importer le script SQL fourni
mysql -u root -p trackfin < trackfin.sql

php artisan serve
# API accessible sur http://localhost:8000/api
```

### Frontend (React)

```bash
cd FrontEnd-TrackFin
npm install
```

Créer `.env` :

```env
VITE_API_URL=http://localhost:8000/api
VITE_CURRENCY=FCFA
```

```bash
npm run dev
# Application accessible sur http://localhost:5173
```

> ⚠️ Les deux serveurs doivent tourner simultanément.

---

## 3. Déploiement en Ligne

| Service | Usage | Coût |
|---|---|---|
| Railway | Backend Laravel + MySQL | Gratuit |
| Vercel | Frontend React | Gratuit |

### Base de données (Railway)

1. New Project → Add Service → **Database → MySQL**
2. Récupérer les credentials dans l'onglet **Variables**
3. Importer la base :

```bash
mysql -h metro.proxy.rlwy.net -P PORT -u root -pMOTDEPASSE railway < trackfin.sql
```

### Backend (Railway)

1. New Service → GitHub repo → `BackEnd-TrackFin`
2. Ajouter les variables d'environnement :

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-backend.up.railway.app
DB_HOST=mysql.railway.internal
DB_PORT=3306
DB_DATABASE=railway
DB_USERNAME=root
DB_PASSWORD=votre_password
FRONTEND_URL=https://votre-frontend.vercel.app
```

> ⚠️ Utiliser `mysql.railway.internal` (URL interne) pour les services du même projet Railway.

### Frontend (Vercel)

1. New Project → GitHub repo → `FrontEnd-TrackFin`
2. Ajouter les variables d'environnement :

```env
VITE_API_URL=https://votre-backend.up.railway.app/api
VITE_CURRENCY=FCFA
```

3. Cliquer **Deploy** — Vercel détecte Vite automatiquement.

---

## 4. Fonctionnalités

### 4.1 Tableau de bord
Page d'accueil centralisée affichant une vue synthétique de la santé financière de l'équipe.
- **Statistiques du mois en cours :** Revenus, Dépenses, Dettes, Créances, Budget prévu, Reste du budget
- **Graphique d'évolution du solde :** histogramme sur les 12 derniers mois — vertical sur desktop, horizontal sur mobile
- **Données temps réel :** calculées directement depuis les transactions, sans couche de reporting

### 4.2 Transactions
Module central pour enregistrer toutes les entrées et sorties d'argent.
- **Enregistrer :** libellé, montant, type (revenu/dépense), catégorie, contact, moyen de paiement, date
- **Modifier ou supprimer** une transaction existante
- **Filtres avancés :** recherche textuelle, type, catégorie, moyen de paiement, montant min/max, plage de dates
- **Pagination :** 20 transactions par page
- **Lien dette :** une transaction peut rembourser partiellement ou totalement une dette

### 4.3 Dettes & Créances
Gestion complète des dettes (argent à payer) et créances (argent à recevoir).
- **Créer :** montant, type, contact, statut et date d'échéance
- **Reste à payer :** calculé automatiquement depuis les transactions liées
- **Enregistrer un paiement :** partiel ou total via le bouton PAYER
- **Statuts automatiques :** En attente → Partiellement payé → Payée
- **Filtres :** type de dette, type de contact, statut
- **Pagination :** 15 dettes par page

### 4.4 Budgets
Définition de plafonds de dépenses par catégorie et par période.
- **Créer :** par catégorie, mois et année avec un montant limite
- **Suivi de consommation :** montant dépensé vs montant prévu avec barre de progression
- **Filtres :** par catégorie et par période (mois/année)
- **Pagination :** 20 budgets par page

### 4.5 Clients & Fournisseurs
Carnet de contacts associés aux transactions et dettes.
- **Ajouter :** nom, téléphone, email, type (Client ou Fournisseur), notes
- **Modifier ou supprimer** un contact existant
- **Recherche :** par nom, email ou téléphone
- **Pagination :** 20 contacts par page

### 4.6 Paramètres
Administration de l'application et de l'équipe.

**Profils utilisateurs** *(admin uniquement)*
- Voir tous les membres de l'équipe avec leur rôle et statut
- Ajouter un nouveau membre avec son rôle
- Modifier le nom ou le rôle d'un membre
- Changer le mot de passe d'un membre
- Activer / désactiver un compte
- Supprimer un compte

**Catégories** *(admin et comptable)*
- Créer, modifier, supprimer des catégories de type revenu ou dépense

**Moyens de paiement** *(admin et comptable)*
- Créer, modifier, supprimer des moyens de paiement (Espèces, Virement, Mobile Money...)

**Mon profil** *(tous les utilisateurs)*
- Modifier son nom
- Changer son propre mot de passe

---

## 5. Rôles & Permissions

Chaque utilisateur appartient à une équipe créée lors de l'inscription du premier administrateur.

| Permission | Admin | Comptable | Caissier | Utilisateur |
|---|:---:|:---:|:---:|:---:|
| Voir toutes les données | ✅ | ✅ | ✅ | ✅ |
| Créer / modifier / supprimer transactions | ✅ | ✅ | ✅ | ❌ |
| Créer / modifier / supprimer dettes | ✅ | ✅ | ✅ | ❌ |
| Enregistrer un paiement de dette | ✅ | ✅ | ✅ | ❌ |
| Créer / modifier / supprimer budgets | ✅ | ✅ | ❌ | ❌ |
| Créer / modifier / supprimer contacts | ✅ | ✅ | ❌ | ❌ |
| Gérer catégories & moyens de paiement | ✅ | ❌ | ❌ | ❌ |
| Voir & gérer les membres de l'équipe | ✅ | ❌ | ❌ | ❌ |
| Ajouter un membre / changer son mdp | ✅ | ❌ | ❌ | ❌ |
| Changer son propre mot de passe | ✅ | ✅ | ✅ | ✅ |

---

## 6. Référence API

Toutes les routes (sauf `/register`, `/login` et `/test`) nécessitent :

```
Authorization: Bearer {token}
```

### Authentification

| Méthode | Route | Description |
|---|---|---|
| POST | `/api/register` | Créer un compte + équipe |
| POST | `/api/login` | Connexion — retourne un token |
| POST | `/api/logout` | Déconnexion — révoque le token |
| GET | `/api/user` | Profil de l'utilisateur connecté |
| PUT | `/api/user/password` | Changer son propre mot de passe |

### Ressources principales

| Ressource | Routes |
|---|---|
| Transactions | `GET` `POST` `/transactions` · `PUT` `DELETE` `/transactions/{id}` |
| Dettes | `GET` `POST` `/debts` · `PUT` `DELETE` `/debts/{id}` · `POST` `/debts/{id}/pay` |
| Budgets | `GET` `POST` `/budgets` · `PUT` `DELETE` `/budgets/{id}` |
| Contacts | `GET` `POST` `/contacts` · `PUT` `DELETE` `/contacts/{id}` |
| Catégories | `GET` `POST` `/categories` · `PUT` `DELETE` `/categories/{id}` |
| Moyens de paiement | `GET` `POST` `/payment-methods` · `PUT` `DELETE` `/payment-methods/{id}` |
| Dashboard | `GET` `/dashboard` |
| Utilisateurs | `GET` `POST` `/users` · `PUT` `DELETE` `/user/{id}` |

### Format des réponses

```json
// Succès
{ "success": true, "data": { ... } }

// Échec
{ "success": false, "message": "Description de l'erreur" }
```

---

*TrackFin — Version 1.0 · Avril 2026*
