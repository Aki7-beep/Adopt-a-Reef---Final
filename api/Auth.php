<?php

declare(strict_types=1);

final class Auth
{
    public static function userId(): ?string
    {
        return $_SESSION['userId'] ?? null;
    }

    public static function setUserId(string $userId): void
    {
        $_SESSION['userId'] = $userId;
    }

    public static function clear(): void
    {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
        }
        session_destroy();
    }

    public static function hashPassword(string $password): string
    {
        return password_hash($password, PASSWORD_DEFAULT);
    }

    public static function verifyPassword(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }

    public static function requireAuth(): string
    {
        $userId = self::userId();
        if (!$userId) {
            json_error('Not authenticated', 401);
        }
        return $userId;
    }

    public static function requireAdmin(): string
    {
        $userId = self::requireAuth();
        $user = Storage::getUser($userId);
        if (!$user || !$user['isAdmin']) {
            json_error('Admin access required', 403);
        }
        return $userId;
    }

    public static function validateCredentials(array $body): array
    {
        $username = trim((string) ($body['username'] ?? ''));
        $password = (string) ($body['password'] ?? '');
        if (strlen($username) < 3) {
            json_error('Username must be at least 3 characters');
        }
        if (strlen($password) < 6) {
            json_error('Password must be at least 6 characters');
        }
        return [
            'username' => $username,
            'password' => $password,
            'firstName' => trim((string) ($body['firstName'] ?? '')) ?: null,
            'lastName' => trim((string) ($body['lastName'] ?? '')) ?: null,
            'email' => trim((string) ($body['email'] ?? '')) ?: null,
        ];
    }
}
