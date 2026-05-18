#!/usr/bin/env bash
# Use system PHP or XAMPP's PHP (XAMPP is not on PATH by default on Mac/Windows).

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PHP_BIN=""

if command -v php >/dev/null 2>&1; then
  PHP_BIN="php"
elif [ -x "/Applications/XAMPP/xamppfiles/bin/php" ]; then
  PHP_BIN="/Applications/XAMPP/xamppfiles/bin/php"
elif [ -x "/Applications/XAMPP/bin/php" ]; then
  PHP_BIN="/Applications/XAMPP/bin/php"
elif [ -x "/opt/lampp/bin/php" ]; then
  PHP_BIN="/opt/lampp/bin/php"
elif [ -x "C:/xampp/php/php.exe" ]; then
  PHP_BIN="C:/xampp/php/php.exe"
fi

if [ -z "$PHP_BIN" ]; then
  echo ""
  echo "PHP was not found."
  echo ""
  echo "You already have PHP inside XAMPP — the terminal just does not know where it is."
  echo ""
  echo "Mac: run this instead (in a second terminal while npm run dev runs):"
  echo "  /Applications/XAMPP/xamppfiles/bin/php -S 127.0.0.1:8080 -t api"
  echo ""
  echo "Or skip dev:api entirely: use XAMPP Apache + copy dist to htdocs (see SETUP.md)."
  echo ""
  exit 1
fi

echo "Using PHP: $PHP_BIN"
echo "API listening at http://127.0.0.1:8080 (proxy from Vite dev server)"
exec "$PHP_BIN" -S 127.0.0.1:8080 -t api
