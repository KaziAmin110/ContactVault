<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once 'config.php';
require_once 'types.php';


function extractLoggedInUser(): LoggedInUser
{
    if (!preg_match('/Bearer\s(\S+)/', $_SERVER['HTTP_AUTHORIZATION'], $matches)) {
        http_response_code(400);
        echo json_encode(['error' => 'You must pass a valid JWT in the Authorization header!']);
        exit;
    }

    $jwt = $matches[1];
    if (!$jwt) {
        // No token was able to be extracted from the authorization header
        http_response_code(400);
        echo json_encode(['error' => 'You must pass a valid JWT in the Authorization header!']);
        exit;
    }

    $loggedInUser = verifyJwt($jwt);
    if ($loggedInUser == null) {
        http_response_code(401);
        echo json_encode(['error' => 'Your JWT is expired or malformed!']);
        exit;
    }

    return $loggedInUser;
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