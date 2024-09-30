<?php
include 'db_connection.php';

if (isset($_GET['hotel_id'])) {
    $hotel_id = $_GET['hotel_id'];
    
    $stmt = $conn->prepare("SELECT fully_booked_dates FROM hotels WHERE id = ?");
    $stmt->bind_param('i', $hotel_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $fully_booked_dates = explode(',', $row['fully_booked_dates']);
        echo json_encode(['success' => true, 'fully_booked_dates' => $fully_booked_dates]);
    } else {
        echo json_encode(['success' => false, 'error' => 'No dates found']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Missing hotel ID']);
}

$conn->close();
?>
