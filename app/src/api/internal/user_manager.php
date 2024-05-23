<?php



require_once '../vendor/autoload.php';
require_once 'config.php';
require_once 'jwt.php';
require_once 'utils.php';
require_once 'types.php';

class UserManager
{
    private $connection;

    public function __construct($db)
    {
        $this->connection = $db->getConnection();
    }

    public function verifyPassword($username, $password): ?int
    {
        $stmt = $this->connection->prepare("SELECT id, password FROM users WHERE authentication_id = ? AND authentication_provider = 'USERNAME_PASSWORD'");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($id, $hashedPassword);
            $stmt->fetch();

            if (password_verify($password, $hashedPassword)) {
                $this->updateLastLoggedIn($id);
                return $id;
            }
        }

        return null;
    }

    private function updateLastLoggedIn($userId): bool
    {
        $stmt = $this->connection->prepare("UPDATE users SET date_last_logged_in = CURRENT_TIMESTAMP WHERE id = ? LIMIT 1");
        $stmt->bind_param("i", $userId);
        return $stmt->execute();
    }

    public function registerUser($username, $password): ?int
    {
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        $stmt = $this->connection->prepare("INSERT INTO users (authentication_id, authentication_provider, password) VALUES (?, 'USERNAME_PASSWORD', ?)");
        $stmt->bind_param("ss", $username, $hashedPassword);
        if ($stmt->execute()) {
            return $stmt->insert_id;
        }

        return null;
    }
}


?>