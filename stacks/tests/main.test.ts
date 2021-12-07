import { IModel, IValueSource, Stack, StackObject } from '../src'
import { UidKeeper } from '../src/UidKeeper'
import { validateModel, validateObject } from './Utils'

const ModelNames = {
   FlatType: 'flattype',
   ParentType: 'parenttype'
}

type FlatType = {
   string: string
   int: number
   uint: number
   list: any[]
} & StackObject

let FlatTypeCreater = {
   string: 'flat',
   int: -90,
   uint: 90,
   list: [true, false, false, true]
}

let FlatTypeValidater = {
   string: 'flat',
   int: -90,
   uint: 90,
   list: [true, false, false, true]
}

type ParentType = {
   string: string
   int: number
   uint: number
   list: any[]
   ref: FlatType
} & StackObject

let ParentTypeCreater = {
   id: 'test-id',
   string: 'cat-man-do',
   int: -42,
   uint: 42,
   list: [ 0, 1, 2, 3, 4 ],
   ref: ({ ref }: IValueSource) => ref(ModelNames.FlatType)
}

let ParentTypeValidater = {
   string: 'cat-man-do',
   int: -42,
   uint: 42,
   list: [ 0, 1, 2, 3, 4 ],
   ref: {
      id: UidKeeper.IdNotSet,
      string: 'flat',
      int: -90,
      uint: 90,
      list: [true, false, false, true]
   }
}


describe(`# Stacks`, () => {
   test(`Can be created`, async () => {
      let stack = Stack.create()
      expect(stack).not.toBeFalsy()
   })
})

describe(`# Models`, () => {
   test(`Can create a Model`, async () => {
      let stack = Stack.create()

      let model = await stack.create.model('user', FlatTypeCreater)

      expect(model).not.toBeFalsy()
   })

   test(`Can delete a Model`, async () => {
      let stack = Stack.create()

      let model: IModel | undefined = await stack.create.model('user', FlatTypeCreater)

      expect(model).not.toBeFalsy()

      await stack.delete.model(model.name)

      model = await stack.get.model(model.name)

      expect(model).toBeUndefined()
   })

   test(`Can create a Flat Object`, async () => {
      let stack = Stack.create() as Stack

      let model = await stack.create.model(ModelNames.FlatType, FlatTypeCreater)

      await validateModel(model, FlatTypeValidater, stack.serializer)

      /*
         string: 'flat',
         int: '-90',
         uint: 90,
         list: [true, false, false, true]
      */

      let newObj = {
         string: 'different',
         int: -100,
         uint: 100,
         list: [ false, true, true, false]
      }

      let obj = await model.create<FlatType>(newObj)

      await validateObject(obj, newObj)
   })

   test(`Can create a Parent/Child Object`, async () => {
      let stack = Stack.create()

      let model = await stack.create.model(ModelNames.ParentType, ParentTypeCreater)
      await stack.create.model(ModelNames.FlatType, FlatTypeCreater)
      
      await validateModel(model, ParentTypeValidater, stack.serializer)

      let newObj = {
         string: 'different',
         int: -101,
         uint: 101,
         list: [ 5, 6, 7, 8 ],
         ref: {
            id: UidKeeper.IdNotSet,
            string: 'different-flat',
            int: -290,
            uint: 290,
            list: [true, true, true]
         }
      }

      let obj = await model.create<ParentType>(newObj)

      await validateObject(obj, newObj)
   })












   // TODO: Test every type
   // test(`toJs() returns the right values`, async () => {
   //    let stack = Stack.create()

   //    type TestType = {
   //       name: string
   //       age: number
   //       bool: boolean
   //    }

   //    let model = await stack.create.model('user', {
   //       name: 'test',
   //       age: ({ uint }) => uint(13),
   //       bool: true
   //    })

   //    let js = await model.toJs<TestType>()

   //    expect(js).not.toBeFalsy()
   //    expect(js.name).toEqual('test')
   //    expect(js.age).toEqual(13)
   //    expect(js.bool).toEqual(true)
   // })

   // test(`Can append() new values`, async () => {
   //    let stack = Stack.create()

   //    let model = await stack.create.model('user', {
   //       name: 'rick',
   //       age: ({ uint }) => uint(69),
   //       bool: true
   //    })

   //    await validateModel(model, {
   //       name: 'rick',
   //       age: 69,
   //       bool: true
   //    })

   //    await model.append({
   //       new: false,
   //       value: ({ int }) => int(-42),
   //       bool: false
   //    })

   //    await validateModel(model, {
   //       name: 'rick',
   //       age: 69,
   //       bool: false,
   //       new: false,
   //       value: -42
   //    })
   // })

   // test(`Cannot add member with the same name and different Type`, async () => {
   //    let stack = Stack.create()

   //    let model = await stack.create.model('user', {
   //       name: 'rick',
   //       age: ({ uint }) => uint(69),
   //       bool: true
   //    })

   //    await model.members.add('name', ({ string }) => string('john'))

   //    await validateModel(model, {
   //       name: 'john',
   //       age: 69,
   //       bool: true
   //    })

   //    let didThrow = false
   //    try {
   //       await model.members.add('name', ({ int }) => int(3))
   //    } catch(err) {
   //       didThrow = true
   //    }

   //    expect(didThrow).toBe(true)
   // })

   // test(`Appending Member with the same name changes the original value`, async () => {
   //    let stack = Stack.create()

   //    let model = await stack.create.model('user', {
   //       name: 'rick',
   //       age: ({ uint }) => uint(69),
   //       bool: true
   //    })

   //    await model.members.add('name', ({ string }) => string('john'))

   //    await validateModel(model, {
   //       name: 'john',
   //       age: 69,
   //       bool: true
   //    })
   // })

   // test(`Can create a Member using full notation`, async () => {
   //    let stack = Stack.create()

   //    await stack.create.model('test', {
   //       items: {
   //          type: ({ list, int }) => list(int),
   //          value: ({ int }) => [ int(1), int(2), int(3), int(4) ],
   //          symbols: [
   //             { name: 'dynamo:table', value: 'xxxx' }
   //          ]
   //       }
   //    })
   // })

   /* TODO:
      * Test when hasId comes from Cache & external system
      * Object: commit, create, delete, get, update
      * getMany()
      * * Local objects that are created do not have their IDs set
      * All Values can be cloned()
   */

})

describe(`# Objects`, () => {
   test(`Can be created`, async () => {
      let stack = Stack.create()

      type UserType = {
         name: string
         age: number
         money: number
      } & StackObject

      let User = await stack.create.model('user', {
         name: '',
         age: 0,
         money: -20
      })

      let chris = await User.create<UserType>({
         name: 'chris',
         age: 38
      })

      await validateObject(chris, {
         name: 'chris',
         age: 38,
         money: -20
      })
   })

   test(`Can be deleted`, async () => {
      let stack = Stack.create()

      let model = await stack.create.model('model', FlatTypeCreater)

      let obj = await model.create()
      let id = obj.id

      expect(obj).not.toBeUndefined()

      await model.delete(obj)

      let found = await stack.get.object(model.name, id)
      expect(found).toBeUndefined()
   })
})


// describe(`# Types`, () => {
//    describe(`Validate`, () => {

//       let tests = new Array<any>()

//       tests.push({
//          name: 'Bool',
//          value: { bool: true },
//          set: { bool: false }
//       })

//       tests.forEach(test => {
//          test(test.name, async () => {
//             let stack = Stack.create()

//             let model = await stack.create.model('test', test.value)
   
//             let obj = await model.create(test.set)
//             let report = await model.validate(obj)
//             expect(report.success).toBeTruthy()
//          })
//       })
//    })
// })