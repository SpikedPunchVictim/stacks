import { StackObject } from "../StackObject";
import { IModel } from "../Model";
import { Event, EventSet, ExistState } from "./Event";
import { IProxyObject } from "../ProxyObject";


export class ObjectUpdateEvent<T extends StackObject> extends Event {
   get updated(): T | undefined {
      return this._updated
   }

   set updated(value: T | undefined) {
      if(value == null) {
         return
      }

      this._updated = value
      this._exists = ExistState.Exists
   }

   get exists(): ExistState {
      return this._exists
   }

   set exists(value: ExistState) {
      if(value == ExistState.DoesNotExist && this._exists == ExistState.Exists) {
         return
      }

      if(value == ExistState.Unset) {
         throw new Error(`Cannot set the 'Unset' ExistState on a value from outside of the Event. This is a reserved state for a virgin Event.`)
      }

      this._exists = value
   }

   private _exists: ExistState = ExistState.Unset
   private _updated: T | undefined

   constructor(readonly model: IModel, readonly object: T, readonly serialize: IProxyObject) {
      super(EventSet.ObjectUpdated)
   }
}