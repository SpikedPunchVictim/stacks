import { ModelCreateParams, SymbolEntry } from "./Model"
import { IStackContext } from "./stack/StackContext"
import { IType } from "./values/Type"
import { CreateTypeHandler, TypeSource } from "./values/TypeSource"
import { IValue } from "./values/Value"
import { ValueCreateContext, ValueCreateParams, ValueSource } from "./values/ValueSource"

export type MemberInfo = {
   type: IType | CreateTypeHandler,
   value: MemberValue,
   symbols?: SymbolEntry[]
}

export type MemberValue = ValueCreateParams | MemberInfo

/**
 * This interface represents the data structure storing an individual
 * Member in a Model
 */
export interface IMember {
   readonly id: string
   readonly type: IType
   name: string
   symbols: SymbolEntry[]
   value: IValue
}

export class Member implements IMember {

   get type(): IType {
      return this.value.type
   }

   symbols: SymbolEntry[]
   value: IValue

   constructor(
      readonly id: string,
      readonly name: string,
      value: IValue,
      symbols?: SymbolEntry[]
   ) {
      this.value = value
      this.symbols = symbols || new Array<SymbolEntry>()
   }

   /**
    * Creates an Array of Members from the ModelCreate Parameters
    * 
    * @param params The ModelCreate parameters
    * @param createContext The ValueCreateContext
    * @param context The StackContext
    * @returns An Array of Members based on the ModelCreate
    */
   static create(params: ModelCreateParams, createContext: ValueCreateContext, context: IStackContext): IMember[] {
      let results = new Array<IMember>()

      for (let key of Object.keys(params)) {
         let value = params[key]

         let id = context.uid.generateLocal()

         if(createContext != null && createContext.model != null) {
            let model = createContext.model
            
            let found = model.members.find(m => m.id === id)
            
            while(found !== undefined) {
               id = context.uid.generateLocal()
               found = model.members.find(m => m.id === id)
            }
         }

         if (typeof value === 'function') {
            let resolvedValue = ValueSource.resolve(value, context, createContext)
            results.push(new Member(id, key, resolvedValue))
         } else if (
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean' ||
            Array.isArray(value)
         ) {
            let resolvedValue = ValueSource.resolve(value, context)
            results.push(new Member(id, key, resolvedValue))
         } else if (typeof value === 'object') {
            if (value.type == null) {
               throw new Error(`Encountered an error when building a Model. Failed to determine the Type for ${key}. Ensure 'type' is provided when creating the Model.`)
            }

            if (value.value == null) {
               throw new Error(`Encountered an error when building a Model. Failed to determine the Value for ${key}. Ensure 'value' is provided when creating the Model.`)
            }

            if(typeof value.type !== 'function') {
               throw new Error(`Encountered an error when building a Model. Expected 'type' to be a function for ${key}. Received a ${typeof value.type} instead.`)
            }

            let types = new TypeSource(context)
            let type = value.type(types)

            let subResolve: Exclude<MemberValue, MemberInfo> = value.value as Exclude<MemberValue, MemberInfo>

            let resolvedValue = ValueSource.resolve(subResolve, context, createContext, type)
            let symbols = value.symbols || new Array<SymbolEntry>()

            if(!type.equals(resolvedValue.type)) {
               throw new Error(`Encountered an error when determining a Model's type. The default values provided do not match the type provided for ${key}.`)
            }

            results.push(new Member(id, key, resolvedValue, symbols))
         }
         else {
            throw new Error(`Unsupported value when resolving a type: ${typeof value}`)
         }
      }

      return results
   }
}