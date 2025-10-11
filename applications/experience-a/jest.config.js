/**
 * @type {import('jest').Config}
 */
module.exports = {
	rootDir: 'src',
	testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
	transform: {
		'^.+\\.(t|j)sx?$': '@swc/jest'
	},
	moduleNameMapper: {
		'@app/(.*)': '<rootDir>/src/$1',
		'@database/(.*)': '<rootDir>/src/database/$1',
		'@module/(.*)': '<rootDir>/src/modules/$1'
	},
	workerIdleMemoryLimit: '1GB',
	globalSetup: '<rootDir>/@jest/setup.ts',
	verbose: true,
	testEnvironment: 'node',
	coveragePathIgnorePatterns: ['index.ts', '/node_modules/', '/database/migrations', '/database/helpers']
}
