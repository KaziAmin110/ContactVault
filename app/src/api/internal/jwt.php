<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once 'config.php';
require_once 'types.php';

function getJwtFromHeader(): ?string
{
    $authorizationHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

    if (strpos($authorizationHeader, 'Bearer') !== false) {
        $jwt = trim(str_ireplace('Bearer', '', $authorizationHeader));
        return $jwt;
    }
    return null;
}

function createJwt($userId): string
{
    $issuedAt = time();
    $expirationTime = $issuedAt + 36000;
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
        // Check if the PUBLIC_KEY is valid
        if (openssl_pkey_get_public(PUBLIC_KEY) === false) {
            error_log('Invalid public key');
            return null;
        }

        $decoded = JWT::decode($jwt, new Key(PUBLIC_KEY, 'RS256'));

        if ($decoded->user_id == null) {
            return null;
        }

        return new LoggedInUser($decoded->user_id);
    } catch (\Exception $e) {
        error_log('JWT verification failed: ' . $e->getMessage());
        return null;
    }
}
?>