
import { ValueSerializer } from "../serialize/ValueSerializer";
import { BasicType, IType, TypeSet, ValidateResult } from "./Type";
import { BasicValue, IValue } from "./Value";

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

   clone(): IValue {
      return new StringValue(this.value)
   }
}

export class StringSerializer extends ValueSerializer {
   constructor() {
      super(TypeSet.String)
   }

   async toJs(value: IValue): Promise<any> {
      this.validate(value.type)

      let str = value as StringValue
      return str.value
   }

   async fromJs(type: IType, obj: any): Promise<IValue> {
      this.validate(type)

      if(typeof obj !== 'string') {
         throw new Error(`The JS object type does not match what's expected when serializing`)
      }

      return new StringValue(obj as string)
   }
}