

<?php

use Firebase\JWT\JWT;

function createJwt($userId)
{
    $issuedAt = time();
    $expirationTime = $issuedAt + 3600;  // jwt valid for 1 hour
    $payload = array(
        'user_id' => $userId,
        'iat' => $issuedAt,
        'exp' => $expirationTime
    );

    return JWT::encode($payload, PRIVATE_KEY, 'RS256');
}


?>