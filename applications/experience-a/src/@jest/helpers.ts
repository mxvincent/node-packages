// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSpyResult = (spy: jest.SpyInstance, index = 0): any => spy.mock.results[index]?.value
