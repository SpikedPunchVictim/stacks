import { uid } from 'uid/secure'
import { IStack } from './stack/Stack'

/**
 * This class is responsible for generating IDs for the objects
 */
export interface IUidKeeper {
   /**
    * Attahces the Stack to this UidKeeper
    * 
    * @param stack The Stack
    */
   attach(stack: IStack): void

   /**
    * Generates a unique ID
    */
   generate(): Promise<string>

   /**
    * Generates an ID used locally. These are used for Model Members
    * where they are not expected to be consistent between runs.
    */
   generateLocal(): string
   
   /**
    * Determines if an ID has already been reserved.
    * 
    * @param id The ID to check
    */
   has(id: string): Promise<boolean>

   /**
    * Registers an ID with the UidKeeper. Registered IDs won't be used again
    * 
    * @param id The id to register
    */
   register(id: string): Promise<void>

   /**
    * Unregisters an ID with the UidKeeper.
    * 
    * @param id The id to unregister
    */
   unregister(id: string): Promise<void>
}

export class UidKeeper implements IUidKeeper {
   get stack(): IStack | undefined {
      return this._stack
   }
   
   private ids: Array<string> = new Array<string>()
   private _stack: IStack | undefined = undefined

   constructor() {

   }

   attach(stack: IStack): void {
      this._stack = stack
   }

   async generate(): Promise<string> {
      let id = uid(32)

      while(await this.has(id)) {
         id = uid(32)
      }

      return id
   }

   generateLocal(): string {
      return uid(32)
   }

   async has(id: string): Promise<boolean> {
      if(this.ids.indexOf(id) >= 0) {
         return true
      }

      return this.stack === undefined ? false : await this.stack.hasId(id)
   }


   async register(id: string): Promise<void> {
      if(this.ids.indexOf(id) >= 0) {
         return
      }

      this.ids.push(id)
   }

   async unregister(id: string): Promise<void> {
      let index = this.ids.indexOf(id)
      
      if(index < 0) {
         return
      }

      this.ids.splice(index, 1)
   }
}