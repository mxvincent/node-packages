/**
 * @type {import('jest').Config}
 */
module.exports = {
	rootDir: 'src',
	testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
	transform: {
		'^.+\\.(t|j)sx?$': '@swc/jest'
	},
	workerIdleMemoryLimit: '512MB',
	globalSetup: '<rootDir>/@jest/setup.ts',
}
