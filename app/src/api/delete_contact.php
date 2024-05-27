<?php
require_once '../vendor/autoload.php';
require_once './internal/database.php';
require_once './internal/contact_manager.php';
require_once './internal/jwt.php';
require_once './internal/types.php';

$loggedInUser = extractLoggedInUser();

$input = file_get_contents('php://input');

$mapper = (new \JsonMapper\JsonMapperFactory())->bestFit();

$delete_contact_payload = $mapper->mapToClassFromString($input, DeleteContactPayload::class);

// Validate the mapped data
if (!isset($delete_contact_payload->contact_id)) {
    http_response_code(400);
    echo json_encode(['error' => 'The contact_id field is required.']);
    exit;
}

$database = new Database();

$contact_manager = new ContactManager($database);

try {
    $contact = $contact_manager->getContact($delete_contact_payload->contact_id);

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

    $contact_manager->deleteContact($contact->id);
} finally {
    $database->closeConnection();
}

http_response_code(200);
echo json_encode(['contact' => $contact]);
?>