<?php
require_once '../vendor/autoload.php';
require_once 'utils.php';
require_once 'jwt.php';


function registerUser($username, $password)
{
    $conn = getDbConnection();
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $conn->prepare("INSERT INTO users (authentication_id, authentication_provider, password) VALUES (?, 'USERNAME_PASSWORD', ?)");
    $stmt->bind_param("ss", $username, $hashedPassword);
    if ($stmt->execute()) {
        return $stmt->insert_id;
    }

    return false;
}
/*
function handleGoogleSignIn($idToken)
{
    $client = new Google_Client(['client_id' => 'YOUR_GOOGLE_CLIENT_ID']);
    $payload = $client->verifyIdToken($idToken);

    if ($payload) {
        $googleId = $payload['sub'];
        $email = $payload['email'];

        $conn = getDbConnection();
        $stmt = $conn->prepare("SELECT id FROM users WHERE google_id = ?");
        $stmt->bind_param("s", $googleId);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            return false; // User already exists
        } else {
            // Register new Google user
            $stmt = $conn->prepare("INSERT INTO users (google_id, email) VALUES (?, ?)");
            $stmt->bind_param("ss", $googleId, $email);
            if ($stmt->execute()) {
                return $stmt->insert_id;
            }
        }
    }

    return false;
}*/

$input = file_get_contents('php://input');

$mapper = (new \JsonMapper\JsonMapperFactory())->bestFit();

$register_payload = $mapper->mapToClassFromString($input, RegisterPayload::class);

if ($register_payload->authentication_provider == 'GOOGLE') {
    //$idToken = $input['idToken'];
    //$userId = handleGoogleSignIn($idToken);
    http_response_code(401);
    echo json_encode(['error' => 'We do not currently support GOOGLE, we will soon.']);
    return;
} else if ($register_payload->authentication_provider == 'USERNAME_PASSWORD') {
    $user_id = registerUser($register_payload->username, $register_payload->password);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid authentication_provider. We only support the following: [GOOGLE, USERNAME_PASSWORD]']);
    return;
}

if ($user_id) {
    $jwt = createJwt($user_id);
    echo json_encode(['token' => $jwt]);
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Registration failed']);
}
?>