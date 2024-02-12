#!/usr/bin/env bash

# Set repository root as working directory
working_directory=$0
while [ "$ROOT_DIRECTORY" != '/' ] && [ ! -f "$working_directory/pnpm-workspace.yaml" ]
do
  working_directory=$(dirname "$working_directory")
done
cd "$working_directory" || exit

find . -path 'packages/*/.turbo' -type d -prune -exec rm -rf '{}' +
find . -path 'packages/*/dist' -type d -prune -exec rm -rf '{}' +
find . -name 'packages/*/*.tsbuildinfo' -prune -exec rm -rf '{}' +
