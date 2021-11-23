import { IModel, PageRequest, PageResponse } from "../Model";
import { Event, EventSet } from "./Event";


export class GetManyObjectsEvent<T> extends Event {
   results: PageResponse<T> | undefined = undefined

   constructor(readonly model: IModel, readonly options: PageRequest) {
      super(EventSet.GetManyObjects)
   }
}