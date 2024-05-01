export const applications = ['demo-graphql'] as const

export type Application = (typeof applications)[number]
