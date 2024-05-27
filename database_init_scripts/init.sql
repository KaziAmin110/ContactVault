USE contact_manager;

CREATE TABLE
  `users` (
    `id` int NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(64) NOT NULL,
    `last_name` VARCHAR(64) NOT NULL,
    `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_last_logged_in` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `authentication_provider` ENUM ('GITHUB', 'GOOGLE', 'USERNAME_PASSWORD') NOT NULL,
    `authentication_id` VARCHAR(256) NOT NULL, -- Will be the id given by authentication provider. For USERNAME_PASSWORD it will be the username.
    `password` VARCHAR(512), -- Will be NULL when autentication_provider==USERNAME_PASSWORD,
    PRIMARY KEY (id),
    UNIQUE KEY `unique_auth_provider_id` (`authentication_provider`, `authentication_id`)
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

CREATE INDEX idx_contacts_first_name ON contacts (first_name);

CREATE INDEX idx_contacts_last_name ON contacts (last_name);

CREATE INDEX idx_contacts_phone_number ON contacts (phone_number);

CREATE INDEX idx_contacts_email_address ON contacts (email_address);