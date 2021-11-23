import { BasicType, TypeSet, ValidateResult } from "./Type";
import { BasicValue } from "./Value";

export class UIntType extends BasicType<number> {
   static readonly Singleton: UIntType = new UIntType()

   constructor() {
      super(TypeSet.UInt)
   }

   async validate<T>(obj: T): Promise<ValidateResult> {
      let isValid = typeof obj === 'number'

      //@ts-ignore
      let cast = obj as number

      if (cast < 0) {
         return { success: false, error: new Error(`Cannot set a negative value for a UInt type. Received value ${obj}`) }
      }

      if (isValid) {
         return { success: true }
      } else {
         return { success: false, error: new Error(`Type does not match. Expected 'number' and receieved '${typeof obj}'`) }
      }
   }
}

export class UIntValue extends BasicValue<number> {
   constructor(value: number = 0) {
      super(UIntType.Singleton, value)
   }
}