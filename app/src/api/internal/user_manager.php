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

    public function registerUser(string $username, string $password, string $first_name, string $last_name): ?int
    {
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        $stmt = $this->connection->prepare("INSERT INTO users (authentication_id, authentication_provider, password, first_name, last_name) VALUES (?, 'USERNAME_PASSWORD', ?, ?, ?)");
        $stmt->bind_param("ssss", $username, $hashedPassword, $first_name, $last_name);
        if ($stmt->execute()) {
            return $stmt->insert_id;
        }

        return null;
    }


    public function getUser(int $id): ?User
    {
        $query = "SELECT * FROM users WHERE id = ?";
        $stmt = $this->connection->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows == 1) {
            $row = $result->fetch_assoc();
            $contact = new User($row['id'], $row['first_name'], $row['last_name'], $row['date_created'], $row['date_last_logged_in'], $row['authentication_id'], $row['authentication_provider']);
            return $contact;
        } else {
            return null;
        }
    }
}
?>