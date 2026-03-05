FROM php:8.2-fpm-alpine

# Extensions PHP nécessaires pour Laravel
RUN apk add --no-cache nginx supervisor curl \
    && docker-php-ext-install pdo pdo_mysql opcache

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copier les fichiers du projet
COPY . .

# Créer les dossiers nécessaires et donner les permissions
RUN mkdir -p bootstrap/cache storage/logs storage/framework/cache \
    storage/framework/sessions storage/framework/views \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Installer les dépendances Laravel
RUN composer install --no-dev --optimize-autoloader

# Config nginx
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisord.conf

EXPOSE 8080

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]