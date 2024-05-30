<?php
require_once '../vendor/autoload.php';
require_once './internal/database.php';
require_once './internal/user_manager.php';
require_once './internal/jwt.php';
require_once './internal/types.php';

$input = file_get_contents('php://input');

$mapper = (new \JsonMapper\JsonMapperFactory())->bestFit();

$login_payload = $mapper->mapToClassFromString($input, LoginPayload::class);

if ($login_payload->authentication_provider == 'USERNAME_PASSWORD') {
    $database = new Database();
    $user_manager = new UserManager($database);
    $user_id = $user_manager->verifyPassword($login_payload->username, $login_payload->password);
    $database->closeConnection();
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid authentication_provider. We only support the following: [GOOGLE, USERNAME_PASSWORD]']);
    return;
}

if ($user_id) {
    $jwt = createJwt($user_id);
    echo json_encode(['token' => $jwt, 'user_id' => $user_id]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
}
?>