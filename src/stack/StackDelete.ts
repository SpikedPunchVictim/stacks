
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
   object<T>(modelName: string, object: T): Promise<void>
}

export class StackDelete implements IStackDelete {
   model(name: string): Promise<void> {
      throw new Error("Method not implemented.");
   }
   
   object<T>(modelName: string, object: T): Promise<void> {
      throw new Error("Method not implemented.");
   }
}