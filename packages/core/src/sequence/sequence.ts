export class Sequence {
	value: number

	constructor(initialValue: number = -1) {
		this.value = initialValue
	}

	next() {
		return (this.value += 1)
	}
}
