import { StackObject } from "../StackObject";
import { ICache } from "../Cache";
import { IModel } from "../Model";
import { IOrchestrator } from "../orchestrator/Orchestrator";
import { IStackContext } from "./StackContext";

export interface IStackGet {
   /**
    * Gets a Model by name
    * 
    * @param name The name of the Model
    */
   model(name: string): Promise<IModel | undefined>
   
   /**
    * Gets a Model by ID
    * 
    * @param id The Model's ID
    */
   modelById(id: string): Promise<IModel | undefined>
   
   /**
    * Gets all Models
    */
   models(): IModel[]

   /**
    * Gets a Model's Object
    * 
    * @param modelName Model's name
    * @param id The Object's ID
    */
   object<T extends StackObject>(modelName: string, id: string): Promise<T | undefined>
}

export class StackGet implements IStackGet {
   get cache(): ICache {
      return this.context.cache
   }

   get orchestrator(): IOrchestrator {
      return this.context.orchestrator
   }

   constructor(readonly context: IStackContext) {

   }

   async model(name: string): Promise<IModel | undefined> {
      return this.cache.getModel(name)
   }

   async modelById(id: string): Promise<IModel | undefined> {
      return this.cache.getModelById(id)
   }

   models(): IModel[] {
      return this.cache.models
   }

   async object<T extends StackObject>(modelName: string, id: string): Promise<T | undefined> {
      let model = this.cache.getModel(modelName)

      if(model === undefined) {
         throw new Error(`Encountered an error when retrieving an object. No Model with the name ${modelName} exists.`)
      }

      return this.orchestrator.getObject<T>(model, id)
   }   
}