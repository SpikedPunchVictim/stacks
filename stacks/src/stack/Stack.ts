import { Cache, ICache } from "../Cache"
import { EventRouter, IEventRouter } from "../events/EventRouter"
import { IRequestForChangeSource, RequestForChangeSource } from "../events/RequestForChange"
import { CompositeSerializer, IValueSerializer } from "../serialize/ValueSerializer"
import { IUidKeeper, UidKeeper } from "../UidKeeper"
import { CombinedEventEmitter, ICombinedEventEmitter } from "../utils/Eventing"
import { BoolSerializer } from "../values/Bool"
import { IntSerializer } from "../values/Int"
import { ListSerializer } from "../values/List"
import { ObjectRefSerializer } from "../values/ObjectRef"
import { StringSerializer } from "../values/String"
import { TypeSet } from "../values/Type"
import { UIntSerializer } from "../values/UInt"
import { IPlugin } from "./Plugin"
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
   readonly serializer: IValueSerializer
   readonly router: IEventRouter

   /**
    * Called after all Models have been defined. Calling
    * this method is optional, but provides a hook for
    * Plugins that require initialization.
    */
   bootstrap(): Promise<void>

   /**
    * Determines if an id is already in use.
    * 
    * @param id The id
    */
   hasId(id: string): Promise<boolean>

   /**
    * Adds a Plugin to the Stack
    * 
    * @param plugin The Plugin to use
    */
   use(plugin: IPlugin): Promise<void>
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
   readonly serializer: IValueSerializer
   readonly router: IEventRouter

   private rfc: IRequestForChangeSource
   private context: StackContext
   private cache: ICache

   constructor(options?: StackOptions) {
      super()
      
      this.uid = options?.uidKeeper || new UidKeeper()
      this.cache = new Cache()
      
      this.router = new EventRouter()
      this.rfc = new RequestForChangeSource(this.router)

      let serializer = new CompositeSerializer()
      this.serializer = serializer

      this.context = new StackContext(this, this.rfc, this.cache, this.uid, serializer)

      serializer.register(TypeSet.Bool, new BoolSerializer())
      serializer.register(TypeSet.Int, new IntSerializer())
      serializer.register(TypeSet.List, new ListSerializer(serializer))
      serializer.register(TypeSet.ObjectRef, new ObjectRefSerializer(this.context))
      serializer.register(TypeSet.String, new StringSerializer())
      serializer.register(TypeSet.UInt, new UIntSerializer())

      this.delete = new StackDelete(this.cache, this.context.orchestrator)
      this.get = new StackGet(this.context)
      this.create = new StackCreate(this.get, this.context)
      this.update = new StackUpdate(this.context)
   }

   static create(options?: StackOptions): IStack {
      return new Stack(options)
   }

   async bootstrap(): Promise<void> {
      return this.context.orchestrator.boostrap()
   }

   async use(plugin: IPlugin): Promise<void> {
      await plugin.setup(this, this.router)
   }

   async hasId(id: string): Promise<boolean> {
      return this.context.orchestrator.hasId(id)
   }
}