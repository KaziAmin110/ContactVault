<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_FILES['image']) && $_FILES['image']['error'] == UPLOAD_ERR_OK) {
        if (isset($_POST['json'])) {
            $jsonData = json_decode($_POST['json'], true);
            // Do something with the JSON data
            error_log($_POST['json']);

            
        }


        $uploadDir = '/var/www/html/avatars/';
        $uploadFile = $uploadDir . basename($_FILES['image']['name']);

        // Create the uploads directory if it doesn't exist
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Move the uploaded file to the uploads directory
        if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
            // Handle JSON data
            if (isset($_POST['json'])) {
                $jsonData = json_decode($_POST['json'], true);
                // Do something with the JSON data
                error_log($_POST['json']);
            }

            echo json_encode(['status' => 'success', 'message' => 'File uploaded successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'File upload failed']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No file uploaded or upload error']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>