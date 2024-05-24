<?php
require_once '../vendor/autoload.php';
require_once './internal/database.php';
require_once './internal/contact_manager.php';
require_once './internal/jwt.php';
require_once './internal/types.php';

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

$input = file_get_contents('php://input');

$mapper = (new \JsonMapper\JsonMapperFactory())->bestFit();

$search_contact_payload = $mapper->mapToClassFromString($input, SearchContactsPayload::class);

// Validate the mapped data
if (!isset($search_contact_payload->query)) {
    http_response_code(400);
    echo json_encode(['error' => 'The query field is required.']);
    exit;
}

$database = new Database();
try {
    $contact_manager = new ContactManager($database);
    $response = $contact_manager->searchContacts($loggedInUser->user_id, $search_contact_payload->query, $search_contact_payload->page ?: 1, 10);
} finally {
    $database->closeConnection();
}

http_response_code(200);
echo json_encode($response);
?>