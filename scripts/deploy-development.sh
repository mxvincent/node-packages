#!/usr/bin/env bash

# Delete previous remote tags
git push --delete --no-verify origin deploy/development

# Create and push new tags
git tag --force deploy/development
git push --no-verify origin deploy/development