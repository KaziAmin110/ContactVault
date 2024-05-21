FROM php:8.3.7-apache

RUN apt-get update && apt-get upgrade -y

RUN docker-php-ext-install mysqli
RUN a2enmod rewrite

COPY "php.ini-production" "$PHP_INI_DIR/php.ini"