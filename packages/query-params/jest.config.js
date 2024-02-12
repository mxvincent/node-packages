/* eslint-disable no-undef */

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
	// setupFiles: ['<rootDir>/src/tests/setup.ts'],
	testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
	transform: {
		'^.+\\.tsx?$': ['@swc/jest', { configFile: '.swcrc' }]
	},
	verbose: true
}
