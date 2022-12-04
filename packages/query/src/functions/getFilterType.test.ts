import { comparisonOperators } from '../types/ComparisonOperator'
import { logicalOperators } from '../types/LogicalOperator'
import { getFilterType } from './getFilterType'


test.each(logicalOperators)('should return logical for %s operator', async (operator) => {
  expect(getFilterType(operator)).toBe('logical')
})

test.each(comparisonOperators)('should return logical for %s operator', async (operator) => {
  expect(getFilterType(operator)).toBe('comparison')
})


test('should throw `TypeError`', () => {
  expect(() => getFilterType('not-an-operator')).toThrowError(TypeError('Given operator is not valid (not-an-operator).'))
})


