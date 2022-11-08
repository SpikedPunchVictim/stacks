import { StackObject } from "../StackObject";
import { IModel } from "../Model";
import { Event, EventSet } from "./Event";
import { IProxyObject } from "../ProxyObject";

export class ObjectSaveEvent<T extends StackObject> extends Event {
   constructor(readonly model: IModel, readonly object: T, readonly serialize: IProxyObject) {
      super(EventSet.ObjectSaved)
   }
}