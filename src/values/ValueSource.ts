import { ModelCreateContext } from "../Model";
import { IStackContext } from "../stack/StackContext";
import { BoolValue } from "./Bool";
import { IntValue } from "./Int";
import { ListValue } from "./List";
import { ObjectRefValue } from "./ObjectRef";
import { StringValue } from "./String";
import { IType } from "./Type";
import { UIntValue } from "./UInt";
import { IValue } from "./Value";

export type CreateValueHandler = (value: ValueSource) => IValue
export type ValueCreateParams = boolean | number | string | CreateValueHandler

export type NormalizedType = {
   [key: string]: IType
}

export interface IValueSource {
   bool(value: boolean): BoolValue
   int(value: number): IntValue
   list(itemType: IType): ListValue

   // TODO: Add ref(model: IModel) version
   ref(modelName: string, id: string): ObjectRefValue
   string(value: string): StringValue
   uint(value: number): UIntValue
}

export class ValueSource implements IValueSource {

   constructor(readonly context: IStackContext) {

   }

   static resolve(
      source: ValueCreateParams,
      context: IStackContext,
      createContext?: ModelCreateContext
   ): IValue {
      let values = new ValueSource(context)

      if (typeof source === 'function') {
         let bindSource =  {}

         if(createContext != null) {
            bindSource = createContext
         }

         let value = source.bind(bindSource, values)()

         if (!Array.isArray(value)) {
            return value
         }

         let cast = value as Array<IValue>

         if (cast.length == 0) {
            throw new Error(`Encountered an error when determining the Type of a value. Received an empty Array. Array notation can only be used if it contains at least 1 element.`)
         }

         let firstType = cast[0].type

         let allTypesEqual = cast.every(it => firstType.equals(it.type))

         if (!allTypesEqual) {
            throw new Error(`Encountered an error when determinging the Type of a value. When specifying a List Type using Array notation, all Types in the Array must be the same.`)
         }

         let list = new ListValue(firstType)
         list.push(...cast)

         return list
      } else if (typeof source === 'string') {
         return values.string(source)
      } else if (typeof source === 'number') {
         let cast = source as number

         if(cast >= 0) {
            return values.uint(source)
         } else {
            return values.int(source)
         }
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

   list(itemType: IType): ListValue {
      return new ListValue(itemType)
   }

   // TODO: Add ref(model: IModel) version
   ref(modelName: string, id: string): ObjectRefValue {
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