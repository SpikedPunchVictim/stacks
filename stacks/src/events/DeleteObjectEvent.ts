import { StackObject } from "../StackObject";
import { IModel } from "../Model";
import { Event, EventSet } from "./Event";


export class DeleteObjectEvent<T extends StackObject> extends Event {
   constructor(readonly model: IModel, readonly object: T) {
      super(EventSet.ObjectDeleted)
   }
}