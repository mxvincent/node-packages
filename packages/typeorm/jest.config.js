/**
 * @type {import('jest').Config}
 */
module.exports = {
	rootDir: 'src',
	testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
	transform: {
		'^.+\\.(t|j)sx?$': '@swc/jest'
	},
	globalSetup: '<rootDir>/@jest/hooks/globalSetup.ts',
	setupFiles: ['dotenv/config', '<rootDir>/@jest/hooks/testSetup.ts'],
	workerIdleMemoryLimit: '1GB'
}
