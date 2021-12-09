import { IStack, Stack, StackObject, TypeSet } from "../src";
import { IModel } from "../src/Model";
import { IValueSerializer } from "../src/serialize/ValueSerializer";

export type ModelValidate = {
   [key: string]: any
}

export type ObjectValidate = {
   [key: string]: any
}

export type TestScenario = {
   stack: IStack
   model: IModel
   objects: StackObject[]
}

let FlatTypeCreater = {
   string: 'flat',
   int: -90,
   uint: 90,
   list: [true, false, false, true]
}

export async function createScenario(): Promise<TestScenario> {
   let stack = Stack.create()
   let model = await stack.create.model('model', FlatTypeCreater)

   let objects = new Array<StackObject>()

   for(let i = 0; i < 3; ++i) {
      objects.push(await model.create())
   }

   return { stack, model, objects }
}

export async function validateModel(model: IModel, obj: ModelValidate, serializer: IValueSerializer): Promise<void> {
   expect(model).not.toBeFalsy()

   for(let key of Object.keys(obj)) {
      let member = model.members.get(key)

      if(member === undefined) {
         expect(member).not.toBeFalsy()
         return
      }

      if(member.type.type === TypeSet.ObjectRef) {
         let valueJs = await serializer.toJs(member.value)
         await validateObject(valueJs, obj[key])
         continue
      }
      
      expect(await serializer.toJs(member.value)).toEqual(obj[key])
   }
}

export async function validateObject<T>(it: T, obj: ObjectValidate): Promise<void> {
   expect(it).not.toBeFalsy()

   for(let key of Object.keys(obj)) {
      if(!Array.isArray(obj[key]) && typeof obj[key] === 'object') {
         await validateObject(it[key], obj[key])
         continue
      }

      expect(it[key]).toEqual(obj[key])
   }
}