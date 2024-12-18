import { Type, Value } from '@mxvincent/json-schema'

export const ServerConfigSchema = Type.Object({
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

export const AuthConfigSchema = Type.Object({
	audience: Type.String({
		description: 'JWT audience',
		default: 'https://sandbox.lab.ovh'
	}),
	issuerBaseURL: Type.String({
		description: 'JWT issuer',
		default: 'https://mxlab.eu.auth0.com/'
	}),
	tokenSigningAlg: Type.String({
		description: 'Algorithm used to sign the token',
		default: 'RS256'
	})
})

export const config = {
	auth: Value.Parse(AuthConfigSchema, Value.Default(AuthConfigSchema, {})),
	server: Value.Parse(ServerConfigSchema, Value.Default(ServerConfigSchema, {}))
}
