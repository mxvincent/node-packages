export class TextSequence {
	name: string
	value: number

	constructor(name: string, initialValue: number = -1) {
		this.name = name
		this.value = initialValue
	}

	next(padStart: number = 8) {
		return `${this.name}-${(this.value += 1).toString().padStart(padStart, '0')}`
	}
}
