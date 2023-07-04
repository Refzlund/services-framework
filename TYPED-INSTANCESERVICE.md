# Typed InstanceService

The instance service currently doesn't care about what content you put into the initial function.

However the content parameter must be valid in relation the the entity contents.

If `content: { name: string }` then the entity must have a `name: string` field

```ts
class User {
	name: string
	age: number
}

function setLastNameToUpperCase(content: { lastName: string }) {
	return function (newName?: string) { 
		content.lastName = (newName || content.lastName).toUpperCase()
	}
}


const e = createServicesFramework({
	entity: User,
	instanceServices: {
		setLastNameToUpperCase
		^^^^^^ Should throw a type error, as User does not have a lastName field
	}
})

const user = new e.User()
user.setLastNameToUpperCase()
```
