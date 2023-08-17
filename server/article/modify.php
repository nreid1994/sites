<?php
/**
 * Will modify an article on the API and DB
 * Payload will look like
 * {
 *      article_id: <article_id>
 *      title: <title>
 *      contents: <contents>
 *      views: <increment>
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

$article_id = $payload->article_id;
unset($payload->article_id);

$result = bdpa_fetch("articles/{$article_id}", "PATCH", $payload);
$response = json_decode($result);
if(isset($response->error)) {
    echo $result;
    exit();
}

$result = bdpa_fetch("articles/{$article_id}");
$response = json_decode($result);
if(isset($response->error)) {
    echo $result;
    exit();
}

$article = $response->article;

$conn = get_mysql_connection();
$stmt = $conn->prepare("UPDATE `articles` SET 
    title=?,
    contents=?,
    views=?
    WHERE article_id=?");
if (!$stmt) {
    echo json_encode(array("error" => $conn->error));
    exit();
}

$stmt->bind_param("ssis", $article->title, $article->contents, $article->views, $article->article_id);
if(!$stmt->execute()) {
    echo json_encode(array("error" => $stmt->error));
    exit();
}
$stmt->close();

echo json_encode(array("success" => true, "article" => $article));
?>