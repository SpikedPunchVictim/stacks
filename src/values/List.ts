import { IType, Type, TypeSet, ValidateResult } from "./Type"
import { IValue, Value } from "./Value"


export class ListType extends Type {
   constructor(readonly itemType: IType) {
      super(TypeSet.List)
   }

   equals(other: IType): boolean {
      if(other.type !== TypeSet.List) {
         return false
      }

      let cast = other as ListType

      if(!this.itemType.equals(cast.itemType)) {
         return false
      }

      return true
   }

   async validate<T>(obj: T): Promise<ValidateResult> {
      if(!Array.isArray(obj)) {
         return { success: false, error: new Error(`Type does not match. Expected 'Array' but receieved '${typeof obj}' instead.`)}
      }

      let array = obj as Array<T>

      for(let i = 0; i < array.length; ++i) {
         let valid = await this.itemType.validate(array[i])

         if(valid.success == false) {
            return { success: false, error: new Error(`Encountered an error when validating the items in a List. Reason: ${valid.error}`)}
         }
      }

      return { success: true }
   }
}

export class ListValue extends Value {
   private items: Array<IValue> = new Array<IValue>()
   
   constructor(readonly itemType: IType) {
      super(new ListType(itemType))
   }

   [Symbol.iterator](): Iterator<IValue> {
      let index = 0
      let self = this
      return {
         next(): IteratorResult<IValue> {
            return index == self.items.length ?
               { value: undefined, done: true } :
               { value: self.items[index++], done: false }
         }
      }
   }

   at(index: number): IValue | undefined {
      return this.items.at(index)
   }

   clear(): void {
      this.items.splice(0, this.items.length)
   }

   equals(other: IValue): boolean {
      if(!this.type.equals(other.type)) {
         return false
      }

      let list = other as ListValue

      if(list.items.length != this.items.length) {
         return false
      }

      for(let i = 0; i < this.items.length; ++i) {
         let thisItem = this.items[i]
         let otherItem = list.items[i]

         if(!thisItem.equals(otherItem)) {
            return false
         }
      }

      return true      
   }

   push(...items: IValue[]): number {
      return this.items.push(...items)
   }

   set(value: IValue): IValue {
      if(!this.type.equals(value.type)) {
         throw new Error(`Cannot set a List Value with a different type. Encountered ${value.type.type} when setting the value of a List.`)
      }

      let list = value as ListValue

      this.items.splice(0, this.items.length)
      this.items.push(...list.items)

      return this
   }

   async toJs(): Promise<any> {
      let results = new Array<any>()

      for(let i = 0; i < this.items.length; ++i) {
         results.push(await this.items[i].toJs())
      }

      return results
   }
}