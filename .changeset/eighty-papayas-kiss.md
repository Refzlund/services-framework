---
"services-framework": minor
---

- [BREAKING] `staticServices: [...]` has become

```ts
{
    static: {
        locals: {...},
        services: [...]
    }
}
```

- [BREAKING] `instanceServices: [...]` has become

```ts
{
    instance: {
        locals: {...},
        services: [...]
    }
}
```

- [FEAT] Added instance-locals to instance service functions: `(service, instance, locals) => ...`

- [FEAT] Added `Entity.getLocals(instance) => instanceLocals` to service entities
