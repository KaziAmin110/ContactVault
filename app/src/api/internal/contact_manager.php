<?php


require_once 'database.php';
require_once 'types.php';


class ContactManager
{
    private $connection;

    public function __construct($db)
    {
        $this->connection = $db->getConnection();
    }

    public function createContact(int $user_id, Contact $contact): ?Contact
    {
        $query = "INSERT INTO contacts (user_id, first_name, last_name, phone_number, email_address, avatar_url, bio, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->connection->prepare($query);
        $stmt->bind_param("isssssss", $user_id, $contact->first_name, $contact->last_name, $contact->phone_number, $contact->email_address, $contact->avatar_url, $contact->bio, $contact->description);
        if ($stmt->execute()) {
            $contact->id = $stmt->insert_id;
            return $contact;
        } else {
            return null;
        }
    }

    public function getContact(int $id): ?Contact
    {
        $query = "SELECT * FROM contacts WHERE id = ?";
        $stmt = $this->connection->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows == 1) {
            $row = $result->fetch_assoc();
            $contact = new Contact($row['id'], $row['user_id'], $row['first_name'], $row['last_name'], $row['phone_number'], $row['email_address'], $row['avatar_url'], $row['bio'], $row['description']);
            return $contact;
        } else {
            return null;
        }
    }

    public function updateContact(Contact $contact): bool
    {
        $fields = [];
        $params = [];
        $types = '';

        if ($contact->first_name !== null) {
            $fields[] = 'first_name = ?';
            $params[] = $contact->first_name;
            $types .= 's';
        }
        if ($contact->last_name !== null) {
            $fields[] = 'last_name = ?';
            $params[] = $contact->last_name;
            $types .= 's';
        }
        if ($contact->phone_number !== null) {
            $fields[] = 'phone_number = ?';
            $params[] = $contact->phone_number;
            $types .= 's';
        }
        if ($contact->email_address !== null) {
            $fields[] = 'email_address = ?';
            $params[] = $contact->email_address;
            $types .= 's';
        }
        if ($contact->avatar_url !== null) {
            $fields[] = 'avatar_url = ?';
            $params[] = $contact->avatar_url;
            $types .= 's';
        }
        if ($contact->bio !== null) {
            $fields[] = 'bio = ?';
            $params[] = $contact->bio;
            $types .= 's';
        }
        if ($contact->description !== null) {
            $fields[] = 'description = ?';
            $params[] = $contact->description;
            $types .= 's';
        }

        if (empty($fields)) {
            return false; // No fields to update
        }

        $types .= 'i';
        $params[] = $contact->id;

        $query = "UPDATE contacts SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $this->connection->prepare($query);
        $stmt->bind_param($types, ...$params);

        return $stmt->execute();
    }


    public function deleteContact($id)
    {
        $query = "DELETE FROM contacts WHERE id = ?";
        $stmt = $this->connection->prepare($query);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    public function searchContacts($userId, $searchTerm, $page = 1, $resultsPerPage = 10)
    {
        $offset = ($page - 1) * $resultsPerPage;
        $searchTerm = '%' . $this->connection->real_escape_string($searchTerm) . '%';

        // Get the total number of results
        $countQuery = "SELECT COUNT(*) AS total FROM contacts WHERE user_id = ? AND (first_name LIKE ? OR last_name LIKE ? OR phone_number LIKE ? OR email_address LIKE ?)";
        $countStmt = $this->connection->prepare($countQuery);
        $countStmt->bind_param("issss", $userId, $searchTerm, $searchTerm, $searchTerm, $searchTerm);
        $countStmt->execute();
        $countResult = $countStmt->get_result();
        $totalResults = $countResult->fetch_assoc()['total'];
        $totalPages = ceil($totalResults / $resultsPerPage);

        // Get the search results with pagination
        $query = "SELECT * FROM contacts WHERE user_id = ? AND (first_name LIKE ? OR last_name LIKE ? OR phone_number LIKE ? OR email_address LIKE ?) LIMIT ?, ?";
        $stmt = $this->connection->prepare($query);
        $stmt->bind_param("issssii", $userId, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $offset, $resultsPerPage);
        $stmt->execute();
        $result = $stmt->get_result();
        $contacts = [];
        while ($row = $result->fetch_assoc()) {
            $contacts[] = new Contact($row['id'], $row['user_id'], $row['first_name'], $row['last_name'], $row['phone_number'], $row['email_address'], $row['avatar_url'], $row['bio'], $row['description']);
        }

        return [
            'contacts' => $contacts,
            'total_pages' => $totalPages
        ];
    }
}
?>