import { BasicType, TypeSet, ValidateResult } from "./Type";
import { BasicValue } from "./Value";


export class BoolType extends BasicType<boolean> {
   static readonly Singleton: BoolType = new BoolType()

   constructor() {
      super(TypeSet.Bool)
   }

   async validate<T>(obj: T): Promise<ValidateResult> {
      let isValid = typeof obj === 'boolean'

      if(isValid) {
         return { success: true }
      } else {
         return { success: false, error: new Error(`Type does not match. Expected 'boolean' and receieved '${typeof obj}'`)}
      }
   }
}

export class BoolValue extends BasicValue<boolean> {
   constructor(value: boolean = true) {
      super(BoolType.Singleton, value)
   }
}

