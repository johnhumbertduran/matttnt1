<?php
session_start();

if (!isset($_SESSION['username'])) {
    header("Location: login.php");
    exit();
}

include 'db_connection.php';

// Fetch user bookings
$username = $_SESSION['username'];
$sql = "SELECT * FROM users WHERE username='$username'";
$result = $conn->query($sql);
$user = $result->fetch_assoc();

$sql_bookings = "SELECT * FROM bookings WHERE user_id = " . $user['id'];
$bookings_result = $conn->query($sql_bookings);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Bookings - Matt Travel and Tours</title>
    <style>
        body {font-family: Arial, sans-serif;}
        .container {max-width: 600px; margin: 0 auto;}
    </style>
</head>
<body>
    <div class="container">
        <h2>My Bookings</h2>
        <?php
        if ($bookings_result->num_rows > 0) {
            while ($booking = $bookings_result->fetch_assoc()) {
                echo "<p>Booking ID: " . $booking['id'] . " | Date: " . $booking['booking_date'] . "</p>";
            }
        } else {
            echo "<p>No bookings found.</p>";
        }
        ?>
    </div>
</body>
</html>

<?php
$conn->close();
?>
