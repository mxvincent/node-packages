export function createMemoizedFactory<TConfig extends WeakKey, TInstance>(
	constructor: new (config: TConfig) => TInstance
) {
	const instances = new WeakMap<TConfig, TInstance>()

	return function factory(config: TConfig): TInstance {
		return (
			instances.get(config) ??
			(() => {
				const instance = new constructor(config)
				instances.set(config, instance)
				return instance
			})()
		)
	}
}
