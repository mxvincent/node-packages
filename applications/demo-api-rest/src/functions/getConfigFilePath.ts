export const getConfigFilePath = (): string => {
	if (process.env['CONFIG_FILE_PATH']) {
		return process.env['CONFIG_FILE_PATH']
	}
	if (process.env['NODE_ENV'] === 'test') {
		return 'config.test.json'
	}
	return 'config.json'
}
