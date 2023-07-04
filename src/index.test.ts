import { describe, it, beforeAll, expect } from 'vitest'
import { createServicesFramework } from './create-services'

describe('service-framework', () => {
	let framework: any

	beforeAll(() => {
		class User {
			name: string
			age: number

			constructor(content: User) {
				Object.assign(this, content)
			}
		}

		function nameToUpper<T>(entity: T, instance) {
			return function (newName?: string) {
				instance.name = (newName || instance.name).toUpperCase()
			}
		}

		function getName<T>(entity: T, instance) {
			return function () {
				return instance.name
			}
		}

		function getInstance<T>(entity: T, instance) {
			return function () {
				return instance
			}
		}

		function registerUser(entity: User) {
			return function (content) {
				return { test: content }
			}
		}

		framework = createServicesFramework({
			User: {
				entity: User,
				staticServices: {
					registerUser,
					nested: { deep: { registerUser } }
				},
				instanceServices: {
					nameToUpper,
					getInstance,
					getName,
					nested: { deep: { getName } }
				}
			},
			Test: {
				entity: User
			}
		})
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
		framework.User.nested.deep.registerUser()
		const user = new framework.User({ name: 'John', age: 13 })
		user.nested.deep.getName()
	})
})