module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [
			2,
			'always',
			['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test', 'deploy']
		],
		'body-max-line-length': [1, 'always', 100],
		'footer-max-line-length': [1, 'always', 100]
	}
}
