<?php
/**
 * Database and app settings for XAMPP.
 * Default XAMPP MySQL: user "root", empty password.
 */
return [
    'db' => [
        'host' => getenv('DB_HOST') ?: '127.0.0.1',
        'port' => getenv('DB_PORT') ?: '3306',
        'name' => getenv('DB_NAME') ?: 'adopt_a_reef',
        'user' => getenv('DB_USER') ?: 'root',
        'pass' => getenv('DB_PASS') ?: '',
        'charset' => 'utf8mb4',
    ],
    // Set to your folder name under htdocs, e.g. "/adopt-a-reef" (no trailing slash).
    // Leave empty "" if the site lives at http://localhost/
    'base_path' => getenv('APP_BASE_PATH') ?: '/adopt-a-reef',
    'session_name' => 'ADOPT_A_REEF_SESSION',
    // Match your location (Zamboanga / Philippines). Keeps dates aligned with phpMyAdmin.
    'timezone' => getenv('APP_TIMEZONE') ?: 'Asia/Manila',
];
