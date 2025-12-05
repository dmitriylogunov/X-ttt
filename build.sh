#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLIENT_DIR="$SCRIPT_DIR/react_ws_src"
SERVER_DIR="$SCRIPT_DIR/WS"

echo "==> Building React client..."
cd "$CLIENT_DIR"
npm run build

echo "==> Copying build output to WS/public..."
cp -r dist/* "$SERVER_DIR/public/"
cp -r static/* "$SERVER_DIR/public/"

echo "==> Done! WS/public is ready for deployment."
