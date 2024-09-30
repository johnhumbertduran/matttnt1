<?php
session_start();

if (!isset($_SESSION['username'])) {
    header("Location: login.php");
    exit();
}

include 'db_connection.php';

$sql = "SELECT * FROM ferry_tickets";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Ferry Tickets - Matt Travel and Tours</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-4">
        <h2>Manage Ferry Tickets</h2>
        <a href="add_ferry.php" class="btn btn-primary mb-3">Add New Ferry Ticket</a>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Route</th>
                    <th>Schedule(s)</th>
                    <th>Vessel</th>
                    <th>Class and Prices</th> 
                    <th>Travel Time</th>
                    <th>Description</th>
                    <th>Image</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php
                if ($result->num_rows > 0) {
                    while ($ferry = $result->fetch_assoc()) {
                        echo "<tr>";
                        echo "<td>" . htmlspecialchars($ferry['id']) . "</td>";
                        echo "<td>" . htmlspecialchars($ferry['name']) . "</td>";  
                        echo "<td>" . htmlspecialchars($ferry['route']) . "</td>";  


                        $schedules = explode(', ', $ferry['schedule']);
                        if (is_array($schedules)) {
                            echo "<td>";
                            foreach ($schedules as $schedule) {
                                echo htmlspecialchars($schedule) . "<br>";
                            }
                            echo "</td>";
                        } else {
                            echo "<td>No schedules available</td>";
                        }

                        echo "<td>" . htmlspecialchars($ferry['vessel']) . "</td>"; 


echo "<td>";
if ($ferry['vessel'] === 'Fast Craft') {
    echo "Tourist Class:<br>";
    echo "Adult: ₱" . ($ferry['tourist_adult_price'] !== NULL ? number_format($ferry['tourist_adult_price'], 2) : 'N/A') . "<br>";
    echo "Senior/Student/PWD: ₱" . ($ferry['tourist_senior_price'] !== NULL ? number_format($ferry['tourist_senior_price'], 2) : 'N/A') . "<br>";
    echo "Kid: ₱" . ($ferry['tourist_kid_price'] !== NULL ? number_format($ferry['tourist_kid_price'], 2) : 'N/A') . "<br>";
    echo "Toddler: ₱" . ($ferry['tourist_toddler_price'] !== NULL ? number_format($ferry['tourist_toddler_price'], 2) : 'N/A') . "<br><br>";

    echo "Business Class:<br>";
    echo "Adult: ₱" . ($ferry['business_adult_price'] !== NULL ? number_format($ferry['business_adult_price'], 2) : 'N/A') . "<br>";
    echo "Senior/Student/PWD: ₱" . ($ferry['business_senior_price'] !== NULL ? number_format($ferry['business_senior_price'], 2) : 'N/A') . "<br>";
    echo "Kid: ₱" . ($ferry['business_kid_price'] !== NULL ? number_format($ferry['business_kid_price'], 2) : 'N/A') . "<br>";
    echo "Toddler: ₱" . ($ferry['business_toddler_price'] !== NULL ? number_format($ferry['business_toddler_price'], 2) : 'N/A') . "<br>";
} elseif ($ferry['vessel'] === 'RORO') {
    echo "Economy Class:<br>";
    echo "Adult: ₱" . ($ferry['economy_adult_price'] !== NULL ? number_format($ferry['economy_adult_price'], 2) : 'N/A') . "<br>";
    echo "Senior/Student/PWD: ₱" . ($ferry['economy_senior_price'] !== NULL ? number_format($ferry['economy_senior_price'], 2) : 'N/A') . "<br>";
    echo "Kid: ₱" . ($ferry['economy_kid_price'] !== NULL ? number_format($ferry['economy_kid_price'], 2) : 'N/A') . "<br>";
    echo "Toddler: ₱" . ($ferry['economy_toddler_price'] !== NULL ? number_format($ferry['economy_toddler_price'], 2) : 'N/A') . "<br><br>";

    echo "VIP Class:<br>";
    echo "Adult: ₱" . ($ferry['vip_adult_price'] !== NULL ? number_format($ferry['vip_adult_price'], 2) : 'N/A') . "<br>";
    echo "Senior/Student/PWD: ₱" . ($ferry['vip_senior_price'] !== NULL ? number_format($ferry['vip_senior_price'], 2) : 'N/A') . "<br>";
    echo "Kid: ₱" . ($ferry['vip_kid_price'] !== NULL ? number_format($ferry['vip_kid_price'], 2) : 'N/A') . "<br>";
    echo "Toddler: ₱" . ($ferry['vip_toddler_price'] !== NULL ? number_format($ferry['vip_toddler_price'], 2) : 'N/A') . "<br>";
}
echo "</td>";

                        echo "<td>" . htmlspecialchars($ferry['travel_time']) . "</td>"; 
                        echo "<td>" . htmlspecialchars(substr($ferry['description'], 0, 50)) . "...</td>";  
                        echo "<td><img src='" . htmlspecialchars($ferry['image_url']) . "' alt='Ferry Image' width='100'></td>";  
                        echo "<td>
                                <a href='edit_ferry.php?id=" . htmlspecialchars($ferry['id']) . "' class='btn btn-warning btn-sm'>Edit</a>
                                <a href='delete_ferry.php?id=" . htmlspecialchars($ferry['id']) . "' class='btn btn-danger btn-sm' onclick='return confirm(\"Are you sure?\")'>Delete</a>
                              </td>";
                        echo "</tr>";
                    }
                } else {
                    echo "<tr><td colspan='10' class='text-center'>No ferry tickets found.</td></tr>";
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
