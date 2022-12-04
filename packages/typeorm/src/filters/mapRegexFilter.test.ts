import { CaseInsensitiveMatch, Match, Regex } from '@mxvincent/query'
import { mapRegexFilter } from './mapRegexFilter'

describe('map regex filter', () => {
	test('Regex to Match', async () => {
		expect(mapRegexFilter(Regex('a.path', '/[/d]{3}/g'))).toEqual(Match('a.path', '[/d]{3}'))
	})

	test('Regex to CaseInsensitiveMatch', async () => {
		expect(mapRegexFilter(Regex('a.path', '/[/d]{3}/gi'))).toEqual(CaseInsensitiveMatch('a.path', '[/d]{3}'))
	})
})
