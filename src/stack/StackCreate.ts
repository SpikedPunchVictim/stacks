import { IModel, Model, ModelCreateParams, ObjectCreateParams } from "../Model";
import { IUidKeeper } from "../UidKeeper";
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
   object<T>(modelName: string, obj: ObjectCreateParams): Promise<T>
}

export class StackCreate implements IStackCreate {
   private get uid(): IUidKeeper {
      return this.context.uid
   }

   constructor(readonly get: IStackGet, readonly context: IStackContext) {

   }

   async model(name: string, obj: ModelCreateParams = {}): Promise<IModel> {
      let model = await this.get.model(name)

      if(model !== undefined) {
         throw new Error(`A Model with the name ${name} already exists`)
      }

      let id = await this.uid.generate()

      model = new Model(name, id, this.context)
      await model.append(obj)
      return model
   }

   async object<T>(modelName: string, obj: ObjectCreateParams): Promise<T> {
      let model = await this.get.model(modelName)

      if(model === undefined) {
         throw new Error(`No Model has been found with the name ${modelName}`)
      }

      return await model.create<T>(obj)
   }   
}