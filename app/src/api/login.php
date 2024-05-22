<?php
require '../vendor/autoload.php';
require 'config.php';
require 'jwt.php';
require 'utils.php';


function verifyPassword($username, $password): ?string
{
    $conn = getDbConnection();
    $stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ?");
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

$input = json_decode(file_get_contents('php://input'), true);
$authProvider = $input['authentication_provider'];

if ($authProvider == 'GOOGLE') {
    $idToken = $input['idToken'];
    //$userId = handleGoogleSignIn($idToken);
    http_response_code(401);
    echo json_encode(['error' => 'We do not currently support GOOGLE, we will soon.']);

} else if ($authProvider == 'USERNAME_PASSWROD') {
    $username = $input['username'];
    $password = $input['password'];
    $userId = verifyPassword($username, $password);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid authentication_provider. We only support the following: [GOOGLE, USERNAME_PASSWORD]']);
}

if ($userId) {
    $jwt = createJwt($userId);
    echo json_encode(['token' => $jwt]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
}
?>