import type { ConstructorArgs, Service, ServiceFramework } from './types'

function addServices(entity: Record<any, any>, setObject: Record<any, any>, obj?: Record<any, any>, instance?: Record<any,any>) {
	if (!obj)
		return
	
	for (const key in obj) {
		if (typeof obj[key] !== 'function' && typeof obj[key] === 'object') {
			setObject[key] = {}
			return addServices(entity, setObject[key], obj[key], instance)
		}

		const fn = instance ?
			function fn(...args: any[]) {
				return obj?.[key](entity, instance)(...args)
			}
			:
			function fn(...args: any[]) {
				return obj?.[key](entity)(...args)
			}
		
		Object.defineProperty(fn, 'name', { value: key })
		setObject[key] = fn
	}
}

export function createServiceFramework<const S extends Service<any>>(
	services: S
) {
	const Framework = class extends (<any>services.entity) {
		constructor(...args: ConstructorArgs<S['entity']>) {
			super(...args)
			addServices(Framework, this, services.instanceServices, this)
		}
	} as any as ServiceFramework<S>

	Object.defineProperty(Framework, 'name', { value: services.entity.name })
	addServices(Framework, Framework, services.staticServices)

	return Framework
}
