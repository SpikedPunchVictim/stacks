import { IModel } from "../Model";
import { Event, EventSet } from "./Event";

export class CreateModelEvent extends Event {
   constructor(readonly model: IModel) {
      super(EventSet.ModelCreated)
   }
}