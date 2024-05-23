<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once 'config.php';
require_once 'types.php';

function createJwt($userId): string
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


function verifyJwt($jwt): ?LoggedInUser
{
    try {
        $decoded = JWT::decode($jwt, new Key(PUBLIC_KEY, 'RS256'));

        if ($decoded->user_id == null) {
            return null;
        }

        return new LoggedInUser($decoded->user_id);
    } catch (\Exception $e) {
        return null;
    }
}

?>