#!/bin/sh

# Permissions au démarrage (pas au build)
chmod -R 777 /var/www/html/storage
chmod -R 777 /var/www/html/bootstrap/cache

# Créer le fichier SQLite
touch /var/www/html/database/database.sqlite
chmod 666 /var/www/html/database/database.sqlite

# Laravel
php artisan config:clear
php artisan migrate --seed --force

# Démarrer les services
/usr/bin/supervisord -c /etc/supervisord.conf