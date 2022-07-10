import { StackObject } from "../StackObject";
import { ExistState } from "../events/Event";
import { IModel } from "../Model";
import { IOrchestrator } from "../orchestrator/Orchestrator";
import { IStackContext } from "./StackContext";
import { ModelCreateParams } from "..";

export type UpdateObjectHandler<T extends StackObject> = (updated: T | undefined, exist: ExistState) => Promise<void>

export interface IStackUpdate {
   /**
    * Updates a Model
    * 
    * @param model The Model name or the Model to update
    * @param params The values to update
    */
   model(model: string | IModel, params: ModelCreateParams): Promise<void>

   /**
    * Updates an Object
    * 
    * @param model The Object's Model
    * @param object The Object to update
    * @param onUpdate Handler that gets called after the update
    */
   object<T extends StackObject>(model: IModel, object: T, onUpdate: UpdateObjectHandler<T>): Promise<void>
}

export class StackUpdate implements IStackUpdate {
   get orchestrator(): IOrchestrator {
      return this.context.orchestrator
   }

   constructor(readonly context: IStackContext) {

   }

   async model(model: string | IModel, params: ModelCreateParams): Promise<void> {
      if(typeof model === 'string') {
         // Note: We may have to pull this Model from a backend, and not Cache
         let found = this.context.cache.getModel(model)

         if(found === undefined) {
            throw new Error(`Encountered an issue when updating a Model. The Model ${model} does not exist`)
         }

         model = found
      }

      await this.orchestrator.updateModel(model, params)
   }

   async object<T extends StackObject>(model: IModel, object: T, onUpdate: UpdateObjectHandler<T>): Promise<void> {
      await this.orchestrator.updateObject(model, object, onUpdate)
   }
}