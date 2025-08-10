# What's inside?

This repository contains libraries that I work on in my spare time.
The purpose of these tools is to provide elegant and reusable solutions to problems that we encounter day-to-day when developing web services.

## Packages

- [query](https://github.com/mxvincent/node-packages/tree/main/packages/query): filter, sort and paginate your data

## Repository structure

- applications: applications
- components: internal packages
- packages: published packages
- scripts: repository task automation
- templates: base to create a new application / packages
- kubernetes: deployment manifests

# How this repository is working?

- [pnpm](https://pnpm.io/) efficient package manager
- [typescript](https://www.typescriptlang.org/) static type checking
- [swc](https://swc.rs/) fast typescript compiler / bundler
- [changesets](https://github.com/changesets/changesets) version and changelog management
- [turborepo](https://turborepo.org/) high-performance build system
- [eslint](https://eslint.org/) code linting
- [prettier](https://prettier.io) for code formatting

### Requirements

- pnpm >=8.2.0
- node >=18.14

### Commands

- `build`: build all packages
- `clean`: clean previous build output
- `changeset`: generate a changeset
- `release`: consume changesets to bump versions and generate changelogs
- `publish-packages`: publish packages
