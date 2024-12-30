module.exports = {
	plugins: ['@typescript-eslint', 'import', 'unused-imports'],
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier', 'plugin:import/typescript'],
	rules: {
		'no-console': 'error',
		'@typescript-eslint/no-floating-promises': 'error',
		'import/no-relative-packages': 'error',
		'import/no-useless-path-segments': 'warn',
		'import/no-deprecated': 'error',
		'no-unused-vars': 'off',
		'unused-imports/no-unused-imports': 'error',
		'unused-imports/no-unused-vars': [
			'warn',
			{
				vars: 'all',
				varsIgnorePattern: '^_',
				args: 'after-used',
				argsIgnorePattern: '^_'
			}
		],
		'sort-imports': [
			'error',
			{
				ignoreCase: true,
				ignoreDeclarationSort: true
			}
		]
	}
}
