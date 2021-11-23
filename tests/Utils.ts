import { IModel } from "../src/Model";

export type ModelValidate = {
   [key: string]: any
}

export type ObjectValidate = {
   [key: string]: any
}

export async function validateModel(model: IModel, obj: ModelValidate): Promise<void> {
   expect(model).not.toBeFalsy()

   for(let key of Object.keys(obj)) {
      let member = model.members.get(key)

      if(member === undefined) {
         expect(member).not.toBeFalsy()
         return
      }

      expect(member.type.toJs()).toEqual(obj[key])
   }
}

export async function validateObject<T>(it: T, obj: ObjectValidate): Promise<void> {
   expect(it).not.toBeFalsy()

   for(let key of Object.keys(obj)) {
      expect(it[key]).toEqual(obj[key])
   }
}