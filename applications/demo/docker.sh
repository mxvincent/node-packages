#!/usr/bin/env bash

# login github container registry
echo $GHCR_TOKEN | docker login https://ghcr.io -u mxvincent --password-stdin

# use repository root as working directory
APP_DIR=$(realpath "$(dirname "$0")")
ROOT_DIR=$(dirname "$(dirname "$APP_DIR")")
cd "$ROOT_DIR" || exit 1
echo "ROOT_DIR: $ROOT_DIR"
echo "APP_DIR: $APP_DIR"

# Get application name from package.json
APP_NAME=$(awk -F'"' '/"name": ".+"/{ print $4; exit; }' "$APP_DIR/package.json")
echo "Application: ${APP_NAME}"

# Get application version from package.json
APP_VERSION=$(awk -F'"' '/"version": ".+"/{ print $4; exit; }' "$APP_DIR/package.json")
APP_VERSION_MAJOR="${APP_VERSION%%\.*}"
APP_VERSION_MINOR="${APP_VERSION#*.}"
APP_VERSION_MINOR="${APP_VERSION_MINOR%.*}"
APP_VERSION_PATCH="${APP_VERSION##*.}"
echo "Version: ${APP_VERSION}"
echo "Version [major]: ${APP_VERSION_MAJOR}"
echo "Version [minor]: ${APP_VERSION_MINOR}"
echo "Version [patch]: ${APP_VERSION_PATCH}"

# Build and push image
# --platform linux/amd64,linux/arm64 \
IMAGE="ghcr.io/mxvincent/$APP_NAME"
echo "Build docker image $IMAGE@$APP_VERSION"
docker buildx build . -f "$APP_DIR/dockerfile" \
  --push \
  --platform linux/arm64 \
  --tag "$IMAGE:$APP_VERSION_MAJOR.$APP_VERSION_MINOR.$APP_VERSION_PATCH" \
  --tag "$IMAGE:$APP_VERSION_MAJOR.$APP_VERSION_MINOR" \
  --tag "$IMAGE:$APP_VERSION_MAJOR" \
  --tag "$IMAGE:latest"
