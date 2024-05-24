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

$get_contact_payload = $mapper->mapToClassFromString($input, GetContactPayload::class);

// Validate the mapped data
if (!isset($get_contact_payload->contact_id)) {
    http_response_code(400);
    echo json_encode(['error' => 'The contact_id field is required.']);
    exit;
}

$database = new Database();

$contact_manager = new ContactManager($database);
try {
    $contact = $contact_manager->getContact($get_contact_payload->contact_id);
} finally {
    $database->closeConnection();
}

if ($contact == null) {
    http_response_code(404);
    echo json_encode(['error' => 'Contact not found.']);
    exit;
}

if ($contact->user_id != $loggedInUser->user_id) {
    http_response_code(401);
    echo json_encode(['error' => 'You do not own the requested contact.']);
    exit;
}

http_response_code(200);
echo json_encode(['contact' => $contact]);
?>