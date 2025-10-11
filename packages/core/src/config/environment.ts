type GetEnvValueOptions<T> =
	| { default?: T; transform?: (value: string) => T }
	| { required?: boolean; transform?: (value: string) => T }

export class EnvValue {
	static boolean(name: string, options?: GetEnvValueOptions<boolean>): boolean | undefined {
		const value = this.string(name)
		if (value) {
			return options?.transform ? options.transform(value) : value === 'true' || value === '1'
		}
		if (options && 'default' in options) {
			return options.default
		}
		return undefined
	}

	static number(name: string, options?: GetEnvValueOptions<number>): number | undefined {
		const value = this.string(name)
		if (value) {
			return options?.transform ? options.transform(value) : Number(value)
		}
		if (options && 'default' in options) {
			return options.default
		}
		return undefined
	}

	static string(name: string, options?: GetEnvValueOptions<string>): string | undefined {
		const value = process.env[name]
		if (options && 'required' in options && options.required && value !== undefined) {
			throw new Error(`Environment variable is missing: ${name}`)
		}
		if (value) {
			return options?.transform ? options.transform(value) : value
		}
		if (options && 'default' in options) {
			return options.default
		}
		return undefined
	}
}
