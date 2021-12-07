import { ValueSerializer } from "../serialize/ValueSerializer";
import { BasicType, IType, TypeSet, ValidateResult } from "./Type";
import { BasicValue, IValue } from "./Value";

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

   clone(): IValue {
      return new UIntValue(this.value)
   }

   async deserialize(value: any): Promise<IValue> {
      if(typeof value !== 'number') {
         throw new Error(`Cannot deserialize a ${typeof value}. Expected a number`)
      }

      if(value < 0) {
         throw new Error(`Failed to deserialize an unsigned number ${value}. The value is expected to be positive.`)
      }

      return new UIntValue(value as number)
   }
}

export class UIntSerializer extends ValueSerializer {
   constructor() {
      super(TypeSet.UInt)
   }

   async toJs(value: IValue): Promise<any> {
      this.validate(value.type)

      let int = value as UIntValue
      return int.value
   }

   async fromJs(type: IType, obj: any): Promise<IValue> {
      this.validate(type)

      if(typeof obj !== 'number') {
         throw new Error(`The JS object type dfoes not match what's expected when serializing`)
      }

      let uint = obj as number

      if(uint < 0) {
         throw new Error(`Encountered a negative value when serializing a UINT value`)
      }

      return new UIntValue(obj as number)
   }
}