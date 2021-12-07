import { Event, EventSet, IEvent } from "./Event"

export type EventHandler<T extends IEvent> = (action: T) => Promise<void>

type MonitorStatus = {
   success: boolean
   error?: Error
}

export interface IEventRouter {
   on<T extends IEvent>(type: string, handler: EventHandler<T>): void
   raise(action: IEvent): Promise<void>
}

export class EventRouter implements IEventRouter {

   // Key: Event name
   // Value: The ActionHandler<T>
   private _handlerMap: Map<string, Array<EventHandler<any>>>

   constructor() {
      this._handlerMap = new Map<string, Array<EventHandler<any>>>()
   }

   on<T extends IEvent>(type: EventSet, handler: EventHandler<T>): void {
      let found = this._handlerMap.get(type)

      if (found === undefined) {
         let array = new Array<EventHandler<T>>()
         array.push(handler)
         this._handlerMap.set(type, array)
      } else {
         found.push(handler)
      }
   }

   async raise(event: IEvent): Promise<void> {
      await this.raiseAction(event)
   }

   async raiseAction(event: IEvent): Promise<void> {
      try {
         let found = this._handlerMap.get(event.type)

         if (found === undefined) {
            return
         }

         let promises = new Array<Promise<MonitorStatus>>()

         for (let handler of found) {
            promises.push(this.monitor(handler(event)))
         }

         let statuses = await Promise.all(promises)

         // Rollback in the case of a failure
         if(!statuses.every(status => status.success)) {
            (event as Event).rollback()

            for (let handler of found) {
               promises.push(this.monitor(handler(event)))

               // TODO: Log/Promote failures when rollingback
               await Promise.all(promises)
            }
         }

      } catch (err) {
         console.log(`REMOVE THESE LOGS AFTER DEVELOPMENT`)
         console.error(err)
         throw err
      }
   }

   private async monitor(promise: Promise<void>): Promise<MonitorStatus> {
      try {
         await promise
         return {
            success: true
         }
      } catch(err) {
         return {
            success: false,
            error: err as Error
         }
      }
   }
}