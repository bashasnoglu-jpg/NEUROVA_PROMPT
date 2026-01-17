#!/bin/sh
set -eu

cd "$(git rev-parse --show-toplevel)"

# Keep a stable entrypoint name for team onboarding.
if [ -f "scripts/hooks/install-hooks.sh" ]; then
  sh scripts/hooks/install-hooks.sh
  exit 0
fi

git config core.hooksPath .githooks
chmod +x .githooks/pre-commit 2>/dev/null || true
echo "NEUROVA hooks enabled: core.hooksPath=.githooks"

