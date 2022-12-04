const fs = require('node:fs')

const applications = fs
	.readdirSync(`${__dirname}/applications`, { withFileTypes: true })
	.filter((dirent) => dirent.isDirectory())
	.map((dirent) => dirent.name)

const packages = fs
	.readdirSync(`${__dirname}/packages`, { withFileTypes: true })
	.filter((dirent) => dirent.isDirectory())
	.map((dirent) => dirent.name)

const tools = fs
	.readdirSync(`${__dirname}/tools`, { withFileTypes: true })
	.filter((dirent) => dirent.isDirectory())
	.map((dirent) => dirent.name)

module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'body-max-line-length': [1, 'always', 100],
		'footer-max-line-length': [1, 'always', 100],
		'scope-enum': [2, 'always', [...applications, ...packages, ...tools]],
		'scope-empty': [1, 'never']
	}
}

