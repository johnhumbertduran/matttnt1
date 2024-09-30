<?php
session_start();

if (!isset($_SESSION['username'])) {
    header("Location: login.php");
    exit();
}

include 'db_connection.php';

// Fetch user account details
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
    <title>Account Details - Matt Travel and Tours</title>
    <style>
        body {font-family: Arial, sans-serif;}
        .container {max-width: 600px; margin: 0 auto;}
    </style>
</head>
<body>
    <div class="container">
        <h2>Account Details</h2>
        <p>Email: <?php echo $user['email']; ?></p>
        <p>Username: <?php echo $user['username']; ?></p>
    </div>
</body>
</html>

<?php
$conn->close();
?>
