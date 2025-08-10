###
# Prepare next release
###

# Set repository root as working directory
working_directory=$0
while [ "$ROOT_DIRECTORY" != '/' ] && [ ! -f "$working_directory/pnpm-workspace.yaml" ]
do
  working_directory=$(dirname "$working_directory")
done
cd "$working_directory" || exit


# Bump updated packages and generate changelogs
pnpm exec changeset version

# Regenerate lockfile
pnpm install --lockfile-only

# Generate deployment manifests
pnpm run --filter kubernetes generate-manifests

# Stage changes
git add .
