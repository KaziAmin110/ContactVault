<?php
require_once '../vendor/autoload.php';
require_once './internal/user_manager.php';
require_once './internal/database.php';
require_once './internal/jwt.php';
require_once './internal/types.php';

$input = file_get_contents('php://input');

$mapper = (new \JsonMapper\JsonMapperFactory())->bestFit();

$register_payload = $mapper->mapToClassFromString($input, RegisterPayload::class);

// Validate the mapped data
if (!isset($register_payload->authentication_provider)) {
    http_response_code(400);
    echo json_encode(['error' => 'The authentication_provider field is required.']);
    exit;
}

if (!isset($register_payload->username)) {
    http_response_code(400);
    echo json_encode(['error' => 'The username field is required.']);
    exit;
}

if (!isset($register_payload->password)) {
    http_response_code(400);
    echo json_encode(['error' => 'The password field is required.']);
    exit;
}

if (!isset($register_payload->first_name)) {
    http_response_code(400);
    echo json_encode(['error' => 'The first_name field is required.']);
    exit;
}

if (!isset($register_payload->last_name)) {
    http_response_code(400);
    echo json_encode(['error' => 'The last_name field is required.']);
    exit;
}

if ($register_payload->authentication_provider == 'USERNAME_PASSWORD') {
    $database = new Database();
    $user_manager = new UserManager($database);

    try {
        $user_id = $user_manager->registerUser($register_payload->username, $register_payload->password, $register_payload->first_name, $register_payload->last_name);
    } catch (mysqli_sql_exception $e) {
        if ($e->getCode() == 1062) {
            // Handle duplicate entry error
            error_log("Duplicate entry: " . $e->getMessage());
            echo json_encode(["error" => "There is already a user with that username"]);
            http_response_code(400);
        } else {
            error_log("Unexpected error occured: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(["error" => "Unexpected error occured: " . $e->getMessage()]);
        }
        return;
    } finally {
        $database->closeConnection();
    }

    $jwt = createJwt($user_id);
    http_response_code(200);
    echo json_encode(['token' => $jwt, 'user_id' => $user_id]);
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid authentication_provider. We only support the following: [GOOGLE, USERNAME_PASSWORD]']);
}

?>