import { randomFillSync } from 'crypto'

export const base64UrlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
export const base62UrlAlphabet = 'useandom26T198340PX75pxJACKVERYMINDBUSHWOLFGQZbfghjklqvwyzrict'

const POOL_SIZE_MULTIPLIER = 128

let pool: Buffer
let poolOffset: number

const fillPool = (bytes: number) => {
	if (!pool || pool.length < bytes) {
		pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER)
		randomFillSync(pool)
		poolOffset = 0
	} else if (poolOffset + bytes > pool.length) {
		randomFillSync(pool)
		poolOffset = 0
	}
	poolOffset += bytes
}

export const random = (bytes: number) => {
	fillPool((bytes -= 0))
	return pool.subarray(poolOffset - bytes, poolOffset)
}

export const customRandom = (alphabet: string, defaultSize: number, getRandom = random) => {
	const mask = (2 << (31 - Math.clz32((alphabet.length - 1) | 1))) - 1
	const step = Math.ceil((1.6 * mask * defaultSize) / alphabet.length)
	return (size = defaultSize) => {
		let id = ''
		while (true) {
			const bytes = getRandom(step)
			let i = step
			while (i--) {
				id += alphabet[bytes[i] & mask] || ''
				if (id.length === size) return id
			}
		}
	}
}

export const randomString = (alphabet: string, size = 21) => customRandom(alphabet, size, random)

export const randomBase64String = (size = 21) => {
	fillPool((size -= 0))
	let id = ''
	for (let i = poolOffset - size; i < poolOffset; i++) {
		id += base64UrlAlphabet[pool[i] & 63]
	}
	return id
}
