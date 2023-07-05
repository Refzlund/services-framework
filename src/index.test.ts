import { describe, it, beforeAll, expect } from 'vitest'
import { ClassConstructor, InstanceServiceFunction, Service, StaticServiceFunction, createServicesFramework } from '.'


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
	// * ---------------------- *

	const userService = {
		entity: User,
		staticServices: [
			registerUser<User>,
			{
				nested: {
					deep: [
						registerUser<User>
					]
				}
			}
		],
		instanceServices: [
			getName<User>,
			getInstance<User>,
			nameToUpper<User>,
			{
				nested: {
					deep: [
						getName<User>,
					]
				}
			}
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
})