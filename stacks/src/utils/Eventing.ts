import { EventEmitter } from "events";

export type EmitInfo = {
   source: EventEmitter | ICombinedEventEmitter,
   event: string,
   data: any
}

export type AsyncEmitInfo = {
   event: string,
   data: any
}

export type EventBusHandler = (data: any) => void
export type AsyncEventBusHandler = (data: any) => Promise<void>

/**
 * Emits events from multiple objects. It will emit the event for
 * an EventEmitter and ICombinedEventEmitter source. 
 * 
 * @param info The Event Info used to emit an event from multiple sources
 */
export async function emit(info: EmitInfo[]): Promise<void> {
   for(let ev of info) {
      if(CombinedEventEmitter.isCombinedEventEmitter(ev.source)) {
         let combined = ev.source as ICombinedEventEmitter
         await combined.emit(ev.event, ev.data)
         continue
      }

      ev.source.emit(ev.event, ev.data)
   }
}

export async function emitAsync(eventBus: IAsyncEventEmitter, info: AsyncEmitInfo[]): Promise<void> {
   for(let ev of info) {
      await eventBus.emit(ev.event, ev.data)
   }
}

export interface IAsyncEventEmitter {
   emit(event: string, data: any): Promise<void>
   on(event: string, handler: AsyncEventBusHandler): void
   off(event: string, handler: AsyncEventBusHandler): void
}

export interface ICombinedEventEmitter {
   sync: EventEmitter
   async: IAsyncEventEmitter

   /**
    * Emits an event to both sync and async emitters
    * 
    * @param event The event to emit
    * @param data The data to pass to the handler
    */
   emit(event: string, data: any): Promise<void>

   /**
    * Subscribes a handler to both sync and async emitters
    * 
    * @param event The event to subscribe to
    * @param data The data to pass along with the event
    */
   on(event: string, syncHandler: EventBusHandler, asyncHandler: AsyncEventBusHandler): void
   
   /**
    * Unsubscribes handlers from an event
    * 
    * @param event The event to unsubscribe from
    * @param syncHandler The sync handler that was subscribed to the event
    * @param asyncHandler The async handler that was subscribed to the event
    */
   off(event: string, syncHandler: EventBusHandler, asyncHandler: AsyncEventBusHandler): void
}

export class CombinedEventEmitter {
   readonly sync: EventEmitter
   readonly async: IAsyncEventEmitter

   constructor() {
      this.sync = new EventEmitter()
      this.async = new AsyncEventEmitter()
   }

   static isCombinedEventEmitter(other: any): boolean {
      if(other.sync == null || !(other.sync instanceof EventEmitter)) {
         return false
      }

      if(other.async == null || !(other.async instanceof AsyncEventEmitter)) {
         return false
      }

      return true
   }

   async emit(event: string, data: any): Promise<void> {
      this.sync.emit(event, data)
      await this.async.emit(event, data)
   }

   on(event: string, syncHandler: EventBusHandler, asyncHandler: AsyncEventBusHandler): void {
      this.sync.on(event, syncHandler)
      this.async.on(event, asyncHandler)
   }

   off(event: string, syncHandler: EventBusHandler, asyncHandler: AsyncEventBusHandler): void {
      this.sync.off(event, syncHandler)
      this.async.off(event, asyncHandler)
   }

}

export class AsyncEventEmitter implements IAsyncEventEmitter {
   private handlers: Map<string, AsyncEventBusHandler[]>

   constructor() {
      this.handlers = new Map<string, AsyncEventBusHandler[]>()
   }

   async emit(event: string, data: any): Promise<void> {
      let handlers = this.getHandlers(event)

      for(let handler of handlers) {
         // TODO: Consider running in parallel
         await handler(data)
      }
   }

   on(event: string, handler: AsyncEventBusHandler): void {
      let handlers = this.getHandlers(event)
      handlers.splice(-1, 0, handler)
   }

   off(event: string, handler: AsyncEventBusHandler): void {
      let handlers = this.getHandlers(event)
      
      for(let i = 0; i < handlers.length; ++i) {
         if(handlers[i] === handler) {
            handlers.splice(i, 1)
            return
         }
      }
   }

   private getHandlers(event: string): AsyncEventBusHandler[] {
      let handlers = this.handlers.get(event)

      if(handlers === undefined) {
         handlers = new Array<AsyncEventBusHandler>()
         this.handlers.set(event, handlers)
      }

      return handlers
   }
}