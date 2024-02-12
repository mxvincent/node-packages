module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'turbo', 'import'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'turbo',
		'plugin:import/typescript'
	],
	rules: {
		'no-console': 2,
		'@typescript-eslint/no-floating-promises': 2,
		'turbo/no-undeclared-env-vars': 0,
		'import/no-relative-packages': 2,
		'import/no-useless-path-segments': 1
	}
}
