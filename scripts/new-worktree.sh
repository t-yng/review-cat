#!/bin/bash
set -e

BRANCH=$1
BASE=${2:-main}
REPO_ROOT=$(git rev-parse --show-toplevel)
DIR="$(dirname "$REPO_ROOT")/review-cat-$(echo $BRANCH | sed 's/\//-/g')"

git worktree add -b "$BRANCH" "$DIR" "origin/$BASE"

find "$REPO_ROOT" -name ".env*" -not -path "*/.git/*" -not -path "*/node_modules/*" | while read -r env_file; do
  relative="${env_file#$REPO_ROOT/}"
  dest="$DIR/$relative"
  mkdir -p "$(dirname "$dest")"
  cp "$env_file" "$dest"
done

pnpm --dir "$DIR" install

echo "Worktree ready: $DIR"
