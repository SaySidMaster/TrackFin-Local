FROM php:8.2-apache

# Extensions utiles (adapte selon tes besoins)
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Copie les fichiers
COPY . /var/www/html/

# Permissions
RUN chown -R www-data:www-data /var/www/html

# Active mod_rewrite si tu utilises des routes propres
RUN a2enmod rewrite

EXPOSE 80