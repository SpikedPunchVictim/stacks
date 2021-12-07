import { ValueSerializer } from "../serialize/ValueSerializer";
import { BasicType, IType, TypeSet, ValidateResult } from "./Type";
import { BasicValue, IValue } from "./Value";

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

   clone(): IValue {
      return new IntValue(this.value)
   }

   async deserialize(value: any): Promise<IValue> {
      if(typeof value !== 'number') {
         throw new Error(`Cannot deserialize a ${typeof value}. Expected a number`)
      }

      return new IntValue(value as number)
   }
}

export class IntSerializer extends ValueSerializer {
   constructor() {
      super(TypeSet.Int)
   }

   async toJs(value: IValue): Promise<any> {
      this.validate(value.type)

      let int = value as IntValue
      return int.value
   }

   async fromJs(type: IType, obj: any): Promise<IValue> {
      this.validate(type)

      if(typeof obj !== 'number') {
         throw new Error(`The JS object type does not match what's expected when serializing`)
      }

      return new IntValue(obj as number)
   }
}