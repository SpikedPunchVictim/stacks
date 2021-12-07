import { IStackContext } from "../stack/StackContext";
import { BoolType } from "./Bool";
import { IntType } from "./Int";
import { ListType } from "./List";
import { ObjectRefType } from "./ObjectRef";
import { StringType } from "./String";
import { IType, Type } from "./Type";
import { UIntType } from "./UInt";

export type TypeCreateParams = boolean | number | string | any[] | IType | CreateTypeHandler

export type CreateTypeHandler = (converter: TypeSource) => IType

export interface ITypeSource {
   readonly bool: BoolType
   readonly int: IntType
   readonly uint: UIntType
   readonly string: StringType
   
   list(itemType: IType): IType
   ref(modelName: string): IType
}

export class TypeSource {
   readonly bool: BoolType = BoolType.Singleton
   readonly int: IntType = IntType.Singleton
   readonly uint: UIntType = UIntType.Singleton
   readonly string: StringType = StringType.Singleton

   constructor(
      private readonly context: IStackContext
   ) {

   }

   /**
    * Resolves a Type based on the raw Type data.
    * 
    * Supported cases
    *    : Bool - BoolType, & true/false
    *    : Int - 
    *       * IntType
    *       * A number. All raw numbers are assigned the Int Type
    *    : List
    *       * ListType
    *       * A JS Array [] with 1 element. The first (and only) element determines the List ItemType.
    *    : ObjectRef
    *       * ObjectRefType
    *    : String
    *       * StringType
    *       * Raw string
    *    : UInt
    *       * UIntType
    *    : CreateTypeHandler which resolves to the Type
    * 
    * 
    * @param source The raw Type information
    * @param context Stack Context
    * @returns The Type
    */
   static resolve(source: TypeCreateParams, context: IStackContext): IType {
      let types = new TypeSource(context)

      if (typeof source === 'function') {
         return source(types)
      } else if (Array.isArray(source)) {
         let array = source as any[]

         if(array.length == 0) {
            throw new Error(`Error resolving a Type. At least one item must be present in the Array to determine the List ItemType when resolving ${source}.`)
         }

         let itemType = TypeSource.resolve(array[0], context)

         return new ListType(itemType)

      } else if(typeof source === 'object') {
         if(!Type.isType(source)) {
            throw new Error(`Error resolving a Type. Expected a Type Obejct but received something else instead.`)
         }

         return source      
      } else if (typeof source === 'string') {
         return types.string
      } else if (typeof source === 'number') {
         return types.int
      } else if (typeof source === 'boolean') {
         return types.bool
      } else {
         throw new Error(`Unsupported source when resolving a type: ${typeof source}`)
      }
   }

   list(itemType: TypeCreateParams): IType {
      let item = TypeSource.resolve(itemType, this.context)
      return new ListType(item)
   }

   ref(modelName: string): IType {
      return new ObjectRefType(modelName, this.context)
   }
}