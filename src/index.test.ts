import { describe, it, beforeAll, expect } from 'vitest'
import { ClassConstructor, Collection, InstanceServiceFunction, Service, StaticServiceFunction, createServicesFramework } from '.'


class User {
	name: string
	age: number

	constructor(content: User) {
		Object.assign(this, content)
	}
}

function createFramework() {
	// * --- Seperate files --- *
	const nameToUpper = (<T extends { name: string }>(service: ClassConstructor<T>, instance: T) => ({
		
		nameToUpper(newName?: string) {
			instance.name = (newName || instance.name).toUpperCase()
		}
		
	})) satisfies InstanceServiceFunction

	const getName = (<T>(service: ClassConstructor<T>, instance) => ({
		
		getName() {
			return instance.name
		}

	})) satisfies InstanceServiceFunction

	const getLocal = (<T>(service: ClassConstructor<T>, instance, locals) => ({

		getLocal() {
			return locals
		}

	})) satisfies InstanceServiceFunction

	const getInstance = (<T>(service: ClassConstructor<T>, instance: T) => ({
		
		getInstance() {
			return instance
		}

	})) satisfies InstanceServiceFunction

	const registerUser = (<T>(service: ClassConstructor<T>) => ({
		
		registerUser(content) {
			return { test: content }
		}

	})) satisfies StaticServiceFunction

	const returnFunctionInput = (<T>(service: ClassConstructor<T>) => ({

		returnFunctionInput(content) {
			return content
		}

	})) satisfies StaticServiceFunction

	// * ---------------------- *

	const collection = <T>() => ({

		instance: {
			locals: () => ({
				test: 'Testing instance locals'
			}),
			services: [
				returnFunctionInput<T>
			]
		},
		static: {
			locals: {
				test: 'Testing static locals'
			},
			services: [
				returnFunctionInput<T>
			]
		}

	} satisfies Collection<T>)



	const userService = {
		entity: User,
		static: {
			locals: {
				collection: 'users'
			},
			services: [
				registerUser<User>,
				{
					nested: {
						deep: [
							registerUser<User>
						]
					}
				}
			]
		},
		instance: {
			locals: (service, instance) => ({ service, instance, now: (Date.now() / 1000).toFixed(0) }),
			services: [
				getName<User>,
				getInstance<User>,
				nameToUpper<User>,
				getLocal<User>,
				{
					nested: {
						deep: [
							getName<User>,
						]
					}
				}
			]
		},
		collections: [
			collection<User>()
		]
	} satisfies Service<User>

	return createServicesFramework({
		User: userService,
		Test: {
			entity: User
		}
	})
}

describe('service-framework', () => {
	let framework: ReturnType<typeof createFramework>

	
	
	beforeAll(() => {
		framework = createFramework()
	})

	it('should have a static method (service) that can return its input', () => {

		const user = new framework.User({ name: 'Carl', age: 13 })
		const returnedValue = framework.User.registerUser(user)

		expect(returnedValue).to.deep.equal({ test: user })
	})

	it('should have an instance method (service) that can change the contents of the instance', () => {
		const user = new framework.User({ name: 'Carl', age: 13 })

		expect(user.name).to.equal('Carl')
		user.nameToUpper()
		expect(user.name).to.equal('CARL')
	})

	it('should have an instance method (service) which can return the instance itself', () => {
		const user = new framework.User({ name: 'Carl', age: 13 })

		expect(user.getInstance()).to.deep.equal(user)
	})

	it('should hold a reference to the entity, and always give updated content for entity instance service function', () => {
		const user = new framework.User({ name: 'John', age: 13 })
		
		expect(user.getName()).to.be.string('John')
		user.nameToUpper()
		expect(user.getName()).to.be.string('JOHN')
	})

	it('should be able to call deeply nested functions', () => {
		framework.User.nested.deep.registerUser({})
		const user = new framework.User({ name: 'John', age: 13 })
		user.nested.deep.getName()
	})

	it('should have created and have access to locals & collections-defined locals', () => {
		const now = (Date.now() / 1000).toFixed(0)
		const user = new framework.User({ name: 'John', age: 13 })
		const locals = user.getLocal()
		const local = framework.User.getLocals(user)

		expect(framework.User.locals).to.deep.equal({ collection: 'users', test: 'Testing static locals' })
		expect(local).to.deep.equal(locals)
		expect(locals).to.deep.equal({
			service: framework.User,
			instance: user,
			now,
			test: 'Testing instance locals'
		})
	})

	it('should have collection instance/static services', () => {
		const input = { something: 123 }
		const returned = framework.User.returnFunctionInput(input)
		expect(returned).to.deep.equal(input)

		const user = new framework.User({ name: 'John', age: 13 })
		const returned2 = user.returnFunctionInput(input)
		expect(returned2).to.deep.equal(input)
	})
})