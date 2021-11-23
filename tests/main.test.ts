/*
Supported Types:
   : string
   : uint
   : int
   : 


import stacks, { StackBase } from '@spiekdpunch/stacks'


type UserType = {
   name: string
   age: number
   father: UserType
} & StackBase

enum Color {
   Red = 'red',
   Blue = 'blue',
   Green = 'green'
}

let stack = stacks.create()

stack.create.model()
stack.delete.model()
stack.update.model()
stack.get.modelById()
stack.get.modelByName()

// Applys all of the Models to the underlying systems
stack.bootstrap()

// Can create() be called offline
// It will just create the Shells
// of the Types. To bootstrap the
// underlying data sources, we could
// call await stack.bootstrap()

let Team: IModel = await stack.create.model('team', {
   name: ''
   // ...
})

let User: IModel = await stack.create.model('user', {
   name: '', // ({ int }) => int(-5)
   age: 0,   // ({ uint }) => uint(3)
   father: ({ inl }) => inl(this.model),
   team: ({ ref }) => ref(Team),
   color: ({ enum }) => enum(Color, Color.Red),
   items: {
      type: ({ array, int }) => array(int),
      value: [1, 2, 3, 4] // ({ int }) => [ int(1), int(2), int(3), int(4) ],
      symbols: [
         { name: 'dynamo:table', value: 'xxxx' }
      ]
   }
})

export {
   User,
   Team
}

let user: UserType = await User.create({ name: 'chris' })
let father: UserType = await User.get(id)

// alternatively
await stack.create.object()
await stack.create.object(User, { name: 'chris' })

user.father = father
user.age = 35
await User.validate(user)
await User.save(user)

// Or
let bondedUser: IBondedObject = BondedObject.get(user)
await bondedUser.save()

// Update
await User.update(user, (updated, exists) => // Pass in updated object and its ExistSatte  )

stack.async.on(Events.InstanceCreated, async (action) => {

})


interface IRequest {
   success(): Promise<void>
   failure(): Promise<void>
}

class RequestForChange {
   commit(request: IRequest): Promise<void>
}


let rest = new RestPlugin()
await stack.use(rest)
await stack.use(mongo)

rest.get('/users', User)
rest.post('/users', User)

rest.lisetn()

let dynamo = new DynamoDbPlugin({
   models: [User, Team]
})

await stack.use(dynamo)

let redis = new RedisPlugin()
await stack.use(redis)



//-- Plugin

setup()

*/

/*
   Model
*/

import { Stack } from '../src'
import { validateModel, validateObject } from './Utils'

describe(`# Stacks`, () => {
   test(`Can be created`, async () => {
      let stack = Stack.create()
      expect(stack).not.toBeFalsy()
   })
})

describe(`# Models`, () => {
   test(`Can create a Model`, async () => {
      let stack = Stack.create()

      let model = await stack.create.model('user', {
         name: '',
         age: ({ uint }) => uint(0),
         siblings: 2
      })

      expect(model).not.toBeFalsy()
   })

   test(`Can create an Object`, async () => {
      let stack = Stack.create()

      type TestType = {
         name: string
         age: number
         bool: boolean
      }

      let model = await stack.create.model('user', {
         name: '',
         age: ({ uint }) => uint(0),
         bool: true
      })

      await validateModel(model, {
         name: '',
         age: 0,
         bool: true
      })

      let tt = await model.create<TestType>({
         name: 'test',
         age: 3
      })

      await validateObject(tt, {
         name: 'test',
         age: 3,
         bool: true
      })
   })

   // TODO: Test every type
   test(`toJs() returns the right values`, async () => {
      let stack = Stack.create()

      type TestType = {
         name: string
         age: number
         bool: boolean
      }

      let model = await stack.create.model('user', {
         name: 'test',
         age: ({ uint }) => uint(13),
         bool: true
      })

      let js = await model.toJs<TestType>()

      expect(js).not.toBeFalsy()
      expect(js.name).toEqual('test')
      expect(js.age).toEqual(13)
      expect(js.bool).toEqual(true)
   })

   test(`Can append() new values`, async () => {
      let stack = Stack.create()

      let model = await stack.create.model('user', {
         name: 'rick',
         age: ({ uint }) => uint(69),
         bool: true
      })

      await validateModel(model, {
         name: 'rick',
         age: 69,
         bool: true
      })

      await model.append({
         new: false,
         value: ({ int }) => int(-42),
         bool: false
      })

      await validateModel(model, {
         name: 'rick',
         age: 69,
         bool: false,
         new: false,
         value: -42
      })
   })

   test(`Cannot add member with the same name and different Type`, async () => {
      let stack = Stack.create()

      let model = await stack.create.model('user', {
         name: 'rick',
         age: ({ uint }) => uint(69),
         bool: true
      })

      await model.members.add('name', ({ string }) => string('john'))

      await validateModel(model, {
         name: 'john',
         age: 69,
         bool: true
      })

      let didThrow = false
      try {
         await model.members.add('name', ({ int }) => int(3))
      } catch(err) {
         didThrow = true
      }

      expect(didThrow).toBe(true)
   })

   test(`Appending Member with the same name changes the original value`, async () => {
      let stack = Stack.create()

      let model = await stack.create.model('user', {
         name: 'rick',
         age: ({ uint }) => uint(69),
         bool: true
      })

      await model.members.add('name', ({ string }) => string('john'))

      await validateModel(model, {
         name: 'john',
         age: 69,
         bool: true
      })
   })

   test(`Can create a Member using full notation`, async () => {
      let stack = Stack.create()

      await stack.create.model('test', {
         items: {
            type: ({ list, int }) => list(int),
            value: ({ int }) => [ int(1), int(2), int(3), int(4) ],
            symbols: [
               { name: 'dynamo:table', value: 'xxxx' }
            ]
         }
      })
   })

   /* TODO:
      * Test when hasId comes from Cache & external system
      * Object: commit, create, delete, get, update
      * getMany()
   */

})

describe(`# Objects`, () => {
   test(`Can create an Object`, async () => {
      let stack = Stack.create()

      type UserType = {
         name: string
         age: number
         money: number
      }

      let User = await stack.create.model('user', {
         name: '',
         age: 0,
         money: -20
      })

      let chris = await User.create<UserType>({
         name: 'chris',
         age: 38
      })

      validateObject(chris, {
         name: 'chris',
         age: 38,
         money: -20
      })
   })
})


describe(`# Types`, () => {
   describe(`Validate`, () => {

      let tests = new Array<any>()

      tests.push({
         name: 'Bool',
         value: { bool: true },
         set: { bool: false }
      })

      tests.forEach(test => {
         test(test.name, async () => {
            let stack = Stack.create()

            let model = await stack.create.model('test', test.value)
   
            let obj = await model.create(test.set)
            let report = await model.validate(obj)
            expect(report.success).toBeTruthy()
         })
      })
   })
})