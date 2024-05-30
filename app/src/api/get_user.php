<?php
require_once '../vendor/autoload.php';
require_once './internal/database.php';
require_once './internal/user_manager.php';
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
$get_user_payload = $mapper->mapToClassFromString($jsonString, GetUserPayload::class);

// Validate the mapped data
if (!isset($get_user_payload->user_id)) {
    http_response_code(400);
    echo json_encode(['error' => 'The user_id field is required.']);
    exit;
}

error_log(json_encode(['get_user_payload->user_id' => $get_user_payload->user_id, 'loggedInUser->user_id' => $loggedInUser->user_id]));

if ($loggedInUser->user_id != $get_user_payload->user_id) {
    http_response_code(401);
    echo json_encode(['error' => 'You cannot get a user that is not yourself!']);
    exit;
}

try {
    $database = new Database();
    $user_manager = new UserManager($database);

    $user = $user_manager->getUser($get_user_payload->user_id);
} finally {
    $database->closeConnection();
}

if ($user != null) {
    http_response_code(200);
    echo json_encode(['user' => $user]);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'User not found.']);
}

?>