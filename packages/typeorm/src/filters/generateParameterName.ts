import { Alphabet, randomString } from '@mxvincent/utils'

export const generateParameterName = randomString(Alphabet.base62, 8)
