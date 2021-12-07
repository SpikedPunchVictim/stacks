import { StackObject } from "..";
import { ICache } from "../Cache";

export interface IStackDelete {
   /**
    * Deletes a Model and all Objects associated with the Model
    * 
    * @param name The name of the Model to delete
    */
   model(name: string): Promise<void>

   /**
    * Deletes an Object
    * 
    * @param object The Object to delete
    */
   object<T extends StackObject>(modelName: string, object: T): Promise<void>
}

export class StackDelete implements IStackDelete {
   constructor(readonly cache: ICache) {

   }

   async model(name: string): Promise<void> {
      this.cache.deleteModel(name)
   }
   
   async object<T extends StackObject>(modelName: string, object: T): Promise<void> {
      let model = this.cache.getModel(modelName)

      if(model === undefined) {
         return
      }

      this.cache.deleteObject(model, object)
   }
}