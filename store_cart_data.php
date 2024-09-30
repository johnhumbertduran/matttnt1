<?php
session_start();

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['cartSummary']) && isset($input['totalAmount'])) {
    // Store cart summary and total amount in session
    $_SESSION['cartSummary'] = $input['cartSummary'];
    $_SESSION['totalAmount'] = $input['totalAmount'];


    echo json_encode(['success' => true, 'session' => $_SESSION]);
} else {
  
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
}
