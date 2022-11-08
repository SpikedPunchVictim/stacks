import { IModel } from "../Model";
import { Event, EventSet } from "./Event";

export class ModelCreateEvent extends Event {
   constructor(readonly model: IModel) {
      super(EventSet.ModelCreated)
   }
}