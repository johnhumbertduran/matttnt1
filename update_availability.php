<?php
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $hotel_id = $_POST['hotel_id'];
    $dates = $_POST['dates'];  

    // Prepare the statements
    $check_sql = "SELECT * FROM hotel_availability WHERE hotel_id = ? AND date = ?";
    $update_sql = "UPDATE hotel_availability SET fully_booked = 1 WHERE hotel_id = ? AND date = ?";
    $insert_sql = "INSERT INTO hotel_availability (hotel_id, date, fully_booked) VALUES (?, ?, 1)";

    $check_stmt = $conn->prepare($check_sql);
    $update_stmt = $conn->prepare($update_sql);
    $insert_stmt = $conn->prepare($insert_sql);

    foreach ($dates as $date) {
 
        $check_stmt->bind_param('is', $hotel_id, $date);
        $check_stmt->execute();
        $result = $check_stmt->get_result();

        if ($result->num_rows > 0) {

            $update_stmt->bind_param('is', $hotel_id, $date);
            $update_stmt->execute();
        } else {

            $insert_stmt->bind_param('is', $hotel_id, $date);
            $insert_stmt->execute();
        }
    }


    $check_stmt->close();
    $update_stmt->close();
    $insert_stmt->close();

    // Respond back
    echo json_encode(['success' => 'Fully booked dates updated']);
    exit();
}
