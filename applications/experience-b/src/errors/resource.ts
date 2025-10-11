export class ResourceNotFoundError {
	readonly type: string
	readonly uid: string[]

	constructor(type: string, uid: string | string[]) {
		this.type = type
		this.uid = typeof uid === 'string' ? [uid] : uid
	}

	toString() {
		return `Resource not found: ${this.type}:${this.uid.join(',')}`
	}

	toJSON() {
		return {
			message: 'Resource not found',
			resource: {
				type: this.type,
				uid: this.uid.join(',')
			}
		}
	}
}
