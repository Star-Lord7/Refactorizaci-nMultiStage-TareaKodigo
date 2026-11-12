FROM php:8.4-fpm-alpine AS base

RUN apk add --no-cache curl libxml2 libzip oniguruma \
    && apk add --no-cache --virtual .build-deps $PHPIZE_DEPS curl-dev libxml2-dev libzip-dev oniguruma-dev \
    && docker-php-ext-install -j"$(nproc)" curl dom mbstring opcache pdo_mysql xml zip \
    && apk del .build-deps \
    && sed -i 's/^;*clear_env *=.*/clear_env = no/' /usr/local/etc/php-fpm.d/www.conf \
    && printf '%s\n' 'opcache.enable=1' 'opcache.validate_timestamps=0' > /usr/local/etc/php/conf.d/production-opcache.ini \
    && php-fpm -tt

WORKDIR /var/www/html

FROM base AS build

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --no-progress --no-scripts

COPY . .
RUN mkdir -p storage/app/private storage/app/public storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && composer dump-autoload --no-dev --optimize --classmap-authoritative --no-interaction --no-scripts \
    && php artisan package:discover --ansi \
    && chown -R www-data:www-data storage bootstrap/cache

FROM base AS production

WORKDIR /var/www/html
COPY --from=build --chown=www-data:www-data /var/www/html ./

EXPOSE 9000
CMD ["php-fpm", "-F"]
