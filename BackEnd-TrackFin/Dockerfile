FROM php:8.4-cli

RUN apt-get update && apt-get install -y \
    git zip unzip libzip-dev libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN chmod -R 775 storage bootstrap/cache

EXPOSE 10000

CMD ["sh", "-c", "php artisan config:cache && php artisan route:cache && if [ \"${RUN_MIGRATIONS:-false}\" = \"true\" ]; then php artisan migrate --force; fi && php artisan serve --host=0.0.0.0 --port=${PORT:-10000}"]