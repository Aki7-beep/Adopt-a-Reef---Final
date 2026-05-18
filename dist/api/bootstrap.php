<?php

declare(strict_types=1);

$config = require __DIR__ . '/config.php';
date_default_timezone_set($config['timezone'] ?? 'Asia/Manila');

function app_config(): array
{
    return require __DIR__ . '/config.php';
}

function uuid_v4(): string
{
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

function json_response(mixed $data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_SLASHES);
    exit;
}

function json_error(string $message, int $status = 400): void
{
    json_response(['message' => $message], $status);
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/** ISO datetime with timezone offset — same calendar day as MySQL/phpMyAdmin (no UTC shift). */
function to_iso(?string $datetime): ?string
{
    if ($datetime === null || $datetime === '') {
        return null;
    }
    try {
        $dt = new DateTimeImmutable($datetime);
        return $dt->format('Y-m-d\TH:i:sP');
    } catch (Exception) {
        return $datetime;
    }
}

function map_user_row(array $row): array
{
    return [
        'id' => $row['id'],
        'username' => $row['username'],
        'password' => $row['password'],
        'isAdmin' => (bool) $row['is_admin'],
        'firstName' => $row['first_name'],
        'lastName' => $row['last_name'],
        'email' => $row['email'],
    ];
}

function map_coral_row(array $row): array
{
    return [
        'id' => $row['id'],
        'name' => $row['name'],
        'image' => $row['image'],
        'description' => $row['description'],
        'price' => (int) $row['price'],
        'stock' => (int) $row['stock'],
    ];
}

function map_adoption_row(array $row): array
{
    return [
        'id' => $row['id'],
        'userId' => $row['user_id'],
        'coralId' => $row['coral_id'],
        'coralName' => $row['coral_name'],
        'coralImage' => $row['coral_image'],
        'amount' => (int) $row['amount'],
        'price' => (int) $row['price'],
        'adoptedAt' => to_iso($row['adopted_at']),
    ];
}

function map_donation_row(array $row): array
{
    return [
        'id' => $row['id'],
        'userId' => $row['user_id'],
        'amount' => (int) $row['amount'],
        'donorName' => $row['donor_name'],
        'donorEmail' => $row['donor_email'],
        'donatedAt' => to_iso($row['donated_at']),
    ];
}

function map_volunteer_work_row(array $row): array
{
    return [
        'id' => $row['id'],
        'title' => $row['title'],
        'description' => $row['description'],
        'location' => $row['location'],
        'scheduledFor' => to_iso($row['scheduled_for']),
        'endDate' => to_iso($row['end_date']),
        'hours' => (int) $row['hours'],
        'status' => $row['status'],
        'category' => $row['category'],
        'maxVolunteers' => $row['max_volunteers'] !== null ? (int) $row['max_volunteers'] : null,
    ];
}

function map_signup_row(array $row): array
{
    return [
        'id' => $row['id'],
        'userId' => $row['user_id'],
        'workId' => $row['work_id'],
        'signedUpAt' => to_iso($row['signed_up_at']),
    ];
}

function start_session(): void
{
    $config = app_config();
    $basePath = $config['base_path'] ?: '/';
    if (session_status() === PHP_SESSION_NONE) {
        session_name($config['session_name']);
        session_set_cookie_params([
            'lifetime' => 60 * 60 * 24 * 7,
            'path' => $basePath,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
        session_start();
    }
}

function request_path(): string
{
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
    if ($scriptDir !== '/' && str_starts_with($uri, $scriptDir)) {
        $uri = substr($uri, strlen($scriptDir));
    }
    $uri = '/' . trim($uri, '/');
    if ($uri === '/') {
        return '/';
    }
    $trimmed = rtrim($uri, '/');
    return $trimmed !== '' ? $trimmed : '/';
}

function request_method(): string
{
    return strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
}

// CORS for local Vite dev (optional)
if (isset($_SERVER['HTTP_ORIGIN'])) {
    $origin = $_SERVER['HTTP_ORIGIN'];
    if (preg_match('#^https?://(localhost|127\.0\.0\.1)(:\d+)?$#', $origin)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
    }
}

if (request_method() === 'OPTIONS') {
    http_response_code(204);
    exit;
}

start_session();
