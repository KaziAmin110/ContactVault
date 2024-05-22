<?php
// config.php

define('DB_HOST', 'database');
define('DB_USER', 'root');
define('DB_PASS', 'example');
define('DB_NAME', 'contact_manager');

define('PRIVATE_KEY', file_get_contents('/secrets/private_key.pem'));
define('PUBLIC_KEY', file_get_contents('/secrets/public_key.pem'));
?>
