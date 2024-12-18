/**
 * @type {import('jest').Config}
 */
module.exports = {
	// setupFiles: ['<rootDir>/src/tests/setup.ts'],
	testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
	transform: {
		'^.+\\.tsx?$': ['@swc/jest', { configFile: '.swcrc' }]
	}
}
