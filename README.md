<h1 align="center">Service Framework 🚀</h1>

>  Pre-release: Still sorting out some type-shenanigans, so use for testing/experimenting with the library.

Service Framework, a powerful solution for creating modular, test-driven, and fully typed services for your projects. Say goodbye to messy code and hello to a clean and organized API that enhances developer experience and reusability.

- 🤩 **Modular**: Granular and modular control of entities
- 🧪 **Test-driven**: Write reliable and maintainable code
- 💫 **Typed**: TypeScript support for maximum safety and productivity

## Quick Start

<p align="center">
	<code>npm i -D service-framework</code>
	 / 
	<code>pnpm add -D service-framework</code>
</p>

## Why Service Framework?

1. **Service-based mindset**: Embrace a granular and modular approach to managing entities. With Service Framework, you can easily define services for your entities and choose which functions should be available to them. This results in a highly flexible and reusable codebase.

Example; you have an API to create new documents to a database:

```ts
function createDocument(entity) {
    return (content) => {
        const errors = validate(content)
        if(errors.length > 0) {
            return errors
        }
        return await db.query(`CREATE $content.id CONTENT $content`, { content })
    }
}
```

After providing this function, we can choose what entities can be have this:

```ts
export const services = createServices({
    User: {
        entity: User,
        staticServices: [createDocument]
    },
    Account: {
        entity: Account,
        staticServices: [createDocument]
    },
    Pet: {
        entity: Pet,
        staticServices: []
    }
})
```

Essentially giving a huge amount of control and re-usability.

2. **Seperation of concerns**: Keep your code clean and organized by spreading functions across different files. This approach ensures a readable and accessible structure.
3. SvelteKit friendly: SvelteKit contains frontend and backend in the same project. Using **service-framework** we can re-use classes on the frontend to for instance, validate contents before it is sent to the backend API.

## Example

```ts
import { createServicesFramework } from 'service-framework'

class User {
    id: string = generateId()
    email: string
    password: string
    name: string

    constructor(content: Omit<User, 'id'>) {
        Object.assign(this, content)
    }
}

// Static function
function createLogin(entity) {
    return (content: {
        email: string
        password: string
    }) => {
        ...
    }
}

// Entity instance function
function setNameToUpperCase(entity, instance: { name: string }) {
    return () => {
        stance.name = content.name.toUpperCase()
    }
}

// Create service layer
export const entities = createServicesFramework({
    User: {
        entity: User,
        staticServices: {
          createLogin
        },
        instanceServices: {
            setNameToUpperCase
        }
    }
})

// Example use
const user = new entities.User({ 
    email: 'my@email.com', 
    password: '123456'
})

entities.User.createLogin(user)
user.setNameToUpperCase()

```

<div style='margin-bottom: 100px;'> </div>
