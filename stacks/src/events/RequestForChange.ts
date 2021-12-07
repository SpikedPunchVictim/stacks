import { IEvent } from "./Event"
import { IEventRouter } from "./EventRouter"

export type RfcHandler = (event: IEvent, err?: Error) => Promise<void>

export interface IRequestForChangeSource {
   create(action: IEvent): IRequestForChange
}

export class RequestForChangeSource implements IRequestForChangeSource {
   readonly router: IEventRouter
   
   constructor(router: IEventRouter) {
      this.router = router
   }

   create(action: IEvent): IRequestForChange {
      return new RequestForChange(action, this.router)
   }
}


export interface IRequestForChange {
   commit(): Promise<void>
   fulfill(handler: RfcHandler): IRequestForChange
   reject(handler: RfcHandler): IRequestForChange
}

export class RequestForChange implements IRequestForChange {
   readonly router: IEventRouter
   readonly action: IEvent
   private rejects: Array<RfcHandler>
   private fulfills: Array<RfcHandler>

   constructor(action: IEvent, router: IEventRouter) {
      this.action = action
      this.router = router
      this.fulfills = new Array<RfcHandler>()
      this.rejects = new Array<RfcHandler>()
   }

   fulfill(handler: RfcHandler): IRequestForChange {
      this.fulfills.push(handler)
      return this
   }
   
   reject(handler: RfcHandler): IRequestForChange {
      this.rejects.push(handler)
      return this
   }

   async commit(): Promise<void> {
      try {
         await this.router.raise(this.action)

         for(let handler of this.fulfills) {
            await handler(this.action)
         }
      } catch(err) {
         for(let handler of this.rejects) {
            await handler(this.action, err as Error)
         }
      }
   }
}