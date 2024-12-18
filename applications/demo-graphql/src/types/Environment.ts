import { includes } from 'ramda'

export enum Environment {
	development = 'development',
	production = 'production',
	staging = 'staging',
	test = 'test'
}

export const isProductionGradeEnvironment = (environment: Environment): boolean => {
	return includes(environment, ['production'])
}

export const isDevelopmentGradeEnvironment = (environment: Environment): boolean => {
	return !isProductionGradeEnvironment(environment)
}
