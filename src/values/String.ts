
import { BasicType, TypeSet, ValidateResult } from "./Type";
import { BasicValue } from "./Value";

export class StringType extends BasicType<number> {
   static readonly Singleton: StringType = new StringType()

   constructor() {
      super(TypeSet.String)
   }

   async validate<T>(obj: T): Promise<ValidateResult> {
      let isValid = typeof obj === 'string'

      if(isValid) {
         return { success: true }
      } else {
         return { success: false, error: new Error(`Type does not match. Expected 'string' and receieved '${typeof obj}'`)}
      }
   }
}

export class StringValue extends BasicValue<string> {
   constructor(value: string = '') {
      super(StringType.Singleton, value)
   }
}