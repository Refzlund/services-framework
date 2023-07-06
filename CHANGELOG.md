# services-framework

## 1.2.0

### Minor Changes

- f08b3da: - [BREAKING] `staticServices: [...]` has become

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

## 1.1.1

### Patch Changes

- 2d97ec3: Fixed package release workflow

## 1.1.0

### Minor Changes

- 46b35ea: Added @changesets/cli to handle versioning
