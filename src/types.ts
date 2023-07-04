import * as T from 'utility-types'


export type StaticServiceFunction<E extends Constructable<any>> = (entity: E) => (...args: any) => any
export type InstanceServiceFunction<E extends Constructable<any>> = (entity: E, instance: Partial<ConstructorReturn<E>>) => (...args: any) => any


type RecursiveObject<O> = Record<string, O | Record<string, O | Record<string, O | Record<string, O>>>>

export type Service<E extends Constructable<any>> = {
	entity: E
	staticServices?: RecursiveObject<StaticServiceFunction<E>>
	instanceServices?: RecursiveObject<InstanceServiceFunction<E>>
}

export type ConstructorArgs<T extends T.Class<any>> = T extends new (...args: infer K) => any ? K : never
export type ConstructorReturn<T extends T.Class<any>> = T extends new (...args: any) => infer K ? K : never

export interface Constructable<T, Args extends T.Class<T> = T.Class<T>> {
	new(...args: ConstructorArgs<Args>): T
}

type InstanceServices<S extends Service<any>, O extends RecursiveObject<InstanceServiceFunction<S['entity']>> | undefined> = {
	[Key in keyof O]: O[Key] extends InstanceServiceFunction<S['entity']> ?
		ReturnType<O[Key]> : InstanceServices<S, O[Key]>
}

type StaticServices<S extends Service<any>, O extends RecursiveObject<StaticServiceFunction<S['entity']>> | undefined> = {
	[Key in keyof O]: O[Key] extends StaticServiceFunction<S['entity']> ? 
		ReturnType<O[Key]> : StaticServices<S, O[Key]>
}



export type ServiceFramework<S extends Service<any>> = Constructable<
	ConstructorReturn<S['entity']> & InstanceServices<S, S['instanceServices']>,
	S['entity']
> & StaticServices<S, S['staticServices']>