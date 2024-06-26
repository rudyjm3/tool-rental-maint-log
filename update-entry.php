<?php
header('Content-Type: application/json');

// Database connection details (replace with your actual credentials)
include 'db-conn-info.php';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Get the input data
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['entryLogNum'], $data['rentalId'], $data['equipmentDescription'], $data['serviceType'], $data['serviceDescription'], $data['hourMeter'], $data['serviceDate'], $data['techName'])) {
    $entryLogNum = $data['entryLogNum'];
    $rentalId = $data['rentalId'];
    $equipmentDescription = $data['equipmentDescription'];
    $serviceType = $data['serviceType'];
    $serviceDescription = $data['serviceDescription'];
    $hourMeter = $data['hourMeter'];
    $serviceDate = $data['serviceDate'];
    $techName = $data['techName'];

    // Prepare the SQL statement to update the entry
    $sql = "UPDATE maintenance_log SET rental_id=?, equipment_description=?, service_type=?, service_description=?, hour_meter=?, service_date=?, tech_name=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sssssssi', $rentalId, $equipmentDescription, $serviceType, $serviceDescription, $hourMeter, $serviceDate, $techName, $entryLogNum);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Failed to update entry: ' . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['error' => 'Invalid input']);
}

$conn->close();
?>
