import { BasicType, TypeSet, ValidateResult } from "./Type";
import { BasicValue } from "./Value";

export class IntType extends BasicType<number> {
   static readonly Singleton: IntType = new IntType()

   constructor() {
      super(TypeSet.Int)
   }

   async validate<T>(obj: T): Promise<ValidateResult> {
      let isValid = typeof obj === 'number'

      if(isValid) {
         return { success: true }
      } else {
         return { success: false, error: new Error(`Type does not match. Expected 'number' and receieved '${typeof obj}'`)}
      }
   }
}

export class IntValue extends BasicValue<number> {
   constructor(value: number = 0) {
      super(IntType.Singleton, value)
   }
}