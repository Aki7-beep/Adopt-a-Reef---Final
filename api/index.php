<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
require __DIR__ . '/Database.php';
require __DIR__ . '/Storage.php';
require __DIR__ . '/Auth.php';
require __DIR__ . '/routes.php';

try {
    $path = request_path();
    // Strip leading /api if present (Apache may pass full path)
    if (str_starts_with($path, '/api')) {
        $path = substr($path, 4) ?: '/';
    }
    dispatch_routes(request_method(), $path);
} catch (PDOException $e) {
    json_error('Database error. Check api/config.php and import database/schema.sql.', 500);
} catch (Throwable $e) {
    json_error($e->getMessage(), 500);
}
