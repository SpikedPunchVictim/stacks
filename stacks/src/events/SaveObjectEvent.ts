import { StackObject } from "../StackObject";
import { IModel } from "../Model";
import { Event, EventSet } from "./Event";
import { IProxyObject } from "../ProxyObject";

export class SaveObjectEvent<T extends StackObject> extends Event {
   constructor(readonly model: IModel, readonly obj: T, readonly serialize: IProxyObject) {
      super(EventSet.ObjectSaved)
   }
}