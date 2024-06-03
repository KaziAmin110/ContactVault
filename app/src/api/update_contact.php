<?php
require_once '../vendor/autoload.php';
require_once './internal/database.php';
require_once './internal/contact_manager.php';
require_once './internal/jwt.php';
require_once './internal/types.php';

$loggedInUser = extractLoggedInUser();

$input = file_get_contents('php://input');

$mapper = (new \JsonMapper\JsonMapperFactory())->bestFit();

$update_contact_payload = $mapper->mapToClassFromString($input, UpdateContactPayload::class);

// Validate the mapped data
if (!isset($update_contact_payload->contact)) {
    http_response_code(400);
    echo json_encode(['error' => 'The contact field is required.']);
    exit;
}

$database = new Database();

$contact_manager = new ContactManager($database);
try {
    $contact = $contact_manager->getContact($update_contact_payload->contact->id);

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

    $contact->first_name = $update_contact_payload->contact->first_name ?? $contact->first_name;
    $contact->last_name = $update_contact_payload->contact->last_name ?? $contact->last_name;
    $contact->phone_number = $update_contact_payload->contact->phone_number ?? $contact->phone_number;
    $contact->email_address = $update_contact_payload->contact->email_address ?? $contact->email_address;
    $contact->bio = $update_contact_payload->contact->bio ?? $contact->bio;
    $contact->description = $update_contact_payload->contact->description ?? $contact->description;

    $success = $contact_manager->updateContact($contact);

    if ($success) {
        http_response_code(200);
        $contact = $contact_manager->getContact($update_contact_payload->contact->id);
        echo json_encode(['contact' => $contact]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update contact.']);
    }
} finally {
    $database->closeConnection();
}

?>