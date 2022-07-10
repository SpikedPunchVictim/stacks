import { StackObject } from "..";
import { IModel, ModelCreateParams, ObjectCreateParams } from "../Model";
import { IOrchestrator } from "../orchestrator/Orchestrator";
import { IStackContext } from "./StackContext";
import { IStackGet } from "./StackGet";

export interface IStackCreate {
   /**
    * Creates a Model
    * 
    * @param name The name of the Model
    * @param obj The initialized values
    */
   model(name: string, obj?: ModelCreateParams): Promise<IModel>

   /**
    * Creates an Object based on a Model
    * 
    * @param modelName The name of the Model used to create the Object
    */
   object<T extends StackObject>(modelName: string, obj: ObjectCreateParams): Promise<T>
}

export class StackCreate implements IStackCreate {
   private get orchestrator(): IOrchestrator {
      return this.context.orchestrator
   }

   constructor(readonly get: IStackGet, readonly context: IStackContext) {

   }

   async model(name: string, params: ModelCreateParams = {}): Promise<IModel> {
      return this.orchestrator.createModel(name, params)
   }

   async object<T extends StackObject>(modelName: string, obj: ObjectCreateParams): Promise<T> {
      let model = await this.get.model(modelName)

      if(model === undefined) {
         throw new Error(`No Model has been found with the name ${modelName}`)
      }

      return await model.create<T>(obj)
   }   
}