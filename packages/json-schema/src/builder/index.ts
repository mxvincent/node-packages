import { JsonTypeBuilder } from '@sinclair/typebox'
import { DateTime, UUID } from './formats'
import { Nullable, StringEnum } from './unsafe'

class SchemaBuilder extends JsonTypeBuilder {
	Nullable = Nullable
	StringEnum = StringEnum
	DateTime = DateTime
	UUID = UUID
}

export const Schema = new SchemaBuilder()
