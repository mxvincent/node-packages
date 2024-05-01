import type { ComponentContext } from '@components/component-context'
import type { ApplicationContext } from '@libs/application-context'

export type Context = ApplicationContext | ComponentContext

/**
 * Function taking context as parameter to return a value
 */
export type Provider<T> = (context: Context) => T
