import { IModel, IStack, IValueSource, MemberInfo, Stack, StackObject } from '../src'
import { UidKeeper } from '../src/UidKeeper'
import { createScenario, validateModel, validateObject } from './Utils'

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
   list: number[]
   ref: FlatType
   refs: FlatType[]
} & StackObject

let ParentTypeCreater = {
   id: 'test-id',
   string: 'cat-man-do',
   int: -42,
   uint: 42,
   list: [ 0, 1, 2, 3, 4 ],
   ref: ({ ref }: IValueSource) => ref(ModelNames.FlatType),
   refs: ({ list, ref }) => list(ref(ModelNames.FlatType))
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

   test(`Can change a Member's Type`, async () => {
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
      }, stack.serializer)

      let didThrow = false
      try {
         await model.members.add('name', ({ int }) => int(3))
      } catch(err) {
         didThrow = true
      }

      expect(didThrow).toBe(false)
   })

   test(`Can add Symbols`, async () => {
      let stack = Stack.create()

      let model = await stack.create.model('user', {
         name: 'rick',
         age: ({ uint }) => uint(69),
         bool: true
      })

      model.symbols.push({
         name: 'test',
         value: 'test-value'
      })

      expect(model.symbols[0].name).toBe('test')
      expect(model.symbols[0].value).toBe('test-value')
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
      * Tests for setting refs in Models
   */

})

type TypeTest = {
   name: string,
   info: MemberInfo,
   test: (stack: IStack, model: IModel) => Promise<void>
}

describe(`# Models (Types)`, () => {
   const BasicTypeTests: TypeTest[] = [
      {
         name: 'bool',
         info: {
            type: ({ bool }) => bool,
            value: ({ bool }) => bool(true)
         },
         test: async (stack, model) => await validateModel(model, { test: true }, stack.serializer)
      },
      {
         name: 'int',
         info: {
            type: ({ int }) => int,
            value: ({ int }) => int(-10)
         },
         test: async (stack, model) => await validateModel(model, { test: -10 }, stack.serializer)
      },
      {
         name: 'uint',
         info: {
            type: ({ uint }) => uint,
            value: ({ uint }) => uint(10)
         },
         test: async (stack, model) => await validateModel(model, { test: 10 }, stack.serializer)
      },
      {
         name: 'string',
         info: {
            type: ({ string }) => string,
            value: ({ string }) => string('a little scary')
         },
         test: async (stack, model) => await validateModel(model, { test: 'a little scary' }, stack.serializer)
      },
      {
         name: 'list<bool>',
         info: {
            type: (types) => types.list(types.bool),
            value: [true, false, true]
         },
         test: async (stack, model) => await validateModel(model, { test: [true, false, true] }, stack.serializer)
      },
      {
         name: 'list<int>',
         info: {
            type: (types) => types.list(types.int),
            value: [1, 2, -3]
         },
         test: async (stack, model) => await validateModel(model, { test: [1, 2, -3] }, stack.serializer)
      },
      {
         name: 'list<uint>',
         info: {
            type: (types) => types.list(types.uint),
            value: [1, 2, 3]
         },
         test: async (stack, model) => await validateModel(model, { test: [1, 2, 3] }, stack.serializer)
      },
      {
         name: 'list<string>',
         info: {
            type: (types) => types.list(types.string),
            value: ['the', 'quick', 'fox']
         },
         test: async (stack, model) => await validateModel(model, { test: ['the', 'quick', 'fox'] }, stack.serializer)
      }
   ]

   for(let info of BasicTypeTests) {
      test(`Can set a ${info.name}`, async () => {
         let stack = Stack.create()
         let model = await stack.create.model('test')
   
         await model.append({ test: info.info })
         await info.test(stack, model)
      })
   }
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

      await model.save(obj)

      await model.delete(obj)

      let found = await stack.get.object(model.name, id)
      expect(found).toBeUndefined()
   })

   test(`Can get()`, async () => {
      let { model } = await createScenario()

      let obj = await model.create()
      await model.save(obj)

      let found = await model.get(obj.id)

      expect(found).not.toBeUndefined()
   })

   test(`Can getAll()`, async () => {
      let { model } = await createScenario()
      let count = 1000

      for(let i = 0; i < count; ++i) {
         let obj = await model.create()
         await model.save(obj)
      }

      let objs = await model.getAll()

      expect(objs.length).toEqual(count)
   })

   test(`Can getAll() :: Less than limit`, async () => {
      let { model } = await createScenario()
      let count = 50

      for(let i = 0; i < count; ++i) {
         let obj = await model.create()
         await model.save(obj)
      }

      let objs = await model.getAll()

      expect(objs.length).toEqual(count)
   })

   test(`Can getAll() :: Just over limit`, async () => {
      let { model } = await createScenario()
      let count = 115

      for(let i = 0; i < count; ++i) {
         let obj = await model.create()
         await model.save(obj)
      }

      let objs = await model.getAll()

      expect(objs.length).toEqual(count)
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