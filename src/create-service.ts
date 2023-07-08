import type {
	Service,
	ServiceFramework,
	StaticServicesOpts,
	InstanceServicesOpts
} from './types'
import { mergeDeep } from './utils/merge-deep'


function handleObject(
	framework: ServiceFramework<any>,
	obj: StaticServicesOpts | InstanceServicesOpts,
	nested: Record<any, any>,
	instance?: Record<any, any>,
	locals?: Record<any, any>
) {
	for (const key in obj) {
		const service = obj[key]

		if (key in nested)
			throw new Error(`Service ${key} already exists`)

		if (typeof service === 'function') {
			const fn = !!instance ?
				service(framework, instance, locals as Record<any, any>) : (<any>service)(framework)
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
	instance?: Record<any, any>,
	locals?: Record<any, any>
) {
	if (!arr || !Array.isArray(arr) || !nested)
		return
	
	for (const service of arr || []) {
		if (typeof service === 'function') {
			const fn =
				!!instance ? service(framework, instance, locals) : (<any>service)(framework)
			for (const key in fn) {
				if (key in nested)
					throw new Error(`Service ${key} already exists`)
				nested[key] = fn[key]
			}
		}
		else if (Array.isArray(service)) {
			handleArray(framework, service, nested, instance, locals)
		}
		else if (typeof service === 'object') {
			handleObject(framework, service as typeof arr, nested, instance, locals)
		}
	}
}

export function createServiceFramework<const S extends Service<any>>(
	services: S
) {
	const localsMap = new WeakMap()
	const Framework = class extends (<any>services.entity) {
		constructor(...args: any) {
			super(...args)

			// TODO: Make into proxy https://github.com/Refzlund/services-framework/issues/11

			const locals = mergeDeep(
				services.instance?.locals?.(Framework, this) || {},
				...services.collections?.map(v => v.instance?.locals?.(Framework, this)) || []
			)

			handleArray(Framework as any, services.instance?.services, this, this, locals)
			services.collections?.forEach(v =>
				handleArray(Framework as any, v.instance?.services, this, this, locals)
			)
			
			localsMap.set(this, locals)
		}
	} as any as ServiceFramework<S>
	
	Framework.getLocals = instance => localsMap.get(instance)
	Framework.locals = mergeDeep(
		services.static?.locals || {},
		...services.collections?.map(v => v.static?.locals) || []
	)
	
	handleArray(Framework as any, services.static?.services, Framework)
	for (const collection of services.collections || [])
		handleArray(Framework as any, collection.static?.services, Framework)
	
	Object.defineProperty(Framework, 'name', { value: services.entity.name })

	return Framework
}
