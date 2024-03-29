import { isEnum } from "../utils/Objects"

export enum TypeSet {
   Bool = 'bool',
   Int = 'int',
   List = 'list',
   ObjectRef = 'object-reference',
   String ='string',
   UInt = 'uint'
}

/**
 * Tracks multiple errors in a Validation call
 */
export class ValidationReport {
   readonly results: ValidateResult[] = new Array<ValidateResult>()

   get success(): boolean {
      return this.results.every(it => it.success == true)
   }

   constructor() {

   }

   addError(error: Error): void {
      this.results.push({
         success: false,
         error
      })
   }
}

export type ValidateResult = {
   success: boolean
   error?: Error
}

export type TypeInfo = {
   type: TypeSet,
   /**
    * This is set when the Type is a List
    */
   itemType?: TypeInfo
   /**
    * This is set when the Type is an ObjectRef
    */
   modelName?: string
}

export interface IType {
   readonly type: TypeSet

   readonly info: TypeInfo

   /**
    * Determines if another Type is equal
    * 
    * @param other The value to test
    */
   equals(other: IType): boolean

   /**
    * Validates that a ProxyObject's value matches the Type. 
    * 
    * Note: Validation is not performed when setting
    * the Value since we want that to remain synchronous.
    * We trust the developer to put the correct safeguards
    * in place in order for us to make the API easy to
    * work with. It allows us to use Proxies.
    * 
    * @param obj The JS object to validate
    */
   validate<T>(obj: T): Promise<ValidateResult>
}

export abstract class Type implements IType {
   readonly type: TypeSet

   get info(): TypeInfo {
      throw new Error("Property not supported")
   }

   constructor(type: TypeSet) {
      this.type = type
   }

   static isType(obj: IType): boolean {
      return (obj.equals != null) && 
         (obj.validate != null) &&
         (obj.type != null && isEnum<TypeSet>(TypeSet, obj.type))
   }

   equals(other: IType): boolean {
      throw new Error("Method not implemented.")
   }

   validate<T>(obj: T): Promise<ValidateResult> {
      throw new Error(`validate() not implemented`)
   }
}

export abstract class BasicType<T> implements IType {
   readonly type: TypeSet

   get info(): TypeInfo {
      return {
         type: this.type
      }
   }

   constructor(type: TypeSet) {
      this.type = type
   }

   equals(other: IType): boolean {
      return other.type == this.type
   }

   validate<T>(obj: T): Promise<ValidateResult> {
      throw new Error(`validate() not implemented`)
   }
}