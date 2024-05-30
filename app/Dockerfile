FROM php:8.3.7-apache as build

RUN apt-get update && apt-get upgrade -y
RUN apt-get install git unzip -y

RUN docker-php-ext-install mysqli
RUN a2enmod rewrite
COPY "php.ini-production" "$PHP_INI_DIR/php.ini"

COPY --from=composer/composer:2-bin /composer /usr/bin/composer

FROM build as setup-user

# Add a non-root user and group
RUN groupadd -g 1000 webserver && \
    useradd -u 1000 -g webserver -m -s /bin/bash webserver

# Set the user and group to own the document root directory

RUN mkdir -p /var/www/html/avatars
RUN chown -R webserver:webserver /var/www/html

FROM setup-user AS install-dependencies

USER webserver
COPY ./composer.json /var/www/html/
COPY ./composer.lock /var/www/html/
RUN cd /var/www/html/
RUN composer install

FROM install-dependencies AS final
USER root
RUN chown -R webserver:webserver /var/www/html
USER webserver

COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf

COPY ./src/ /var/www/html/

USER webserver