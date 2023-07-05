
import { createServicesFramework, Class, ClassConstructor, StaticServiceFunction, InstanceServiceFunction, Service } from '.'

class User {
	id: number
	name: string

	constructor(content: Partial<User>) {
		Object.assign(this, content)
	}
}

const getFromDatabase = (<T extends Class<any>>(Entity: ClassConstructor<T>) => ({
	
	async getFromDatabase(filter: Partial<T>) {
		return {} as T
	}

})) satisfies StaticServiceFunction

const getAll = (<T extends Class<any>>(Entity: ClassConstructor<T>) => ({

	async getAll(filter: Partial<T>) {
		return {} as T
	}

})) satisfies StaticServiceFunction

const mergeDocument = (<C extends Class<any>>(entity: ClassConstructor<C>, instance: C) => ({
	
	async mergeDocument(merge: Partial<C>) {
		// ...
	}

})) satisfies InstanceServiceFunction

const deleteDocument = (<C extends Class<any>>(entity: ClassConstructor<C>, instance: C) => ({
	
	async deleteDocument(merge: Partial<C>) {
		// ...
	}

})) satisfies InstanceServiceFunction


const userService = {

	entity: User,
	staticServices: [
		getFromDatabase<User>,
		getAll<User>,
		{
			nested: [
				getFromDatabase<User>,
				getAll<User>
			]
		}
	],
	instanceServices: [
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

const user = new entitites.User({ id: 1, name: 'Carl' })

user.mergeDocument({ name: 'Bob' })
//       ^?
user.deleteDocument({ name: 'Bob' })
//       ^?

user.nested.functions.mergeDocument({ name: 'Bob' })
//             ^?
user.nested.functions.deleteDocument({ name: 'Bob' })
//             ^?
