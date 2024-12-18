module.exports = {
	root: true,
	parserOptions: { project: './tsconfig.json', tsconfigRootDir: __dirname },
	extends: ['@mxvincent/eslint-config'],
	rules: {
		'import/no-relative-packages': 2,
		'import/no-relative-parent-imports': 1
	}
}
