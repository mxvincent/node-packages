import { base62UrlAlphabet, randomString } from '@mxvincent/crypto'

export const generateParameterName = randomString(base62UrlAlphabet, 8)
