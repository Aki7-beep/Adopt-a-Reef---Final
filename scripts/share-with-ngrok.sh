#!/usr/bin/env bash
# Share local XAMPP site via ngrok. Run from project root: npm run share

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE_PATH="/adopt-a-reef"
PORT="${NGROK_PORT:-80}"

echo "Adopt a Reef — ngrok share"
echo "=========================="
echo ""

# Check local site
if ! curl -sf "http://127.0.0.1:${PORT}${SITE_PATH}/" -o /dev/null 2>/dev/null; then
  echo "Local site not reachable at http://127.0.0.1:${PORT}${SITE_PATH}/"
  echo ""
  echo "Fix:"
  echo "  1. Start Apache + MySQL in XAMPP"
  echo "  2. Run: npm run deploy:xampp"
  echo "  3. Open http://localhost${SITE_PATH}/ in your browser"
  exit 1
fi

echo "Local site OK."
echo ""

NGROK=""
if command -v ngrok >/dev/null 2>&1; then
  NGROK="ngrok"
elif [ -x /opt/homebrew/bin/ngrok ]; then
  NGROK="/opt/homebrew/bin/ngrok"
elif [ -x /usr/local/bin/ngrok ]; then
  NGROK="/usr/local/bin/ngrok"
fi

if [ -z "$NGROK" ]; then
  echo "ngrok is not installed."
  echo ""
  echo "Install:"
  echo "  brew install ngrok/ngrok/ngrok"
  echo "  or download from https://ngrok.com/download"
  echo ""
  echo "Then sign up and run:"
  echo "  ngrok config add-authtoken YOUR_TOKEN"
  echo ""
  echo "See TUNNEL.md for full steps."
  exit 1
fi

if ! "$NGROK" config check >/dev/null 2>&1; then
  echo "ngrok needs an authtoken (one-time setup)."
  echo "  1. https://dashboard.ngrok.com/get-started/your-authtoken"
  echo "  2. ngrok config add-authtoken YOUR_TOKEN"
  exit 1
fi

echo "Starting tunnel on port ${PORT}..."
echo ""
echo "When ngrok starts, share this link (replace YOUR-ID with yours):"
echo "  https://YOUR-ID.ngrok-free.app${SITE_PATH}/"
echo ""
echo "Keep this terminal open. Press Ctrl+C to stop sharing."
echo ""

exec "$NGROK" http "$PORT"
