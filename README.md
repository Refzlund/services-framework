<h1 align="center">Services Framework 🚀</h1>
<h3 align="center">

![Linting & Tests](https://github.com/Refzlund/services-framework/actions/workflows/main.yml/badge.svg)
</h3>



> I'd be happy to recieve [#feedback](https://github.com/Refzlund/services-framework/labels/feedback%20wanted) moving towards v2

Services Framework, a powerful solution for creating modular, test-driven, and fully typed services for your projects. Say goodbye to messy code and hello to a clean and organized API that enhances developer experience and reusability.

- 🤩 **Modular**: Granular and modular control of entities
- 🧪 **Better testing suites**: Write reliable and maintainable code with *unit testing* / *test-driven development*
- 💫 **Typed**: TypeScript support for maximum safety and productivity

<br><br>

## Quick Start

<p align="center">
	<code>npm i -D services-framework</code>
	 / 
	<code>pnpm add -D services-framework</code>
</p>

<br><br>

## Why was Services Framework made?

- You may re-use the same classes under different contexts: <br>
In SvelteKit your frontend and backend code is in the same project. <br><br>
**services-framework** gives you the ability to re-use classes on the frontend and backend without dragging class embedded functions with. <br>
This is helpful if you apply dectorators to validate content.

- Modularity and re-useability: <br>
Write a service once, and re-apply it for multiple classes. <br>

- Testable: <br>
By splitting the code up, you allow for seperation of concerns,<br> 
giving you more control of test suites.

<br><br>

## Usage

<details><summary>Sign Up (<i>Static Service</i>)</summary>

```ts
// ../entities/user/sign-up.ts
import type { ClassConstructor, StaticServiceFunction, ClassOf } from 'services-framework'
import type { User } from '$entities/user'

// Extending T sets the requirements for T.
export default (<T extends ClassOf<User>>(User: ClassConstructor<T>) => ({

	async signUp(details: Partial<T> & Authentication) {
		const user = new User(...)
		const locals = User.getLocals(user)

		locals.justSignedUp = true
		...
	}

})) satisfies StaticServiceFunction
```
</details>

<details><summary>Get Companies (<i>Instance Service</i>)</summary>
	
```ts
// .../entities/users/get-companies.ts
import type { ClassConstructor, InstanceServiceFunction } from 'services-framework'
import type { User } from '$entities/user'

// Extending T sets the requirements for T.
export default (<T extends ClassOf<User>>(User: ClassConstructor<T>, instance: T, locals: Record<any, any>) => ({

	async getCompanies() {
		const companies = instance.companies || []
		if(locals.justSignedUp) {
			...
		}
		...
	}

})) satisfies InstanceServiceFunction
```
</details>

<details><summary>databaseHandlers (<i>Service Collection</i>)</summary>

```ts
// ../services/collection.database-handlers.ts
import ... from ...

interface Options = {
	table: string
}

export default <T extends ClassOf<any>>(opts: Options) => ({

	static: {
		locals: {
			table: opts.table,
			...
		},
		services: [
			get<T>
			saveAll<T>
		]
	}

	instance: {
		services: [
			save<T>
		]
	}

}) satisfies Collection<T>
```
</details>

<details><summary><i><small>Adding options</i></small></summary>

```ts
interface Options {...}

export default function(opts: Options) {

	// Custom logic
	...

	// 👇 Do not run code between this function and the returned Record-object
	// As the keys are fetched like this: `service(null, null)`
	return (<T extends ClassOf<any>>(Service: ClassConstructor<T>, instance: T, locals: Record<any, any>) => ({

		async someFunction() {
			...
		}

	})) satisfies InstanceServiceFunction
}

// --- * Usage * ---
const instanceServices = [
	someFunction(...)<Entity>
]

```

</details>

<br>

```ts
// ../entities/user/index.ts
import signUp from '$entities/user/sign-up'
import logIn from '$entities/user/log-in'
import getCompanies from '$entities/user/get-companies'
import databaseHandlers from '$services/collection.database-handlers'
import passwordHash from '$utils/password-hash.ts'

export class User {
	...
}

export const userService = {
	entity: User,

	static: {
		locals: {
			passwordEncryption: passwordHash
		},
		services: [
			signUp<User>, 
			logIn<User>
		],
	}

	instance: {
		locals: (service, instance) => ({
			justSignedUp: false
		}),
		services: [
			getCompanies<User>
		]
	}

	collections: [ 
		databaseHandlers<User>({ table: 'users' })
	] 
} satisfies Service<User>
```

```ts
// .../services/index.ts
import { userService } from '$entities/user'
import { companyService } from '$entities/company'

export default createServices({
	User: userService,
	Company: companyService,
	...
})
```

```ts
// .../...
import services from '$serivces'

const { User: UserService } = services
UserService.signUp(...)
useCollection(UserService.locals.collection)
const user = new services.User(...)
user.getCompanies()

const { justSignedUp } = UserService.getLocals(user)
```


