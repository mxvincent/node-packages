###
# Release packages
###

# Create git tags
pnpm exec changeset tag
git push --tags

# Publish packages to npm registry
echo "//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN" >> ~/.npmrc
echo pnpm publish
