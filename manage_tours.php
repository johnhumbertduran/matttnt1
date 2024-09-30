<?php
session_start();

if (!isset($_SESSION['username'])) {
    header("Location: admin_login.php");
    exit();
}

include 'db_connection.php';

$sql = "SELECT * FROM tours";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Tours - Matt Travel and Tours</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-4">
        <h2>Manage Tours</h2>
        <a href="add_tour.php" class="btn btn-primary mb-3">Add New Tour</a>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tour Name</th>
                    <th>Tour Type</th>
                    <th>Adult Price</th>
                    <th>Kid Price</th>
                    <th>Duration</th>
                    <th>Itinerary</th>
                    <th>Inclusion</th>
                    <th>Exclusion</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php
                if ($result->num_rows > 0) {
                    while ($tour = $result->fetch_assoc()) {
                        echo "<tr>";
                        echo "<td>" . $tour['id'] . "</td>";
                        echo "<td>" . $tour['name'] . "</td>";
                        echo "<td>" . $tour['tour_type'] . "</td>";
                        echo "<td>" . $tour['price_adult'] . "</td>";
                        echo "<td>" . $tour['price_kid'] . "</td>";
                        echo "<td>" . $tour['duration'] . "</td>";
                        echo "<td>" . substr($tour['itinerary'], 0, 50) . "...</td>";
                        echo "<td>" . $tour['inclusion'] . "</td>";
                        echo "<td>" . $tour['exclusion'] . "</td>";
                        echo "<td><a href='edit_tour.php?id=" . $tour['id'] . "' class='btn btn-warning btn-sm'>Edit</a> ";
                        echo "<a href='delete_tour.php?id=" . $tour['id'] . "' class='btn btn-danger btn-sm'>Delete</a></td>";
                        echo "</tr>";
                    }
                } else {
                    echo "<tr><td colspan='10' class='text-center'>No tours found.</td></tr>";
                }
                ?>
            </tbody>
        </table>
    </div>
</body>
</html>

<?php
$conn->close();
?>
