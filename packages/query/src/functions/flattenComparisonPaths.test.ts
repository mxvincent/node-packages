import { Equal, Or } from '../filters'
import { flattenComparisonPaths } from './flattenComparisonPaths'

test('should return comparison paths', async () => {
  expect(flattenComparisonPaths([Or(Equal('a','a'), Equal('b', 'b'))])).toEqual(['a', 'b'])
})

test('should remove duplicated values', async () => {
  expect(flattenComparisonPaths([Or(Equal('a','a'), Equal('a', 'a'))])).toEqual(['a'])
})
