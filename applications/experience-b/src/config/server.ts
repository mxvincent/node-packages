import { Type } from '@mxvincent/json-schema'

export const schema = Type.Object({
	keepAliveTimeoutInMilliseconds: Type.Integer({
		description: 'TCP connection keepalive timout. This value should be greater than proxy keepalive timeout.',
		default: 5000,
		minimum: 5000,
		maximum: 3600000
	}),
	host: Type.String({
		description: 'Server listening hostname.',
		default: '127.0.0.1'
	}),
	port: Type.Integer({
		description: 'Server listening port.',
		default: 4000,
		minimum: 1024,
		maximum: 65535
	})
})

export const environment = {
	keepAliveTimeoutInMilliseconds: 'SERVER_KEEP_ALIVE_TIMEOUT',
	host: 'SERVER_HOST',
	port: 'SERVER_PORT'
}