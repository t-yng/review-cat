#!/bin/sh

# 保護ブランチへ直接プッシュすることを禁止する

current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')
protected_branch='main'
policy="\033[31m[Policy] Never push code directly to the "$protected_branch" branch! (Prevented with pre-push hook.)\033[m\n"

exit_fail() {
  echo $policy
  exit 1
}

if [ $current_branch = $protected_branch ]; then
  exit_fail
fi
