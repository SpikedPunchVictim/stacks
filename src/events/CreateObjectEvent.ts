import { StackObject } from "../BondedObject";
import { IModel } from "../Model";
import { Event, EventSet } from "./Event";


export class CreateObjectEvent<T extends StackObject> extends Event {
   constructor(readonly model: IModel, readonly object: T) {
      super(EventSet.ObjectCreated)
   }
}