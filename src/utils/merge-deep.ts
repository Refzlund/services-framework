// Credit: https://stackoverflow.com/a/34749873

import { AnyRecord } from '../types'

export function isObject(item: AnyRecord) {
	return (item && typeof item === 'object' && !Array.isArray(item))
}

/**
 * Deep merge two objects.
*/
export function mergeDeep(target: AnyRecord, ...sources: (AnyRecord | undefined)[]) {
	if (!sources || sources.length <= 0)
		return target
	
	let source = sources.shift()
	while (source === undefined) {

		if (sources.length <= 0)
			return target
		source = sources.shift()

	}

	if (isObject(target) && isObject(source)) {
		for (const key in source) {

			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} })
				mergeDeep(target[key], source[key])
			}
			else {
				Object.assign(target, { [key]: source[key] })
			}

		}
	}

	return mergeDeep(target, ...sources)
}