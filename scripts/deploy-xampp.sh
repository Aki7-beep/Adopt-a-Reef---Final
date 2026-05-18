#!/usr/bin/env bash
# Build and copy dist to XAMPP htdocs (Mac). Run from project root: bash scripts/deploy-xampp.sh

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

HTDOCS="/Applications/XAMPP/xamppfiles/htdocs/adopt-a-reef"

if [ ! -d "/Applications/XAMPP/xamppfiles/htdocs" ]; then
  echo "XAMPP htdocs not found at /Applications/XAMPP/xamppfiles/htdocs"
  echo "Edit HTDOCS in this script to match DocumentRoot in httpd.conf"
  exit 1
fi

echo "Building..."
npm run build:xampp

echo "Deploying to $HTDOCS ..."
mkdir -p "$HTDOCS"
cp -R dist/* "$HTDOCS/"
cp dist/.htaccess "$HTDOCS/.htaccess" 2>/dev/null || true

echo ""
echo "Done. Open in your browser:"
echo "  http://localhost/adopt-a-reef/"
echo ""
