
import { ClassOf, createServicesFramework, Class, ClassConstructor, StaticServiceFunction, InstanceServiceFunction, Service } from '.'

class User {
	id: number
	name: string

	constructor(content: Partial<User>) {
		Object.assign(this, content)
	}
}

const getFromDatabase = (<T extends ClassOf<any>>(Entity: ClassConstructor<T>) => ({
	
	async getFromDatabase(filter: Partial<T>) {
		return {} as T
	}

})) satisfies StaticServiceFunction

const getAll = (<T extends ClassOf<any>>(Entity: ClassConstructor<T>) => ({

	async getAll(filter: Partial<T>) {
		return {} as T
	}

})) satisfies StaticServiceFunction

const availablePizzas = (<T extends ClassOf<any>>(Entity: ClassConstructor<T>) => ({

	async availablePizzas(filter: Partial<T>) {
		return {} as T
	}

})) satisfies StaticServiceFunction

const availableBurgers = (<T extends ClassOf<any>>(Entity: ClassConstructor<T>) => ({

	async availableBurgers(filter: Partial<T>) {
		return {} as T
	}

})) satisfies StaticServiceFunction

const mergeDocument = (<C extends ClassOf<any>>(
	entity: ClassConstructor<C>,
	instance: Class<C>
) => ({
	
	async mergeDocument(merge: Partial<C>) {
		// ...
	}

})) satisfies InstanceServiceFunction

const deleteDocument = (<C extends ClassOf<any>>(
	entity: ClassConstructor<C>,
	instance: Class<C>
) => ({
	
	async deleteDocument(merge: Partial<C>) {
		// ...
	}

})) satisfies InstanceServiceFunction

const consumePizza = (<C extends ClassOf<any>>(
	entity: ClassConstructor<C>,
	instance: Class<C>
) => ({

	async consumePizza(merge: Partial<C>) {
		// ...
	}

})) satisfies InstanceServiceFunction

const consumeBurger = (<C extends ClassOf<any>>(
	entity: ClassConstructor<C>,
	instance: Class<C>
) => ({

	async consumeBurger(merge: Partial<C>) {
		// ...
	}

})) satisfies InstanceServiceFunction

const userService = {

	entity: User,

	static: {
		locals: {
			table: 'users'
		},
		services: [
			getFromDatabase<User>,
			getAll<User>,
			{
				nested: [
					getFromDatabase<User>,
					getAll<User>
				]
			}
		]
	},

	instance: {
		locals: () => ({
			createdAt: new Date()
		}),
		services: [
			mergeDocument<User>,
			deleteDocument<User>,
			{
				nested: {
					functions: [
						mergeDocument<User>,
						deleteDocument<User>,
					]
				}
			}
		]
	},
	collections: [
		{
			static: {
				services: [
					availablePizzas<User>,
					availableBurgers<User>,
				]
			},
			instance: {
				services: [
					consumePizza<User>,
					consumeBurger<User>
				]
			}
		}
	]
} satisfies Service<User>



const entitites = createServicesFramework({
	User: userService
})

entitites.User.getFromDatabase({ id: 1 })
//                ^?
entitites.User.getAll({ id: 1 })
//                ^?

entitites.User.nested.getFromDatabase({ id: 1 })
//               ^?
entitites.User.nested.getAll({ id: 1 })
//               ^?

entitites.User.availableBurgers({ id: 1 })
//               ^?

entitites.User.availablePizzas({ id: 1 })
//               ^?

const user = new entitites.User({ id: 1, name: 'Carl' })

user.mergeDocument({ name: 'Bob' })
//       ^?
user.deleteDocument({ name: 'Bob' })
//       ^?

user.nested.functions.mergeDocument({ name: 'Bob' })
//             ^?
user.nested.functions.deleteDocument({ name: 'Bob' })
//             ^?

user.consumeBurger({})
//       ^?

user.consumePizza({})
//       ^?