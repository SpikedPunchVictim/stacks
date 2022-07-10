# stacks

A data modeling system that allows you to separate your data from your implementation.


# Install

```bash
npm install @spikedpunch/stacks
```

# Usage

**Basic**

```js
import { Stack, StackObject } from '@spikedpunch/stacks'

// Create a new Stack
let stack = Stack.create()

// Define Types as usual, just extend the type with
// the StackObject type
type SodaPop = {
   name: string
   cost: number
   diet: boolean
} & StackObject

// Models represent the shape of the data. Creating a Model
// allows you to create objects off that Model. The values
// that are passed in become the default values for new objects.
let Soda = await stack.create.model('soda', {
   name: '',
   cost: 5,
   diet: false
})

// create() creates an object with default values
let coke = await Soda.create<SodaPop>()
coke.name = 'coke'

// Optionally pass in new values
let pepsi = await Soda.create<SodaPop>({
   name: 'pepsi',
   cost: 6
})

for await(let soda of Soda.getAll<SodaPop>()) {
   // prints:
   //    coke
   //    pepsi
   console.log(soda.name)
}

// Deletes the object
await Soda.delete(pepsi)
```

**Advanced**

```js
let stack = Stack.create()

let redis = new RedisPlugin()
let dynamo = new DynamoPlugin()

// Plugins listen for events and respond to them
await stack.use(redis)
await stack.use(dynamo)

type SodaPop = {
   name: string
   cost: number
   diet: boolean
} & StackObject

let Soda = await stack.create.model('soda', {
   name: '',
   cost: 0,
   diest: false
})

// Bootstrap is called after all Models have been created.
// This allows Plugins to run any initialization code based
// on the Models that have been defined in the Stack.
await stack.bootstrap()

let coke = await Sode.create()

// This SodaPop object is saved in Redis and Dynamo
// If the save() fails for any plugin, the save()
// is rolled back across all plugins.
await coke.save()

// Redis will be the first plugin to receive this event
// It will supply the value. The Dynamo plugin will notice
// the value is already provided, and not pull the value from
// the DB.
coke = await Soda.get(coke.id)
```



# Events

| Event | Description |
|---|---|
| `bootstrap` | Raised when `bootstrap()` is called |
| `get-many-objects` | 

export enum EventSet {
   Bootstrap = 'bootstrap',
   GetManyObjects = 'get-many-objects',
   GetModel = 'get-model',
   GetObject = 'get-object',
   HasId = 'has-id',
   ModelCreated = 'model-created',
   ModelDeleted = 'model-deleted',
   ModelUpdated = 'model-updated',
   ObjectCreated = 'object-created',
   ObjectDeleted = 'object-deleted',
   ObjectUpdated = 'object-updated',
   ObjectSaved = 'object-saved'
}