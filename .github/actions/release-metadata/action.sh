#!/usr/bin/env bash

###
# Check if repository contains unreleased changesets
###
changeset_count=$(find "$CHANGESET_PATH" -iname "*.md" -type f | wc -l)
has_readme=$(find "$CHANGESET_PATH" -iname "readme.md" -type f | wc -l)

if [ "$has_readme" -ne 0 ]
then
  changeset_count=$((changeset_count - 1))
fi

if [ "$changeset_count" -gt 0 ]
then
  echo "has-changesets=true" >> $GITHUB_OUTPUT
else
  echo "has-changesets=false" >> $GITHUB_OUTPUT
fi


###
# Check if repository is in prerelease mode
###
if [ -f "$CHANGESET_PATH/pre.json" ]
then
  echo "is-pre-release=true" >> $GITHUB_OUTPUT
  changeset_pre_tag=$(awk -F'"' '/"tag": ".+"/{ print $4; exit; }' "$CHANGESET_PATH/pre.json")
  echo "pre-release-tag=$changeset_pre_tag"
else
  echo "is-pre-release=false" >> $GITHUB_OUTPUT
fi


###
# Generate release commit title
###
echo "release-commit-title=chore(release): $(date -u +'%Y-%m-%d %H:%M:%S UTC') 🚚" >> $GITHUB_OUTPUT
