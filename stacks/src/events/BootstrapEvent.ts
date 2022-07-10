import { Event, EventSet } from "./Event";

export class BootstrapEvent extends Event {
   constructor() {
      super(EventSet.Bootstrap)
   }
}