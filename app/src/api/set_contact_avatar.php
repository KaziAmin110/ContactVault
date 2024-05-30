<?php
require_once '../vendor/autoload.php';
require_once 'internal/jwt.php';
require_once 'internal/types.php';
require_once 'internal/database.php';
require_once 'internal/contact_manager.php';

use Ramsey\Uuid\Uuid;

function substringAfterLastPeriod(string $string): ?string
{
    // Find the position of the last period in the string
    $lastPeriodPos = strrpos($string, '.');

    // Check if a period was found
    if ($lastPeriodPos === false) {
        // Handle the error case where there is no period in the string
        error_log("Error: No period found in the string.");
        return null;
    }

    // Extract and return the substring after the last period
    return substr($string, $lastPeriodPos + 1);
}

function uploadFile(): string
{
    if (isset($_FILES['image']) && $_FILES['image']['error'] == UPLOAD_ERR_OK) {
        $UPLOAD_DIR = '/var/www/html/avatars/';

        $file_extension = substringAfterLastPeriod(basename($_FILES['image']['name']));

        if ($file_extension == null) {
            http_response_code(400);
            echo json_encode(['error' => 'The file you are uploading must have a file extension.']);
            exit;
        }

        do {
            $fileName = Uuid::uuid4() . "." . $file_extension;
            $uploadFile = $UPLOAD_DIR . $fileName;
        } while (file_exists($uploadFile));

        error_log("fileName=" . $fileName);
        error_log("uploadFile=" . $uploadFile);

        // Move the uploaded file to the uploads directory
        if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
            return $fileName;
        } else {
            error_log('File upload failed');
            http_response_code(400);
            echo json_encode(['error' => 'File upload failed.']);
            exit;
        }
    } else {
        error_log('No file uploaded or upload error');
        http_response_code(400);
        echo json_encode(['error' => 'No file uploaded or upload error.']);
        exit;
    }
}

function deleteFile(string $filePath)
{
    // Check if the file exists
    if (!file_exists($filePath)) {
        error_log("Previous contact avatar image file does not exist at path: " . $filePath);
    }

    // Try to delete the file
    if (!unlink($filePath)) {
        error_log("Unable to delete previous contact avatar image file at path: " . $filePath);
    }
}


if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    echo json_encode(['message' => 'Invalid request method']);
    exit;
}

$loggedInUser = extractLoggedInUser();

if (!isset($_POST['json'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing json data']);
    exit;
}

$mapper = (new \JsonMapper\JsonMapperFactory())->bestFit();

$set_contact_avatar_payload = $mapper->mapToClassFromString($_POST['json'], SetContactAvatarPayload::class);

// Validate the mapped data
if (!isset($set_contact_avatar_payload->contact_id)) {
    http_response_code(400);
    echo json_encode(['error' => 'The contact_id field is required.']);
    exit;
}

$database = new Database();

$contact_manager = new ContactManager($database);
try {
    $contact = $contact_manager->getContact($set_contact_avatar_payload->contact_id);
    if ($contact == null) {
        http_response_code(404);
        echo json_encode(['error' => 'Contact not found.']);
        exit;
    }

    if ($contact->user_id != $loggedInUser->user_id) {
        http_response_code(401);
        echo json_encode(['error' => 'You do not own the requested contact.']);
        exit;
    }

    $previousAvatarUrl = $contact->avatar_url;

    $fileName = 'avatars/' . uploadFile();

    $contact->avatar_url = $fileName;

    error_log("contact->avatar_url=" . $contact->avatar_url);

    $updated = $contact_manager->updateContact($contact);

    if ($updated) {
        deleteFile('/var/www/html/' . $previousAvatarUrl);
        http_response_code(200);
        echo json_encode(['contact' => $contact]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update contact in database.']);
    }
} finally {
    $database->closeConnection();
}











?>