FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --no-scripts --optimize-autoloader --ignore-platform-reqs

FROM php:8.2-apache
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
RUN a2enmod rewrite \
    && rm -f /etc/apache2/sites-enabled/000-default.conf
COPY docker/apache-vhost.conf /etc/apache2/sites-enabled/000-default.conf
COPY docker/php.ini /usr/local/etc/php/conf.d/99-pfn-skm.ini

WORKDIR /var/www/html
COPY . .
COPY --from=vendor /app/vendor ./vendor

# Smarty writes compiled templates + cache here at runtime.
RUN mkdir -p templates/_compiled templates/_cache \
    && chown -R www-data:www-data templates/_compiled templates/_cache

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
    CMD curl -fsS -o /dev/null http://localhost/health-check || exit 1
