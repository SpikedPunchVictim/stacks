import { StackObject } from "..";
import { ICache } from "../Cache";
import { IModel } from "../Model";
import { IOrchestrator } from "../orchestrator/Orchestrator";
import { IStackContext } from "./StackContext";

export interface IStackGet {
   model(name: string): Promise<IModel | undefined>
   modelById(id: string): Promise<IModel | undefined>
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

   async object<T extends StackObject>(modelName: string, id: string): Promise<T | undefined> {
      let model = this.cache.getModel(modelName)

      if(model === undefined) {
         throw new Error(`Encountered an error when retrieving an object. No Model with the name ${modelName} exists.`)
      }

      return this.orchestrator.getObject<T>(model, id)
   }   
}