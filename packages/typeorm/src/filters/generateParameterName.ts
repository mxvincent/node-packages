import { Alphabet, randomString } from '@mxvincent/core'

export const generateParameterName = randomString(Alphabet.BASE_62, 8)
