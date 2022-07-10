import { IModel } from "../Model";
import { Event, EventSet } from "./Event";


export class UpdateModelEvent extends Event {
   constructor(readonly model: IModel) {
      super(EventSet.ModelUpdated)
   }
}