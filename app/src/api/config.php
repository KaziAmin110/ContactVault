<?php
// config.php

define('DB_HOST', getenv("MYSQL_HOST"));
define('DB_USER', getenv("MYSQL_USER"));
define('DB_PASS', getenv("MYSQL_PASSWORD"));
define('DB_NAME', getenv("MYSQL_DATABASE"));

define('PRIVATE_KEY', file_get_contents('/secrets/jwt_encryption_key.pem'));
define('PUBLIC_KEY', file_get_contents('/secrets/jwt_encryption_key.pem.pub'));
?>
