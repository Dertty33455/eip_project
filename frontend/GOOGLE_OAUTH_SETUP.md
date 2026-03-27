# Configuration de l'authentification Google OAuth (avec backend Laravel)

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

### 2. Activer l'API Google People / OAuth scopes

> Remarque : l'API Google+ est obsolète. Pour l'authentification OpenID Connect, utilisez les scopes standards :
- openid
- profile
- email

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
6. Dans "Scopes" ajoutez :
   - `openid`
   - `profile`
   - `email`
7. Cliquez sur "Enregistrer et continuer"
8. Dans "Utilisateurs test" (pour le développement), ajoutez votre email
9. Cliquez sur "Enregistrer et continuer"

### 4. Créer des identifiants OAuth 2.0

1. Dans "API et services" > "Identifiants"
2. Cliquez sur "Créer des identifiants" > "ID client OAuth"
3. Sélectionnez "Application Web"
4. Nommez votre client OAuth (ex: "BookShell Web Client")
5. Ajoutez des **URI de redirection autorisées** :
   - Développement backend Laravel : `http://localhost:8000/api/auth/google/callback`
   - Production : `https://votre-domaine.com/api/auth/google/callback`
6. Cliquez sur "Créer" et copiez l'ID client et le secret

### 5. Configurer les variables d'environnement

> Côté Laravel (backend)
> Ajoutez dans le fichier `.env` du backend :
>
> ```env
> GOOGLE_CLIENT_ID="votre-client-id-ici"
> GOOGLE_CLIENT_SECRET="votre-client-secret-ici"
> GOOGLE_REDIRECT_URL="http://localhost:8000/api/auth/google/callback"
> FRONTEND_URL="http://localhost:3000"
> ```
>
> Vérifiez que `config/services.php` utilise ces variables.

> Côté Frontend
> Définissez l'URL de l'API côté client :
>
> ```env
> NEXT_PUBLIC_API_URL="http://localhost:8000"
> ```
>
> Créez une page client `/auth/callback` qui lit le token retourné et le stocke (cookie/localStorage).

3. Pour générer un secret sécurisé (ex: NextAuth) :
```bash
openssl rand -base64 32
```

### 6. Tester la connexion Google

1. Lancez l'API Laravel : `php artisan serve --port=8000` (ou via conteneur)
2. Lancez le frontend : `npm run dev`
3. Ouvrez `http://localhost:3000/login`
4. Cliquez sur "Continuer avec Google" : l'API redirige vers Google puis revient vers `FRONTEND_URL` (ex: `http://localhost:3000/auth/callback?token=...`)
5. La page de callback stocke le token et connecte l'utilisateur

## Déploiement en production

### Domaines autorisés

1. Dans Google Cloud Console > Identifiants, modifiez votre client OAuth
2. Ajoutez vos URIs de production :
   - `https://votre-domaine.com/api/auth/callback/google`
   - Origines JavaScript : `https://votre-domaine.com`

### Variables d'environnement

```env
NEXTAUTH_URL="https://votre-domaine.com"
NEXTAUTH_SECRET="votre-secret-production"
GOOGLE_CLIENT_ID="votre-client-id"
GOOGLE_CLIENT_SECRET="votre-client-secret"
FRONTEND_URL="https://votre-domaine.com"
```

### Publier l'application OAuth

1. Dans Google Cloud Console > Écran de consentement OAuth
2. Cliquez sur "Publier l'application"
3. Soumettez pour validation si besoin

## Dépannage

### "Error 400: redirect_uri_mismatch"

- Vérifiez que l'URI de redirection enregistrée dans Google correspond exactement à celle utilisée (même port et chemin).

### "Access blocked: This app's request is invalid"

- Assurez-vous que l'écran de consentement est configuré et que votre email figure parmi les utilisateurs test.

### L'utilisateur n'est pas créé dans la base de données

- Vérifiez les logs du backend
- Assurez-vous que la DB est initialisée
- Vérifiez la logique de callback et création d'utilisateur

## Sécurité

- Ne commitez jamais vos secrets
- Utilisez des variables d'environnement séparées pour dev/staging/prod
- Activez HTTPS en production
- Gardez des secrets d'au moins 32 caractères et uniques par environnement

## Support

- NextAuth: https://next-auth.js.org/providers/google
- Google OAuth: https://developers.google.com/identity/protocols/oauth2

---
