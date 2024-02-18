module.exports = {
	plugins: ['@typescript-eslint', 'turbo', 'import', 'unused-imports'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'turbo',
		'plugin:import/typescript'
	],
	rules: {
		'no-console': 'error',
		'@typescript-eslint/no-floating-promises': 'error',
		'turbo/no-undeclared-env-vars': 'warn',
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
