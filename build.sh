#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLIENT_DIR="$SCRIPT_DIR/react_ws_src"
SERVER_DIR="$SCRIPT_DIR/WS"

echo "==> Building React client..."
cd "$CLIENT_DIR"
npm run build

echo "==> Cleaning old build artifacts..."
rm -f "$SERVER_DIR/public/bundle.js" "$SERVER_DIR/public/bundle.js.map"
rm -f "$SERVER_DIR/public/style.css" "$SERVER_DIR/public/style.css.map"

echo "==> Copying static assets (images, config)..."
# Copy static assets FIRST (excluding index.html which Vite generates)
find "$CLIENT_DIR/static" -mindepth 1 -maxdepth 1 ! -name 'index.html' -exec cp -r {} "$SERVER_DIR/public/" \;

echo "==> Copying Vite build output..."
# Copy Vite dist LAST so index.html from Vite is used
cp -r "$CLIENT_DIR/dist/"* "$SERVER_DIR/public/"

echo "==> Done! WS/public is ready for deployment."
