import { SortDirection } from './SortDirection'

export type Sort<Path = string> = {
	path: Path
	direction: SortDirection
}
