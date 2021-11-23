import { Cache, ICache } from "../Cache"
import { EventRouter, IEventRouter } from "../events/EventRouter"
import { IRequestForChangeSource, RequestForChangeSource } from "../events/RequestForChange"
import { IUidKeeper, UidKeeper } from "../UidKeeper"
import { CombinedEventEmitter, ICombinedEventEmitter } from "../utils/Eventing"
import { StackContext } from "./StackContext"
import { IStackCreate, StackCreate } from "./StackCreate"
import { IStackDelete, StackDelete } from "./StackDelete"
import { IStackGet, StackGet } from "./StackGet"
import { IStackUpdate, StackUpdate } from "./StackUpdate"

export type StackOptions = {
   uidKeeper?: IUidKeeper
}

export interface IStack extends ICombinedEventEmitter {
   readonly create: IStackCreate
   readonly delete: IStackDelete
   readonly get: IStackGet
   readonly update: IStackUpdate

   /**
    * Determines if an id is already in use.
    * 
    * @param id The id
    */
   hasId(id: string): Promise<boolean>
}

export class Stack
   extends CombinedEventEmitter 
   implements IStack
   {
   readonly get: IStackGet
   readonly create: IStackCreate
   readonly update: IStackUpdate
   readonly delete: IStackDelete
   readonly uid: IUidKeeper

   private rfc: IRequestForChangeSource
   private router: IEventRouter
   private context: StackContext
   private cache: ICache

   constructor(options?: StackOptions) {
      super()
      
      this.uid = options?.uidKeeper || new UidKeeper()
      this.cache = new Cache()
      
      this.delete = new StackDelete()

      this.router = new EventRouter()
      this.rfc = new RequestForChangeSource(this.router)

      this.context = new StackContext(this, this.rfc, this.cache, this.uid)

      this.get = new StackGet(this.context)
      this.create = new StackCreate(this.get, this.context)
      this.update = new StackUpdate(this.context)
   }

   static create(options?: StackOptions): IStack {
      return new Stack(options)
   }

   async hasId(id: string): Promise<boolean> {
      return this.context.orchestrator.hasId(id)
   }
}