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

    public function createContact($contact)
    {
        $query = "INSERT INTO contacts (user_id, first_name, last_name, phone_number, email_address, avatar_url, bio, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->connection->prepare($query);
        $stmt->bind_param("isssssss", $contact->user_id, $contact->first_name, $contact->last_name, $contact->phone_number, $contact->email_address, $contact->avatar_url, $contact->bio, $contact->description);
        if ($stmt->execute()) {
            return $stmt->insert_id;
        } else {
            return false;
        }
    }

    public function readContact($id)
    {
        $query = "SELECT * FROM contacts WHERE id = ?";
        $stmt = $this->connection->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows == 1) {
            $row = $result->fetch_assoc();
            return new Contact($row['id'], $row['user_id'], $row['first_name'], $row['last_name'], $row['phone_number'], $row['email_address'], $row['avatar_url'], $row['bio'], $row['description']);
        } else {
            return null;
        }
    }

    public function updateContact($contact)
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

    public function searchContacts($userId, $searchTerm)
    {
        $searchTerm = '%' . $this->connection->real_escape_string($searchTerm) . '%';
        $query = "SELECT * FROM contacts WHERE first_name LIKE ? OR last_name LIKE ? OR phone_number LIKE ? OR email_address LIKE ? WHERE user_id = ?";
        $stmt = $this->connection->prepare($query);
        $stmt->bind_param("sssss", $searchTerm, $searchTerm, $searchTerm, $searchTerm, $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $contacts = [];
        while ($row = $result->fetch_assoc()) {
            $contacts[] = new Contact($row['id'], $row['user_id'], $row['first_name'], $row['last_name'], $row['phone_number'], $row['email_address'], $row['avatar_url'], $row['bio'], $row['description']);
        }
        return $contacts;
    }
}

// Usage example:
$db = new Database();
$contactManager = new ContactManager($db);

// Create a new contact
$newContact = new Contact(null, 1, 'John', 'Doe', '123-456-7890', 'john.doe@example.com', 'http://example.com/avatar.jpg', 'Bio text', 'Description text');
$newContactId = $contactManager->createContact($newContact);
if ($newContactId) {
    echo "New contact created with ID: $newContactId\n";
}

// Read a contact
$contact = $contactManager->readContact($newContactId);
if ($contact) {
    echo "Contact: " . $contact->first_name . " " . $contact->last_name . "\n";
}

// Update a contact
$contact->phone_number = '098-765-4321';
if ($contactManager->updateContact($contact)) {
    echo "Contact updated successfully\n";
}

// Delete a contact
if ($contactManager->deleteContact($newContactId)) {
    echo "Contact deleted successfully\n";
}

// Search contacts
$searchResults = $contactManager->searchContacts('John');
foreach ($searchResults as $contact) {
    echo "Found Contact: " . $contact->first_name . " " . $contact->last_name . "\n";
}

$db->closeConnection();
?>



?>