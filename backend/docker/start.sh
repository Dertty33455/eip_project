#!/bin/sh
php artisan migrate --force
php artisan config:cache
php artisan route:cache
/usr/bin/supervisord -c /etc/supervisord.conf