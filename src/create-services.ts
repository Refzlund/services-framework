import { createServiceFramework } from './create-service'
import { Service, ServiceFramework } from './types'

export function createServicesFramework<const S extends Record<string, Service<any>>>(
	services: S
) {
	const result = {} as any
	for (const key in services) {
		result[key] = createServiceFramework(services[key])
	}
	return result as { [Key in keyof S]: ServiceFramework<S[Key]> }
}