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
   diet: false
})

// Models can contain metadata, called Symbols, to help configure
// plugin specific options.
Soda.symbols.push(...[
   { name: 'dynamo:partitionKeyField', value: 'cost' },
   { name: 'dynamo:partitionKeyType', value: 'number' }
])

let Vendor = await stack.create.model('vendor', {
   soda: Soda,    // To set a reference to a Soda Type
   anotherWayToSoda: ({ ref }) => ref(Soda.name),  // Same as the previous
   sodas: [Soda], // To set a reference to an Array of Sodas
})

// Bootstrap is called after all Models have been created.
// This allows Plugins to run any initialization code based
// on the Models that have been defined in the Stack.
await stack.bootstrap()

let coke = await Sode.create()

coke.cost = 100

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

# Models

**Creating Models**

When creating Models, a unique name is passed in, as well as the set of parameters. The values that are set when creating the Model, become the default values for any Objects that are created from them.

When setting the values for a Model, the system needs to know the Type and Value that is being set. For `string`, `number`, `boolean`, `Stacks` can infer the Type. For more complex Objects, like References to other Models, we need to specify the Type and Value.

```js
let model = await stack.create.model('name', {
   // The Type information can be infered on these Types
   string: `I'm a string`,
   int: -1,
   uint: 12,
   bool: true,
   // Arrays
   stringArray: ['']    // TODO: Need a better way to set default arrays
   // consider
   stringArray: ({ string }) => [string]
})

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
   GetStoreContext = 'get-store-context',
   HasId = 'has-id',
   ModelCreated = 'model-created',
   ModelDeleted = 'model-deleted',
   ModelUpdated = 'model-updated',
   ObjectCreated = 'object-created',
   ObjectDeleted = 'object-deleted',
   ObjectUpdated = 'object-updated',
   ObjectSaved = 'object-saved'
}

# Custom Queries

Most likely there will come a time when you'll want to customize your queries outside of what `stacks` provides. You can set a custom Query Object
on the `stack` that can be retrieved anywhere you need.

Each `stack` has a `setQuery<T>(query: T): void` and `getQuery<T>(): T | undefined`
