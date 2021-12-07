import { IModel } from "../Model";
import { Event, EventSet, ExistState } from "./Event";

export class GetObjectEvent<T> extends Event {
   /**
    * The serialized version of the Object
    */
   get object(): T | undefined {
      return this._object
   }

   set object(value: T | undefined) {
      if(value === undefined) {
         return
      }

      this._object = value
      this.exists = ExistState.Exists
   }

   exists: ExistState = ExistState.Unset

   private _object: T | undefined = undefined

   constructor(readonly model: IModel, readonly id: string) {
      super(EventSet.GetObject)
   }
}