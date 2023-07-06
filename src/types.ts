export type InferConstructor<T extends ClassConstructor<any>> = T extends new (...args: any) => infer K ? K : never
export type InferConstructorArgs<T extends ClassConstructor<any>> = T extends new (...args: infer K) => any ? K : never

export type StaticServiceFunction<E = any> = <C extends E>(
	service: ClassConstructor<C>
) => Record<string, (...args: any) => any>

export type InstanceServiceFunction<E = any> = <C extends E>(
	service: ClassConstructor<C>,
	instance: C,
	/** Instance locals */
	locals: AnyRecord
) => Record<string, (...args: any) => any>

type Recurse<O> = Record<string, O> | Readonly<Array<Record<string, O>> | O> | O
type RecursiveObject<O> = Readonly<Array<Recurse<O | Recurse<O | Recurse<O | Recurse<O | Recurse<O>>>>>>>

export type StaticServicesOpts = RecursiveObject<StaticServiceFunction>
export type InstanceServicesOpts = RecursiveObject<InstanceServiceFunction>

export interface Service<E extends ClassConstructor<any> | Class<any>> {
	entity: E extends ClassConstructor<any> ? E : ClassConstructor<E>
	static?: {
		/** accessible through the service */
		locals?: AnyRecord
		services: StaticServicesOpts
	}
	instance?: {
		/** accessible through the instance created by service */
		locals?: (service: AnyRecord, instance: AnyRecord) => AnyRecord
		services: InstanceServicesOpts
	}
}

// * --- Utility --- * //

export type Class<T> = T
export type ClassConstructor<T = any, TArgs extends Array<any> = any> = new (...args: TArgs) => T
type AnyRecord = Record<any, any>
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never
type IntersectArray<U extends Array<any>> = UnionToIntersection<U[number]>
type IntersectFunctionArray<U extends Array<(...args: any) => any>> = UnionToIntersection<Returned<U[number]>>
export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & NonNullable<unknown>

// * --- Handle services --- * //
type HandleServices<S> = S extends Array<any> ? Simplify<HandleArray<S>> : Simplify<Nested<S>>
type Returned<K> = K extends (...args: any) => any ? ReturnType<K> : never
type Nested<K> = {
	[Key in keyof K]:
	K[Key] extends (...args: any) => any ? ReturnType<K[Key]>
	: K[Key] extends Array<any> ? Simplify<HandleArray<K[Key]>> : Simplify<Nested<K[Key]>>
}
type HandleArray<K extends Array<any>> = IntersectFunctionArray<K> & Simplify<Nested<IntersectArray<K>>>

export type ServiceFramework<S extends Service<any>> = ClassConstructor<
	InferConstructor<S['entity']> & Simplify<HandleServices<NonNullable<S['instance']>['services']>>,
	InferConstructorArgs<S['entity']>
	> & Simplify<HandleServices<NonNullable<S['static']>['services']>> & {
		locals: AnyRecord
		getLocals(instance: AnyRecord): AnyRecord
	}
