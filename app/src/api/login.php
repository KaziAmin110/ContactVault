<?php
require_once '../vendor/autoload.php';
require_once 'config.php';
require_once 'jwt.php';
require_once 'utils.php';
require_once 'types.php';

function verifyPassword($username, $password): ?int
{
    $conn = getDbConnection();
    $stmt = $conn->prepare("SELECT id, password FROM users WHERE authentication_id = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $hashedPassword);
        $stmt->fetch();

        if (password_verify($password, $hashedPassword)) {
            return $id;
        }
    }

    return null;
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
            $stmt->bind_result($id);
            $stmt->fetch();
            return $id;
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
}

*/

$input = file_get_contents('php://input');

$mapper = (new \JsonMapper\JsonMapperFactory())->bestFit();

$login_payload = $mapper->mapToClassFromString($input, LoginPayload::class);


if ($login_payload->authentication_provider == 'GOOGLE') {
    $idToken = $input['idToken'];
    //$userId = handleGoogleSignIn($idToken);
    http_response_code(401);
    echo json_encode(['error' => 'We do not currently support GOOGLE, we will soon.']);
    return;
} else if ($login_payload->authentication_provider == 'USERNAME_PASSWORD') {
    $user_id = verifyPassword($login_payload->username, $login_payload->password);
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