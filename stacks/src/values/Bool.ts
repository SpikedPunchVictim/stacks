import { ValueSerializer } from "../serialize/ValueSerializer";
import { BasicType, IType, TypeSet, ValidateResult } from "./Type";
import { BasicValue, IValue } from "./Value";


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

   clone(): IValue {
      return new BoolValue(this.value)
   }

   async deserialize(value: any): Promise<IValue> {
      if(typeof value === 'string') {
         return new BoolValue(value.toLowerCase() === 'true')
      }

      return new BoolValue(value as boolean)
   }
}


export class BoolSerializer extends ValueSerializer {
   constructor() {
      super(TypeSet.Bool)
   }

   async toJs(value: IValue): Promise<any> {
      this.validate(value.type)

      let bool = value as BoolValue
      return bool.value
   }

   async fromJs(type: IType, obj: any): Promise<IValue> {
      this.validate(type)

      if(typeof obj !== 'boolean') {
         throw new Error(`The JS object type does not match what's expected when serializing`)
      }

      return new BoolValue(obj as boolean)
   }
}
