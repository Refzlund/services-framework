<h1 align="center">Services Framework 🚀</h1>

<h3 align="center">

![Linting & Tests](https://github.com/Refzlund/services-framework/workflows/test.yml/badge.svg)
</h3>



> I'd be happy to recieve [#feedback](https://github.com/Refzlund/services-framework/labels/feedback) moving towards v2

Services Framework, a powerful solution for creating modular, test-driven, and fully typed services for your projects. Say goodbye to messy code and hello to a clean and organized API that enhances developer experience and reusability.

- 🤩 **Modular**: Granular and modular control of entities
- 🧪 **Test-driven**: Write reliable and maintainable code
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
import type { ClassConstructor, StaticServiceFunction } from 'services-framework'
import type { User } from '$entities/user'

// Extending T sets the requirements for T.
export default (<T extends User>(User: ClassConstructor<T>) => ({

	async signUp(details: Partial<T> & Authentication) {
		const user = new User(...)
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
export default (<T extends User>(User: ClassConstructor<T>, instance: T) => ({

	async getCompanies() {
		const companies = instance.companies
		...
	}

})) satisfies InstanceServiceFunction
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
	return (<T>(Service: ClassConstructor<T>, instance: T) => ({

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

export class User {
	...
}

export const userService = {
	entity: User,

	//*In development
	locals: { 
		table: 'users'
	}

	staticServices: [
		signUp<User>, 
		logIn<User>
	],

	instanceServices: [
		getCompanies<User>
	],

	//*In development
	collections: [ 
		databaseHandlers<User>({...options})
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

services.User.signUp(...)
const user = new services.User(...)
user.getCompanies()
```


