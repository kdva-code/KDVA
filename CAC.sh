
#!/usr/bin/env bash
set -euo pipefail

# Repository identity
git config user.name "kdva-code"
git config user.email "kdva.code@gmail.com"

# Commit date range
START_DATE="2026-09-26"
END_DATE="2026-11-26"

# Verify repository and branch
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "ERROR: Git repository not found."
    exit 1
fi

BRANCH=$(git branch --show-current)

if [[ -z "$BRANCH" ]]; then
    echo "ERROR: No active branch found."
    exit 1
fi

echo "Repository: $(git remote get-url origin)"
echo "Branch: $BRANCH"
echo "Creating daily commits..."

current="$START_DATE"

while [[ "$current" < "$END_DATE" || "$current" == "$END_DATE" ]]; do
    export GIT_AUTHOR_DATE="${current}T12:00:00+00:00"
    export GIT_COMMITTER_DATE="${current}T12:00:00+00:00"

    git commit --allow-empty \
        -m "chore: daily history test ($current)"

    current=$(date -I -d "$current + 1 day")
done

unset GIT_AUTHOR_DATE GIT_COMMITTER_DATE

echo "Pushing commits to GitHub..."
git push origin "HEAD:$BRANCH"

echo "SUCCESS: All 62 daily commits pushed!"
