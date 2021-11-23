import { StackObject } from "..";
import { IModel } from "../Model";
import { Event, EventSet } from "./Event";


export class CommitObjectEvent<T extends StackObject> extends Event {
   constructor(readonly model: IModel, readonly obj: T) {
      super(EventSet.CommitObject)
   }
}