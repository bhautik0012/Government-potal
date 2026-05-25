#!/usr/bin/env bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "==> Installing Python dependencies..."
pip install -r backend/requirements.txt

echo "==> Building React frontend..."
cd frontend
npm ci
npm run build
cd "$ROOT"

echo "==> Copying frontend build to backend/static..."
mkdir -p backend/static
rm -rf backend/static/*
cp -r frontend/build/* backend/static/

if [ ! -f backend/static/index.html ]; then
  echo "ERROR: backend/static/index.html not found after build"
  exit 1
fi

echo "==> Build OK ($(ls backend/static | wc -l) files in static)"
