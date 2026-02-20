# BookShell Platform

Plateforme africaine communautaire de livres & livres audio avec marketplace et wallet mobile money.

## 🚀 Fonctionnalités

### 📚 Marketplace de Livres
- Achat et vente de livres neufs et d'occasion
- Filtres par catégorie, état, prix
- Système d'avis et de notation
- Gestion des favoris

### 🎧 Audiobooks
- Streaming d'audiobooks avec lecteur intégré
- Premier chapitre gratuit pour tous
- Accès complet avec abonnement
- Téléchargement hors-ligne (avec abonnement)

### 👥 Réseau Social
- Publications et partages
- Likes et commentaires
- Suivre des auteurs et lecteurs
- Fil d'actualités personnalisé

### 💰 Portefeuille & Paiements
- Intégration MTN Mobile Money
- Intégration Moov Money
- Portefeuille interne
- Commission de 5% sur les ventes

### 🔐 Authentification
- Inscription par email ou téléphone
- Connexion sécurisée JWT
- Vérification email/téléphone
- Profils vendeur vérifiés

### 👨‍💼 Dashboard Admin
- Statistiques de la plateforme
- Gestion des utilisateurs
- Modération des contenus
- Gestion des signalements

## 🛠️ Technologies

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de données**: PostgreSQL avec Prisma ORM
- **Authentification**: JWT (jose)
- **Paiements**: MTN MoMo API, Moov Money API
- **UI**: Framer Motion, React Icons
- **State Management**: Zustand

## 📦 Installation

1. Cloner le repository
```bash
git clone <repository-url>
cd eip_project
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
```

Remplir le fichier `.env` avec vos configurations:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/BookShell"
JWT_SECRET="your-super-secret-jwt-key"

# MTN Mobile Money
MTN_MOMO_API_URL=https://sandbox.momodeveloper.mtn.com
MTN_MOMO_PRIMARY_KEY=your-primary-key
MTN_MOMO_USER_ID=your-user-id
MTN_MOMO_API_KEY=your-api-key
MTN_MOMO_CALLBACK_URL=https://your-domain.com/api/webhooks/mtn

# Moov Money
MOOV_API_URL=https://api.moov-africa.com
MOOV_API_KEY=your-moov-api-key
MOOV_MERCHANT_ID=your-merchant-id
MOOV_CALLBACK_URL=https://your-domain.com/api/webhooks/moov
```

4. Initialiser la base de données
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. Lancer le serveur de développement
```bash
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── api/               # Routes API
│   │   ├── auth/          # Authentification
│   │   ├── books/         # Livres
│   │   ├── audiobooks/    # Audiobooks
│   │   ├── posts/         # Publications sociales
│   │   ├── wallet/        # Portefeuille
│   │   ├── admin/         # API Admin
│   │   └── webhooks/      # Webhooks paiement
│   ├── admin/             # Pages admin
│   ├── books/             # Pages livres
│   ├── audiobooks/        # Pages audiobooks
│   ├── community/         # Pages communauté
│   ├── wallet/            # Pages portefeuille
│   └── subscriptions/     # Pages abonnements
├── components/            # Composants React
│   ├── layout/           # Navbar, Footer
│   └── audiobook/        # Lecteur audio
├── hooks/                 # Hooks React personnalisés
│   ├── useAuth.ts        # Authentification
│   └── useApi.ts         # Appels API
├── lib/                   # Utilitaires
│   ├── prisma.ts         # Client Prisma
│   ├── auth.ts           # Utilitaires JWT
│   ├── validations.ts    # Schémas Zod
│   ├── utils.ts          # Fonctions utilitaires
│   └── payments/         # Services de paiement
└── middleware.ts          # Middleware Next.js
```

## 🎨 Thème Africain

L'interface utilise une palette de couleurs inspirée de l'Afrique:

- **Primary (Ocre)**: `#e88c2a` - Chaleur et énergie
- **Secondary (Vert profond)**: `#1b5e20` - Nature et croissance
- **Accent (Jaune chaud)**: `#f9bc15` - Soleil et optimisme
- **Dark**: `#1a1a1a` - Élégance

## 📱 Fonctionnalités Mobile Money

### MTN Mobile Money
- Dépôts et retraits
- Paiement des commandes
- Paiement des abonnements
- Webhooks de confirmation

### Moov Money
- Dépôts et retraits
- Paiement des commandes
- Paiement des abonnements
- Webhooks de confirmation

## 🔒 Sécurité

- Authentification JWT avec cookies HttpOnly
- Validation des entrées avec Zod
- Middleware de protection des routes
- Hachage des mots de passe avec bcrypt

## 📊 Commission

- Commission de 5% sur chaque vente
- Calculée automatiquement lors de la commande
- Versement instantané au vendeur (moins commission)

## 🧪 Données de Test

Après le seed, des données de démonstration sont disponibles:

- **Admin**: admin@BookShell.com / AdminPass123!
- **Utilisateurs de test**: user1@test.com, user2@test.com, user3@test.com (mot de passe: TestPass123!)
- Catégories de livres prédéfinies
- Livres et audiobooks de démonstration
- Publications sociales

## 📝 Licence

MIT License

## 👥 Contribution

Les contributions sont les bienvenues ! Consultez le guide de contribution pour plus de détails.

---

Développé avec ❤️ pour la communauté africaine des lecteurs.
