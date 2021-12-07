import { TypeSet } from "../src";
import { IModel } from "../src/Model";
import { IValueSerializer } from "../src/serialize/ValueSerializer";

export type ModelValidate = {
   [key: string]: any
}

export type ObjectValidate = {
   [key: string]: any
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