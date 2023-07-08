import {
	describe,
	it,
	expect
} from 'vitest'
import { mergeDeep } from './merge-deep'

describe('utils/merge-deep', () => {
	it('should merge objects', () => {
		const o1 = {
			a: 1,
			b: 1,
			c: {
				d: 1,
				e: 1,
				f: {
					g: 1,
					h: 1
				}
			}
		}
		const o2 = {
			b: 2,
			c: {
				d: 2,
				e: 2
			}
		}
		const o3 = {
			a: 3,
			c: {
				f: {
					g: 3
				}
			}
		}

		const result = {
			a: 3,
			b: 2,
			c: {
				d: 2,
				e: 2,
				f: {
					g: 3,
					h: 1
				}
			}
		}
		expect(mergeDeep(o1, undefined, o2, undefined, o3)).toEqual(result)
	})
})