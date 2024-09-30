<?php
// Connect to the database
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get data from the form
    $id = $_POST['id'];
    $tour_type = $_POST['tour_type'];
    $price_adult = $_POST['price_adult'];
    $price_kid = $_POST['price_kid'];
    $inclusion = $_POST['inclusion'];
    $exclusion = $_POST['exclusion'];

    // Update query
    $sql = "UPDATE tours SET tour_type = '$tour_type', price_adult = '$price_adult', price_kid = '$price_kid', inclusion = '$inclusion', exclusion = '$exclusion' WHERE id = $id";

    if ($conn->query($sql) === TRUE) {
        header("Location: admin_dashboard.php?update_success=true");
        exit();
    } else {
        echo "Error updating record: " . $conn->error;
    }
}
?>
