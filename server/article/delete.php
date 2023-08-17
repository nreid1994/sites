<?php
/**
 * Will delete an article from the API and DB
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

$result = bdpa_fetch("articles/{$payload->article_id}", "DELETE");
$response = json_decode($result);
if(isset($response->error)) {
    echo $result;
    exit();
}

$conn = get_mysql_connection();
$stmt = $conn->prepare("DELETE FROM `articles` WHERE article_id=?");
if (!$stmt) {
    echo json_encode(array("error" => $conn->error));
    exit();
}

$stmt->bind_param("s", $payload->article_id);
if(!$stmt->execute()) {
    echo json_encode(array("error" => $stmt->error));
    exit();
}
$stmt->close();

echo json_encode(array("success" => true));
?>