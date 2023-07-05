import type { Service, ServiceFramework, StaticServicesOpts, InstanceServicesOpts } from './types'


function handleObject(
	framework: ServiceFramework<any>,
	obj: StaticServicesOpts | InstanceServicesOpts,
	nested: Record<any, any>,
	instance?: Record<any, any>
) {
	for (const key in obj) {
		const service = obj[key]

		if (key in nested)
			throw new Error(`Service ${key} already exists`)

		if (typeof service === 'function') {
			const fn = !!instance ? service(framework, instance) : (<any>service)(framework)
			for (const key in fn) {
				if (key in nested)
					throw new Error(`Service ${key} already exists`)
				nested[key] = fn[key]
			}
		}
		else if (Array.isArray(service)) {
			nested[key] = {}
			handleArray(framework, service, nested[key], instance)
		}
		else if (typeof service === 'object') {
			nested[key] = {}
			handleObject(framework, service as typeof obj, nested[key], instance)
		}
	}
}

function handleArray(
	framework: ServiceFramework<any>,
	arr?: StaticServicesOpts | InstanceServicesOpts,
	nested?: Record<any, any>, 
	instance?: Record<any, any>
) {
	if (!arr || !Array.isArray(arr) || !nested)
		return
	
	for (const service of arr || []) {
		if (typeof service === 'function') {
			const fn = !!instance ? service(framework, instance) : (<any>service)(framework)
			for (const key in fn) {
				if (key in nested)
					throw new Error(`Service ${key} already exists`)
				nested[key] = fn[key]
			}
		}
		else if (Array.isArray(service)) {
			handleArray(framework, service, nested, instance)
		}
		else if (typeof service === 'object') {
			handleObject(framework, service as typeof arr, nested, instance)
		}
	}
}

export function createServiceFramework<const S extends Service<any>>(
	services: S
) {
	const Framework = class extends (<any>services.entity) {
		constructor(...args: any) {
			super(...args)
			handleArray(Framework as any, services.instanceServices, this, this)
		}
	} as any as ServiceFramework<S>

	handleArray(Framework as any, services.staticServices, Framework)
	Object.defineProperty(Framework, 'name', { value: services.entity.name })

	return Framework
}
