import { StackObject } from "./StackObject";
import { IModel } from "./Model";
import { UidKeeper } from "./UidKeeper";


export interface ICache {
   /**
    * Deletes a Model from the cache
    * 
    * @param name The Model's name
    */
   deleteModel(name: string): void

   /**
    * Gets a Model by name
    * 
    * @param name The Model's name
    */
   getModel(name: string): IModel | undefined

   /**
    * Gets a Model by ID
    * 
    * @param id The Model's ID
    */
   getModelById(id: string): IModel | undefined

   /**
    * Searches the Cache for an ID
    * 
    * @param id The ID to search for
    */
   hasId(id: string): boolean

   /**
    * Stores a Model in the cache
    * 
    * @param model The Model to store
    */
   saveModel(model: IModel): void

   /**
    * Stores an Object in the cache
    * 
    * @param model The Object's Model
    * @param obj The Object to Store. This is an ProxyObject
    */
   saveObject<T extends StackObject>(model: IModel, obj: T): void

   /**
    * Deletes an Object from the cache
    * 
    * @param model The Object's Model
    * @param obj The Object to delete
    */
   deleteObject<T extends StackObject>(model: IModel, obj: T): void

   /**
    * Gets an Object (ProxyObject) from the Cache
    * 
    * @param model The Object's Model
    * @param id The Object's ID
    */
   getObject<T extends StackObject>(model: IModel, id: string): T | undefined

   /**
    * Gets many Objects (ProxyObjects) from the cache based on the Model
    * 
    * @param model The Model of the Objects
    */
   getObjects<T extends StackObject>(model: IModel): T[]
}

export class Cache implements ICache {
   /**
    * Key: Model name
    * Value: Model
    */
   private models: Map<string, IModel> = new Map<string, IModel>()

   /**
    * Key: Model Name
    * Value: Object
    */
   private objects: Map<string, any[]> =  new Map<string, any[]>()

   constructor() {

   }

   deleteModel(name: string): void {
      this.models.delete(name)
   }

   getModel(name: string): IModel | undefined {
      return this.models.get(name)
   }

   getModelById(id: string): IModel | undefined {
      for(let model of this.models.values()) {
         if(model.id === id) {
            return model
         }
      }

      return undefined
   }

   hasId(id: string): boolean {
      let model = this.getModelById(id)

      if(model) {
         return true
      }

      for(let [_, objects] of this.objects) {
         let found = objects.find(o => o.id === id)

         if(found) {
            return true
         }
      }

      return false
   }

   saveModel(model: IModel): void {
      this.models.set(model.name, model)
   }
   
   saveObject<T extends StackObject>(model: IModel, obj: T): void {
      if(obj.id === UidKeeper.IdNotSet) {
         /*
            Objects must have IDs in order for them to be cached.
            We would have no way to look them up from the cache.
            This means that an Object can be created, before it is
            saved, and the get() calls will not work on them to
            find the Object.
         */
         throw new Error(`Cannot cache an Object without an ID`)
      }

      let objects = this.objects.get(model.name)

      if(objects === undefined) {
         objects = new Array<any>()
         this.objects.set(model.name, objects)
      }

      let found = objects.findIndex(o => o.id === obj.id)

      if(found === -1) {
         objects.push(obj)
         return
      }

      objects.splice(found, 1)
      objects.push(obj)
   }

   deleteObject<T extends StackObject>(model: IModel, obj: T): void {
      let objects = this.objects.get(model.name)

      if(objects === undefined) {
         return
      }

      let found = objects.findIndex(o => o.id === obj.id)

      if(found === -1) {
         return
      }

      objects.splice(found, 1)
   }

   getObject<T extends StackObject>(model: IModel, id: string): T | undefined {
      let objects = this.objects.get(model.name)

      if(objects === undefined) {
         return undefined
      }

      return objects.find(o => o.id === id)
   }

   getObjects<T extends StackObject>(model: IModel): T[] {
      let objects = this.objects.get(model.name)
      return objects || new Array<T>()
   }
}