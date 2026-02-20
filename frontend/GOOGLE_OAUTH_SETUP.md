# Configuration de l'authentification Google OAuth

## Prérequis

- Compte Google
- Accès à [Google Cloud Console](https://console.cloud.google.com)

## Étapes de configuration

### 1. Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. Cliquez sur le sélecteur de projet en haut
3. Cliquez sur "Nouveau projet"
4. Nommez votre projet (ex: "BookShell Platform")
5. Cliquez sur "Créer"

### 2. Activer l'API Google+

1. Dans le menu de gauche, allez dans "API et services" > "Bibliothèque"
2. Recherchez "Google+ API"
3. Cliquez sur "Google+ API"
4. Cliquez sur "Activer"

### 3. Configurer l'écran de consentement OAuth

1. Dans le menu de gauche, allez dans "API et services" > "Écran de consentement OAuth"
2. Sélectionnez "Externe" comme type d'utilisateur
3. Cliquez sur "Créer"
4. Remplissez les informations requises :
   - **Nom de l'application** : BookShell
   - **E-mail d'assistance utilisateur** : votre email
   - **Domaines autorisés** : localhost (pour dev) et votre domaine de production
   - **Coordonnées du développeur** : votre email
5. Cliquez sur "Enregistrer et continuer"
6. Dans "Champs d'application", ajoutez :
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
7. Cliquez sur "Enregistrer et continuer"
8. Dans "Utilisateurs test" (pour le développement), ajoutez votre email
9. Cliquez sur "Enregistrer et continuer"

### 4. Créer des identifiants OAuth 2.0

1. Dans le menu de gauche, allez dans "API et services" > "Identifiants"
2. Cliquez sur "Créer des identifiants" > "ID client OAuth"
3. Sélectionnez "Application Web" comme type d'application
4. Nommez votre client OAuth (ex: "BookShell Web Client")
5. Ajoutez des **URI de redirection autorisées** :
   - Pour le développement : `http://localhost:3001/api/auth/callback/google`
   - Pour la production : `https://votre-domaine.com/api/auth/callback/google`
6. Cliquez sur "Créer"
7. **IMPORTANT** : Copiez l'ID client et le code secret qui apparaissent

### 5. Configurer les variables d'environnement

1. Ouvrez le fichier `.env` à la racine du projet
2. Ajoutez vos credentials :

```env
# Google OAuth
GOOGLE_CLIENT_ID="votre-client-id-ici"
GOOGLE_CLIENT_SECRET="votre-client-secret-ici"

# NextAuth
NEXTAUTH_URL="http://localhost:3001"  # Changez pour votre domaine en production
NEXTAUTH_SECRET="votre-secret-aleatoire-de-32-chars-minimum"
```

3. Pour générer un `NEXTAUTH_SECRET` sécurisé, exécutez :
```bash
openssl rand -base64 32
```

### 6. Tester la connexion Google

1. Démarrez le serveur de développement :
```bash
npm run dev
```

2. Allez sur http://localhost:3001/login
3. Cliquez sur "Continuer avec Google"
4. Connectez-vous avec votre compte Google (compte test si en développement)
5. Acceptez les permissions demandées
6. Vous devriez être redirigé vers la page d'accueil, connecté!

## Déploiement en production

### Domaines autorisés

1. Retournez dans Google Cloud Console > Identifiants
2. Modifiez votre client OAuth
3. Ajoutez vos URIs de production :
   - **URI de redirection autorisée** : `https://votre-domaine.com/api/auth/callback/google`
   - **Origines JavaScript autorisées** : `https://votre-domaine.com`

### Variables d'environnement

Mettez à jour vos variables d'environnement de production :

```env
NEXTAUTH_URL="https://votre-domaine.com"
NEXTAUTH_SECRET="votre-secret-production-different"
GOOGLE_CLIENT_ID="votre-client-id"
GOOGLE_CLIENT_SECRET="votre-client-secret"
```

### Publier l'application OAuth

1. Dans Google Cloud Console, allez dans "Écran de consentement OAuth"
2. Cliquez sur "Publier l'application"
3. Soumettez pour validation si vous dépassez 100 utilisateurs

## Dépannage

### "Error 400: redirect_uri_mismatch"

- Vérifiez que l'URI de redirection dans Google Cloud Console correspond exactement à celle utilisée
- Format attendu : `http://localhost:3001/api/auth/callback/google` (pas de slash à la fin)
- Le port doit correspondre (3001 dans notre cas)

### "Access blocked: This app's request is invalid"

- Vérifiez que l'écran de consentement OAuth est configuré
- Ajoutez votre email comme utilisateur test
- Vérifiez que les domaines sont correctement configurés

### L'utilisateur n'est pas créé dans la base de données

- Vérifiez les logs du serveur pour voir les erreurs Prisma
- Assurez-vous que la base de données est correctement initialisée (`npx prisma db push`)
- Vérifiez que le callback `signIn` dans NextAuth fonctionne correctement

## Sécurité

### Production

- ⚠️ **Ne commitez JAMAIS vos secrets** dans Git
- Utilisez des variables d'environnement séparées pour dev/staging/production
- Changez tous les secrets lors du passage en production
- Activez HTTPS en production (obligatoire pour OAuth)
- Limitez les domaines autorisés au strict minimum

### Secrets

Les secrets doivent être :
- Au minimum 32 caractères
- Aléatoires et uniques
- Différents entre environnements
- Stockés de manière sécurisée (ex: secrets manager dans le cloud)

## Support

Pour plus d'informations :
- [Documentation NextAuth.js](https://next-auth.js.org/providers/google)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Prisma Adapter Documentation](https://authjs.dev/reference/adapter/prisma)

---

**Note** : Cette configuration vous permet d'offrir à vos utilisateurs une connexion simple et sécurisée via leur compte Google, tout en créant automatiquement leur profil BookShell. 🚀
