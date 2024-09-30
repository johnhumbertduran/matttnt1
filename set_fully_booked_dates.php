<?php
include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $product_id = $_POST['product_id'];   
    $category = $_POST['category'];    
    $fully_booked_dates = $_POST['fully_booked_dates']; 
    $datesArray = explode(',', $fully_booked_dates);


    $sql = "INSERT INTO fully_booked_dates (product_id, category, booked_date) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);

    foreach ($datesArray as $date) {
        $date = trim($date); 
        $stmt->bind_param('iss', $product_id, $category, $date);
        $stmt->execute();
    }

    header("Location: admin_dashboard.php?section=$category");
    exit();
}

$conn->close();
?>
