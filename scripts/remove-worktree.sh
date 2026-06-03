#!/bin/bash
set -e

if ! command -v peco &> /dev/null; then
  echo "Error: peco is not installed. Run: brew install peco"
  exit 1
fi

# Prune prunable worktrees before showing list
git worktree prune

# Choose worktree with peco without main worktree
SELECTED=$(git worktree list \
  | tail -n +2 \
  | peco --prompt "Select worktree to remove > ")

if [ -z "$SELECTED" ]; then
  echo "No worktree selected."
  exit 0
fi

DIR=$(echo "$SELECTED" | awk '{print $1}')
BRANCH=$(echo "$SELECTED" | grep -o '\[.*\]' | tr -d '[]')

echo "Removing worktree: $DIR"
if ! git worktree remove "$DIR" 2>/dev/null; then
  echo "Warning: '$DIR' contains modified or untracked files."
  read -rp "Force remove? [y/N] " answer
  if [[ "$answer" =~ ^[Yy]$ ]]; then
    git worktree remove --force "$DIR"
  else
    echo "Aborted. $DIR is not removed."
    exit 1
  fi
fi

echo "Deleting branch: $BRANCH"
git branch -D "$BRANCH"

echo "Done."
