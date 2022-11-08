import { IMember, IModel, IStack, SymbolEntry } from "@spikedpunch/stacks";

export type SymbolValueMap = {
   model: {
      prefix: string,
      defaults: {
         [key: string]: any
      }
   },
   members: {
      prefix: string,
      defaults: {
         [key: string]: any
      }
   }
}

type CachedEntry = {
   id: string
   values: any
}


type CachedSymbols = {
   model: CachedEntry
   members: CachedEntry[]
}

/**
 * This class assists in gathering Symbols from Models and Members, and
 * makes them easier to query and use.
 */
export class SymbolTable {
   /*
      Key: Model ID
      Value: Symbol Map
   */
   private cache: Map<string, CachedSymbols> = new Map<string, CachedSymbols>()

   constructor() {

   }

   getModelSymbols<T>(modelId: string): T | undefined {
      let found = this.cache.get(modelId)

      if(found === undefined) {
         return undefined
      }

      return found.model.values as T
   }

   getMemberSymbols<T>(modelId: string, memberId: string): T | undefined {
      let found = this.cache.get(modelId)

      if(found === undefined) {
         return undefined
      }

      let entry = found.members.find(it => it.id === memberId)

      if(entry === undefined) {
         return undefined
      }

      return entry.values as T
   }

   async collect(stack: IStack, map: SymbolValueMap): Promise<void> {
      this.cache.clear()

      for(let model of stack.get.models()) {
         let cacheEntry: CachedSymbols = {
            model: {
               id: model.id,
               values: {}
            },
            members: new Array<CachedEntry>()
         }

         cacheEntry.model.values = await this.collectSymbols(model.symbols, map.model.prefix, map.model.defaults, model)
   
         for(let member of model.members) {
            cacheEntry.members.push({
               id: member.id,
               values: await this.collectSymbols(member.symbols, map.members.prefix, map.members.defaults, member)
            })
         }
         
         this.cache.set(model.id, cacheEntry)
      }
   }

   /**
    * Collects the Symbol data in a Symbol Collection
    * 
    * @param symbols Symbol collection
    * @param prefix The prefix of the symbols to collect
    * @param map Map of default values, where the keys match the name field keys, minus the prefix
    * @param context Context that is used when creating dynamic values
    */
   private async collectSymbols(symbols: SymbolEntry[], prefix: string, map: any, context?: IModel | IMember): Promise<any> {
      let result = {}

      for (let key of Object.keys(map)) {
         let id = `${prefix}${key}`.toLowerCase()

         let found = symbols.filter(it => it.name.toLowerCase() === id)

         if (found.length == 0) {
            if(typeof map[key] === 'function') {
               result[key] = await map[key](context)
            } else {
               result[key] = map[key]
            }
         } else {
            if (found.length == 1) {
               if(typeof map[key] === 'function') {
                  result[key] = await map[key](context)
               } else {
                  result[key] = map[key]
               }
            } else {
               // More than 1 result found
               if (!Array.isArray(map[key])) {
                  throw new Error(`Received too many Symbols "${id}". Ensure only one is provided.`)
               }

               // If the default is an Array, then it's accepted
               let array = new Array<any>()

               for(let symbol of found) {
                  if(typeof symbol.value === 'function') {
                     array.push(await symbol.value(context))
                  } else {
                     array.push(symbol.value)
                  }
               }

               result[key] = array
            }
         }
      }

      return result
   }
}