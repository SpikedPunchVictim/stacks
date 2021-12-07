import { IType } from "./Type";

export interface IValue {
   readonly type: IType

   /**
    * Makes a clone of this Value
    */
   clone(): IValue

   /**
    * Determines if this value and another value are equal
    * 
    * @param other The other value to compare
    */
   equals(other: IValue): boolean
   
   /**
    * Sets the value to the new value.
    * 
    * Note: This is not an async function. Setting values
    * should be synchronous. Any validation should be done
    * when validate() is called.
    * @param value The value to set
    */
   set(value: IValue): IValue
}

export abstract class Value implements IValue {
   readonly type: IType;

   constructor(type: IType) {
      this.type = type
   }

   clone(): IValue {
      throw new Error(`clone() not implemented`)
   }

   equals(other: IValue): boolean {
      if(!this.type.equals(other.type)) {
         return false
      }

      return true
   }

   set(value: IValue): IValue {
      throw new Error("set() not implemented.");
   }
}

export abstract class BasicValue<T> extends Value {
   get value(): T {
      return this._value
   }

   private _value: T

   constructor(type: IType, value: T) {
      super(type)
      this._value = value
   }

   clone(): IValue {
      throw new Error(`clone() not implemented`)
   }

   set(value: IValue): IValue {
      if(!this.type.equals(value.type)) {
         throw new Error(`Incompatible type encountered when trying to set a Value`)
      }

      this._value = (value as BasicValue<T>).value
      return this
   }
}