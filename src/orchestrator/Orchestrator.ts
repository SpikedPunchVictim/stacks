import { StackObject } from "../BondedObject";
import { ICache } from "../Cache";
import { GetObjectEvent } from "../events";
import { CommitObjectEvent } from "../events/CommitObjectEvent";
import { CreateObjectEvent } from "../events/CreateObjectEvent";
import { DeleteObjectEvent } from "../events/DeleteObjectEvent";
import { EventSet, ExistState } from "../events/Event";
import { GetManyObjectsEvent } from "../events/GetManyObjectsEvent";
import { HasIdEvent } from "../events/HasIdEvent";
import { IRequestForChangeSource } from "../events/RequestForChange";
import { UpdateObjectEvent } from "../events/UpdateObjectEvent";
import { IModel, PageRequest, PageResponse } from "../Model";
import { IStack } from "../stack/Stack";
import { IStackContext } from "../stack/StackContext";
import { UpdateObjectHandler } from "../stack/StackUpdate";

export interface IOrchestrator {
   // TODO: Add: createModel, deleteModel (these should assist in running tests)

   commitObject<T extends StackObject>(model: IModel, obj: T): Promise<void>
   createObject<T extends StackObject>(model: IModel, obj: T): Promise<void>
   deleteObject<T extends StackObject>(model: IModel, obj: T): Promise<void>

   /**
    * Retrieves many objects in a paged fashion.
    * 
    * @param model The Model representing the Objects
    * @param options PageRequest Options
    */
   getManyObjects<T extends StackObject>(model: IModel, options: PageRequest): Promise<PageResponse<T>>
   getObject<T extends StackObject>(model: IModel, id: string): Promise<T | undefined>
   hasId(id: string): Promise<boolean>
   updateObject<T extends StackObject>(model: IModel, obj: T, onUpdate: UpdateObjectHandler<T>): Promise<void>
}


export class Orchestrator implements IOrchestrator {
   get cache(): ICache {
      return this.context.cache
   }

   get rfc(): IRequestForChangeSource {
      return this.context.rfc
   }

   get stack(): IStack {
      return this.context.stack
   }

   constructor(readonly context: IStackContext) {

   }

   async commitObject<T extends StackObject>(model: IModel, obj: T): Promise<void> {
      let validations = await model.validate(obj)

      if (!validations.success) {
         throw new Error(`Cannot Save Object with ID ${obj.id} since it fails validation. Reason: ${validations.results.map(r => r.error)}`)
      }

      await this.rfc.create(new CommitObjectEvent<T>(model, obj))
         .fulfill(async (event) => {
            this.cache.saveObject(model, obj)
            await this.stack.emit(EventSet.CommitObject, event)
         })
         .commit()
   }

   async createObject<T extends StackObject>(model: IModel, obj: T): Promise<void> {
      await this.rfc.create(new CreateObjectEvent(model, obj))
         .fulfill(async (event) => {
            this.cache.saveObject(model, obj)
            await this.stack.emit(EventSet.ObjectCreated, event)
         })
         .commit()
   }

   async getManyObjects<T extends StackObject>(model: IModel, options: PageRequest = {}): Promise<PageResponse<T>> {
      let results = {
         cursor: '',
         items: new Array<T>()
      }

      await this.rfc.create(new GetManyObjectsEvent(model, options))
         .fulfill(async (event) => {
            let cast = event as GetManyObjectsEvent<T>

            if (cast.results !== undefined) {
               results = cast.results
               return
            }

            let objects = this.cache.getObjects<T>(model)

            if (objects.length == 0) {
               return
            }

            let cursor = options.cursor || ''
            let limit = options.limit || 100

            // Sort by ID. The resulting paged set is not perfect, and will have
            // holes when new entries are added in between queries.
            objects.sort((a, b) => {
               let aId = a.id.toLowerCase()
               let bId = b.id.toLowerCase()
               return (aId < bId) ? -1 : (aId > bId) ? 1 : 0
            })

            if (cursor === '') {
               // For an empty cursor we start from the beginning
               let items = objects.slice(0, Math.min(objects.length - 1, limit))

               if (items.length == limit && objects.length > limit) {
                  results.cursor = Buffer.from(objects[limit + 1].id).toString('base64')
               } else {
                  // If there are no more entries in thenext set, we default the cursor
                  // to empty string
                  results.cursor = ''
               }

               results.items = items
               return
            } else {
               // We have a cursor and continue from whence we left off
               cursor = Buffer.from(cursor, 'base64').toString('ascii')

               let index = objects.findIndex(o => o.id === cursor)

               if (index === -1) {
                  // We get here when the object that's next has been deleted
                  // return early
                  return
               }

               results.items = objects.slice(index, Math.min(objects.length - 1, limit))

               if (results.items.length == limit && objects.length > limit) {
                  results.cursor = Buffer.from(objects[limit + 1].id).toString('base64')
               } else {
                  // If there are no more entries in thenext set, we default the cursor
                  // to empty string
                  results.cursor = ''
               }

               return
            }

            return
         })
         .commit()

      return results
   }

   async deleteObject<T extends StackObject>(model: IModel, obj: T): Promise<void> {
      await this.rfc.create(new DeleteObjectEvent(model, obj))
         .fulfill(async (event) => {
            this.cache.deleteObject(model, obj)
            await this.stack.emit(EventSet.ObjectDeleted, event)
         })
         .commit()
   }

   async getObject<T extends StackObject>(model: IModel, id: string): Promise<T | undefined> {
      let object: T | undefined

      await this.rfc.create(new GetObjectEvent(model, id))
         .fulfill(async (event) => {
            let cast = event as GetObjectEvent<T>

            if (cast.object === undefined) {
               object = cast.exists === ExistState.DoesNotExist ?
                  undefined :
                  this.cache.getObject(model, id)
            } else {
               this.cache.saveObject(model, cast.object)
               object = cast.object
            }

            await this.stack.emit(EventSet.GetObject, event)
         })
         .commit()

      return object
   }

   async hasId(id: string): Promise<boolean> {
      let hasId = false

      await this.rfc.create(new HasIdEvent(id))
         .fulfill(async (event) => {
            let cast = event as HasIdEvent

            if (cast.hasId) {
               hasId = true
               return
            }

            // Has it a plugin attempted to set it?
            if (cast.attemptedSet) {
               // If so, we can trust that an external system doesn't have it
               hasId = false
               return
            }

            // If no external system attempted to set it, do we have it cached?
            hasId = this.cache.hasId(id)

         })
         .commit()

      return hasId
   }

   async updateObject<T extends StackObject>(model: IModel, obj: T, onUpdate: UpdateObjectHandler<T>): Promise<void> {
      await this.rfc.create(new UpdateObjectEvent<T>(model, obj))
         .fulfill(async (event) => {
            let cast = event as UpdateObjectEvent<T>

            let updated = cast.updated

            await onUpdate(updated, cast.exists)

            await this.stack.emit(EventSet.ObjectUpdated, cast)
         })
         .commit()
   }
}