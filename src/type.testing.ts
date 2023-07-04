
import { createServicesFramework } from '.'
import * as T from 'utility-types'
import { Constructable, ConstructorReturn, Service } from './types'

class User {
	id: number
	name: string

	constructor(content: Partial<User>) {
		Object.assign(this, content)
	}
}

function mergeDocument<T>(entity: T, instance: any) {
	return async (merge: Partial<T>) => {
		// ...
		return true
	}
}

function getFromDatabase<const T>(entity: T) {
	return async (filter: Partial<T>) => {
		return {} as T
	}
}

const entitites = createServicesFramework({
	User: {
		entity: User,
		staticServices: {
			getFromDatabase,
			nested: { functions: { getFromDatabase } }
		},
		instanceServices: {
			mergeDocument,
			nested: { functions: { mergeDocument } }
		}
	}
})

const u = new entitites.User({})

u.mergeDocument(true)
// ?^
entitites.User.getFromDatabase
				// ?^


// const user = new entitites.User({ id: 1, name: 'Carl' })
// user.createDocument(true)

// user.nested.functions.createDocument(false)

// const existingUser = await entitites.User.getFromDatabase(1)
// const existingUser2 = await entitites.User.nested.functions.getFromDatabase(1)