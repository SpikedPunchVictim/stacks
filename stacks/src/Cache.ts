import { StackObject } from "./StackObject";
import { IModel } from "./Model";


export interface ICache {
   deleteModel(name: string): void
   getModel(name: string): IModel | undefined
   getModelById(id: string): IModel | undefined
   hasId(id: string): boolean
   saveModel(model: IModel): void
   saveObject<T extends StackObject>(model: IModel, obj: T): void
   deleteObject<T extends StackObject>(model: IModel, obj: T): void
   getObject<T extends StackObject>(model: IModel, id: string): T | undefined
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
      let objects = this.objects.get(model.name)

      if(objects === undefined) {
         objects = new Array<any>()
         this.objects.set(model.name, objects)
      }

      let found = objects.findIndex(o => o.id === obj.id)

      if(found === undefined) {
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

      if(found === undefined) {
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