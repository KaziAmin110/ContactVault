USE contact_manager;

CREATE TABLE
  `users` (
    `id` int NOT NULL AUTO_INCREMENT,
    `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_last_logged_in` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
--    `first_name` VARCHAR(50) NOT NULL,
--    `last_name` VARCHAR(50) NOT NULL,
    `authentication_provider` ENUM ('GITHUB', 'GOOGLE', 'USERNAME_PASSWORD') NOT NULL,
    `authentication_id` VARCHAR(256) NOT NULL, -- Will be the id given by authentication provider. For USERNAME_PASSWORD it will be the username.
    `password` VARCHAR(512), -- Will be NULL when autentication_provider==USERNAME_PASSWORD,
    PRIMARY KEY (id)
  );

CREATE TABLE
  `contacts` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` iNT NOT NULL,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50),
    `phone_number` VARCHAR(50),
    `email_address` VARCHAR(50),
    `avatar_url` VARCHAR(512),
    `bio` VARCHAR(2048),
    `description` VARCHAR(2048),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  );