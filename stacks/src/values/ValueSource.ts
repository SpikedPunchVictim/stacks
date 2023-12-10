import { TypeSet } from ".";
import { IModel } from "../Model";
import { IStackContext } from "../stack/StackContext";
import { UidKeeper } from "../UidKeeper";
import { BoolValue } from "./Bool";
import { IntValue } from "./Int";
import { ListType, ListValue } from "./List";
import { ObjectRefValue } from "./ObjectRef";
import { StringValue } from "./String";
import { IType } from "./Type";
import { CreateTypeHandler, TypeCreateParams, TypeSource } from "./TypeSource";
import { UIntValue } from "./UInt";
import { IValue } from "./Value";

export type ValueCreateContext = {
   model?: IModel
}

export type CreateValueHandler = (value: IValueSource, ctx?: ValueCreateContext) => IValue | IValue[]
export type ValueCreateParams = boolean | number | string | any[] | CreateValueHandler

export type NormalizedType = {
   [key: string]: IType
}

export interface IValueSource {
   bool(value: boolean): BoolValue
   int(value: number): IntValue
   list(itemType: CreateTypeHandler): ListValue

   // TODO: Add ref(model: IModel) version
   ref(modelName: string, id?: string): ObjectRefValue
   string(value: string): StringValue
   uint(value: number): UIntValue
}

export class ValueSource implements IValueSource {

   constructor(readonly context: IStackContext) {

   }

   /**
    * Wraps an IValueSource in a Proxy. 
    * 
    * Note:
    * This is necessary since it turns out that when we use destructuring
    * for defining Models, the 'this' pointer inside of any methods being called
    * on the IValueSource, loses its scope, and becomes 'undefined'.
    * To work around this, a Proxy is used instead that retains
    * the 'this' pointer regardless how/when destructuring is used. 
    * 
    * @param values The IValueSource to wrap
    * @returns A Proxy'd IValueSource
    */
   static toProxy(values: IValueSource): IValueSource {
      let handler = {
         get(target: IValueSource, property: string): any {
            if(typeof target[property] === 'function') {
               return function(...args: any[]) {
                  return target[property](...args)
               }
            }

            return target[property]
         }
      }

      return new Proxy(values, handler)
   }

   /**
    * Resolves a set of ValueParams into a Value
    * 
    * @param source The ParamS
    * @param context StackContext
    * @param createContext Creation context if available
    * @param coercedType IF the type is known ahead of time, this can help determine the Type mopre accurately
    * @returns 
    */
   static resolve(
      source: ValueCreateParams,
      context: IStackContext,
      createContext?: ValueCreateContext,
      coercedType?: IType
   ): IValue {
      let values = new ValueSource(context)
      let proxiedValues = ValueSource.toProxy(values)

      if (typeof source === 'function') {
         createContext = createContext || {}

         let value = source(proxiedValues, createContext)

         if (!Array.isArray(value)) {
            return value
         }

         let cast = value as IValue[]

         if (cast.length === 0) {
            throw new Error("Encountered an error when determining the Type of a value. Received an empty Array. Array notation can only be used if it contains at least 1 element.")
         }

         let coercedItemType: IType | undefined = undefined

         if(coercedType !== undefined) {
            if(coercedType.type === TypeSet.List) {
               let list = coercedType as ListType
               coercedItemType = list.itemType
            }
         }

         let firstType = coercedItemType || cast[0].type

         let allTypesEqual = cast.every(it => firstType.equals(it.type))

         if (!allTypesEqual) {
            throw new Error("Encountered an error when determinging the Type of a value. When specifying a List Type using Array notation, all Types in the Array must be the same.")
         }

         let list = new ListValue(firstType, context.serializer)
         list.push(...cast)

         return list
      } else if(Array.isArray(source)) {
         let array = source as any[]

         if(array.length === 0) {
            throw new Error(`Error resolving a Value. At least one item must be present in the Array to determine the List ItemType when resolving ${source}.`)
         }

         let coercedItemType: IType | undefined = undefined

         if(coercedType !== undefined) {
            if(coercedType.type === TypeSet.List) {
               let list = coercedType as ListType
               coercedItemType = list.itemType
            }
         }

         let itemType = coercedItemType === undefined ?
            TypeSource.resolve(array[0], context) :
            coercedItemType
         
         let list = new ListValue(itemType, context.serializer)

         if(itemType.type !== TypeSet.ObjectRef) {
            list.push(...array.map(it => ValueSource.resolve(it, context)))            
         }
   
         return list
      } else if (typeof source === 'string') {
         return values.string(source)
      } else if (typeof source === 'number') {
         return values.int(source)
      } else if (typeof source === 'boolean') {
         return values.bool(source)
      } else {
         throw new Error(`Unsupported source when resolving a type: ${typeof source}`)
      }
   }

   bool(value: boolean = true): BoolValue {
      return new BoolValue(value)
   }

   int(value: number = 0): IntValue {
      return new IntValue(value)
   }

   // TODO: Extend the options here
   list(itemType: TypeCreateParams): ListValue {
      let type = TypeSource.resolve(itemType, this.context)
      return new ListValue(type, this.context.serializer)
   }

   // TODO: Add ref(model: IModel) version
   ref(modelName: string, id: string = UidKeeper.IdNotSet): ObjectRefValue {
      return new ObjectRefValue(modelName, id, this.context)
   }

   string(value: string = ''): StringValue {
      return new StringValue(value)
   }

   uint(value: number = 0): UIntValue {
      if (value < 0) {
         throw new Error(`When creating a UInt value, the number must not be negative`)
      }

      return new UIntValue(value)
   }
}