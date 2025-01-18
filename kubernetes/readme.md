# Kubernetes manifests deployment

## Generate and push deployment manifests

```shell
git pull origin
pnpm run generate-manifests
git add .
git commit -m "deploy: $(date -u +'%Y-%m-%dT%H:%M:%SZ') [skip ci]" --no-verify
git push --no-verify
```

## Deploy `staging` environment

```shell
# Sync local tags
git pull origin --tags --force
# Delete previous remote tags
git push --delete origin deploy/staging --no-verify
# Create deployment tags
git tag --force deploy/staging
# Push local changes
git push origin deploy/staging --no-verify
```

## Deploy `production` environment

```shell
# Sync local tags
git pull origin --tags --force
# Delete previous remote tags
git push --delete origin deploy/production --no-verify
# Create deployment tags
git tag --force deploy/production
# Push local changes
git push origin deploy/production --no-verify
```
