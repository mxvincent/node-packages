#!/usr/bin/env bash

# Set repository root as working directory
working_directory=$0
while [ "$ROOT_DIRECTORY" != '/' ] && [ ! -f "$working_directory/pnpm-workspace.yaml" ]
do
  working_directory=$(dirname "$working_directory")
done
cd "$working_directory" || exit

for directory in "applications" "packages" "packages/private"
do
  packages=$(find "$working_directory/$directory" -name package.json)
  for package_json in $packages
  do
    package_root=$(dirname "$package_json")
    rm "$package_root/CHANGELOG.md"
    cat <<< "$(jq '.version="0.0.0"' "$package_json")" > "$package_json"
  done
done

# delete all local tags
git tag | xargs git tag -d

