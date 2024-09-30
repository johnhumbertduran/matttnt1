<?php
session_start();

if (!isset($_SESSION['username'])) {
    header("Location: index.php");
    exit();
}

include 'db_connection.php';

$username = $_SESSION['username'];
$sql = "SELECT * FROM users WHERE username='$username'";
$result = $conn->query($sql);
$user = $result->fetch_assoc();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Profile</title>
    <style>
        body {font-family: Arial, sans-serif;}
        .profile-section {margin: 20px;}
        .section {margin-bottom: 20px;}
    </style>
</head>
<body>
    <h2>Welcome, <?php echo $user['username']; ?></h2>

    <div class="profile-section">
        <!-- Account Details Section -->
        <div class="section">
            <h3>Account Details</h3>
            <p>Email: <?php echo $user['email']; ?></p>
            <p>Username: <?php echo $user['username']; ?></p>
            
        </div>

        <!-- My Bookings Section -->
        <div class="section">
            <h3>My Bookings</h3>
            <?php
            // Fetch user bookings
            $sql = "SELECT * FROM bookings WHERE user_id = " . $user['id'];
            $bookings_result = $conn->query($sql);
            
            if ($bookings_result->num_rows > 0) {
                while ($booking = $bookings_result->fetch_assoc()) {
                    echo "<p>Booking ID: " . $booking['id'] . " | Date: " . $booking['booking_date'] . "</p>";
                }
            } else {
                echo "<p>No bookings found.</p>";
            }
            ?>
        </div>

        <!-- Reviews Section -->
        <div class="section">
            <h3>My Reviews</h3>
            <?php
            // Fetch user reviews
            $sql = "SELECT * FROM reviews WHERE user_id = " . $user['id'];
            $reviews_result = $conn->query($sql);
            
            if ($reviews_result->num_rows > 0) {
                while ($review = $reviews_result->fetch_assoc()) {
                    echo "<p>Review ID: " . $review['id'] . " | Review: " . $review['review_text'] . "</p>";
                }
            } else {
                echo "<p>No reviews found.</p>";
            }
            ?>
        </div>

        <!-- Logout Section -->
        <div class="section">
            <a href="logout.php">Logout</a>
        </div>
    </div>

</body>
</html>

<?php
$conn->close();
?>
