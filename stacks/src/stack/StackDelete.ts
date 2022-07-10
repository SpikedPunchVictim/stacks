import { StackObject } from "..";
import { ICache } from "../Cache";
import { IOrchestrator } from "../orchestrator/Orchestrator";

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
   constructor(readonly cache: ICache, readonly orchestrator: IOrchestrator) {

   }

   async model(name: string): Promise<void> {
      let model = this.cache.getModel(name)

      if(model === undefined) {
         return
      }

      return this.orchestrator.deleteModel(model)
   }
   
   async object<T extends StackObject>(modelName: string, object: T): Promise<void> {
      let model = this.cache.getModel(modelName)

      if(model === undefined) {
         return
      }

      await model.delete(object)
   }
}