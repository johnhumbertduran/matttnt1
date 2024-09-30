<?php
session_start();

if (!isset($_SESSION['username'])) {
    header("Location: login.php");
    exit();
}

include 'db_connection.php';


$username = $_SESSION['username'];
$sql = "SELECT * FROM users WHERE username='$username'";
$result = $conn->query($sql);
$user = $result->fetch_assoc();

$sql_reviews = "SELECT * FROM reviews WHERE user_id = " . $user['id'];
$reviews_result = $conn->query($sql_reviews);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Reviews - Matt Travel and Tours</title>
</head>
<body>
    <h2>My Reviews</h2>
    <?php
    if ($reviews_result->num_rows > 0) {
        while ($review = $reviews_result->fetch_assoc()) {
            echo "<p>Review ID: " . $review['id'] . " | Review: " . $review['review_text'] . "</p>";
        }
    } else {
        echo "<p>No reviews found.</p>";
    }
    ?>
</body>
</html>

<?php
$conn->close();
?>
