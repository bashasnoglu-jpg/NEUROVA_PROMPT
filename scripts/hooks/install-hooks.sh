#!/bin/sh
set -eu

cd "$(git rev-parse --show-toplevel)"

git config core.hooksPath .githooks
chmod +x .githooks/pre-commit 2>/dev/null || true

echo "Installed git hooks via core.hooksPath=.githooks"
