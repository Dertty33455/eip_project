#!/bin/sh
touch /var/www/html/database/database.sqlite
chmod 664 /var/www/html/database/database.sqlite
php artisan migrate --force --seed --no-interaction
php artisan config:cache
/usr/bin/supervisord -c /etc/supervisord.conf