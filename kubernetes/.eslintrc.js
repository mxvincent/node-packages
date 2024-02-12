module.exports = {
	root: true,
	parserOptions: { project: './tsconfig.json', tsconfigRootDir: __dirname },
	extends: ['@mxvincent/eslint-config'],
	ignorePatterns: ['.eslintrc.js', 'src/imports/**']
}
