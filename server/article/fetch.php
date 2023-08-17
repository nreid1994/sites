<?php
/**
 * Will get an article or all articles from the DB
 * Payload will look like
 * {
 *      article_id: <article_id>
 * }
 */
require_once "../contrib/lib.php";
require_once "../contrib/users.php";

set_headers();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

$payload = $data->payload;

if(force_logout($data->user_id)) {
    force_logout_response();
    exit();
}

$conn = get_mysql_connection();
if(isset($payload->article_id)) {
    $stmt = $conn->prepare("SELECT * FROM `articles` WHERE article_id=?");
    if (!$stmt) {
        echo json_encode(array("error" => $conn->error));
        exit();
    }

    $stmt->bind_param("s", $payload->article_id);
    if(!$stmt->execute()) {
        echo json_encode(array("error" => $stmt->error));
        exit();
    }

    $stmt_result = $stmt->get_result();
    $row = $stmt_result->fetch_object();
    echo json_encode(array("success" => true, "article" => $row));
} else {
    $stmt = $conn->prepare("SELECT * FROM `articles` ORDER BY updatedAt DESC");
    if (!$stmt) {
        echo json_encode(array("error" => $conn->error));
        exit();
    }

    if(!$stmt->execute()) {
        echo json_encode(array("error" => $stmt->error));
        exit();
    }

    $stmt_result = $stmt->get_result();
    $articles = array();
    while($row = $stmt_result->fetch_object()) $articles[] = $row;
    echo json_encode(array("success" => true, "articles" => $articles));
}

$stmt->close();
?>