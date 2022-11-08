import { StoreContext } from "../stack/Stack"
import { Event, EventSet } from "./Event"


export class GetStoreContextEvent extends Event {
   readonly contexts: StoreContext[] = new Array<StoreContext>()

   constructor() {
      super(EventSet.GetStoreContext)
   }
}