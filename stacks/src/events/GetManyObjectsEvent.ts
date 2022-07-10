import { IModel, PageRequest, PageResponse } from "../Model";
import { Event, EventSet } from "./Event";

export class GetManyObjectsEvent<T> extends Event {
   results: PageResponse<T> | undefined = undefined

   /**
    * Gets a flag that determines if the provided cursor was found.
    * The default beahvior when the cursor is not found is to return
    * data from the beginning of the set.
    */
   wasCursorFound: boolean = false

   constructor(readonly model: IModel, readonly options: PageRequest) {
      super(EventSet.GetManyObjects)
   }
}