import { IModel } from "../Model";
import { Event, EventSet } from "./Event";

export class DeleteModelEvent extends Event {
   constructor(readonly model: IModel) {
      super(EventSet.ModelDeleted)
   }
}