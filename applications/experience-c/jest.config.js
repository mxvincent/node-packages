/**
 * @type {import('jest').Config}
 */
module.exports = {
	rootDir: 'src',
	testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
	transform: {
		'^.+\\.(t|j)sx?$': '@swc/jest'
	},
	globalSetup: '<rootDir>/@jest/setup.ts',
	workerIdleMemoryLimit: '1GB',
	cache: false,
	verbose: true,
	testEnvironment: 'node',
	coveragePathIgnorePatterns: ['index.ts', '/node_modules/', '/database/migrations', '/database/helpers']
}
