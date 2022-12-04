export type EnvironmentVariableMapping = {
	[key: string]: string | EnvironmentVariableMapping
}

export const getConfigFromEnvironment = (
	mapping: EnvironmentVariableMapping
): EnvironmentVariableMapping => {
	return Object.entries(mapping)
		.map(([k, v]) =>
			typeof v === 'string' ? [k, process.env[v]] : [k, getConfigFromEnvironment(v)]
		)
		.reduce((o, [k, v]) => (v ? Object.assign(o, { [k as string]: v }) : o), {})
}
