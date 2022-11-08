import { IModel } from "../Model";
import { EventSet, Event } from "./Event";

export class HasIdEvent extends Event {
   get attemptedSet(): boolean {
      return this._attemptedSet
   }

   get hasId(): boolean {
      return this._hasId
   }

   set hasId(value: boolean) {
      this._attemptedSet = true

      // If it has already been set by a plugin, we leave it set
      if(this._hasId) {
         return
      }
   }

   private _hasId: boolean = false
   private _attemptedSet: boolean = false

   constructor(readonly id: string, readonly model: IModel) {
      super(EventSet.HasId)
   }
}