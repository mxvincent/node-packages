export const iso8601Matcher = expect.stringMatching(
	/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?((\+\d{2}:\d{2})|Z)?$/
)

export const uuidMatcher = expect.stringMatching(
	/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
)
