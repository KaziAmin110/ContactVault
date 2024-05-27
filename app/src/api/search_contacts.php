<?php
require_once '../vendor/autoload.php';
require_once './internal/database.php';
require_once './internal/contact_manager.php';
require_once './internal/jwt.php';
require_once './internal/types.php';

$loggedInUser = extractLoggedInUser();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo "Unsupported request method.";
    exit;
}

// Extracting query parameters
$queryParams = $_GET;

// Convert the query parameters to a JSON string
$jsonString = json_encode($queryParams);

error_log("jsonString=" . $jsonString);

// Using the JSON mapper as before
$mapper = (new \JsonMapper\JsonMapperFactory())->bestFit();
$search_contact_payload = $mapper->mapToClassFromString($jsonString, SearchContactsPayload::class);

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