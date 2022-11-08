import { StackObject } from "../StackObject";
import { ICache } from "../Cache";
import { IModel, Model, ModelCreateParams, ObjectCreateParams, PageRequest, PageResponse } from "../Model";
import { ApplyStoreContextHandler, IStack } from "../stack/Stack";
import { IStackContext } from "../stack/StackContext";
import { UpdateObjectHandler } from "../stack/StackUpdate";
import { ProxyObject } from "../ProxyObject";
import { IUidKeeper, UidKeeper } from "../UidKeeper";
import { IValueSerializer } from "../serialize/ValueSerializer";

import {
   BootstrapEvent,
   ModelCreateEvent,
   ObjectCreateEvent,
   ModelDeleteEvent,
   ObjectDeleteEvent,
   EventSet,
   ExistState,
   GetManyObjectsEvent,
   GetModelEvent,
   GetObjectEvent,
   GetStoreContextEvent,
   HasIdEvent,
   IRequestForChangeSource,
   ObjectSaveEvent,
   ObjectUpdateEvent,
   ModelUpdateEvent
} from '../events'
export interface IOrchestrator {
   // TODO: Add: createModel, deleteModel (these should assist in running tests)

   /**
    * Bootstraps the Stack.
    */
   boostrap(): Promise<void>

   /**
    * Creates a Model
    * 
    * @param name The name of the Model
    * @param params The Params used to create the Model
    */
   createModel(name: string, params: ModelCreateParams): Promise<IModel>

   /**
    * Deletes a Model
    * 
    * @param model The Model to delete
    */
   deleteModel(model: IModel): Promise<void>

   /**
    * Retrieves a Model if it exists, or undefiend if not.
    * 
    * @param name The Model name
    */
   getModel(name: string): Promise<IModel | undefined>

   /**
    * Updates an existing Model
    * 
    * @param model The Model to update
    * @param params The Params
    */
   updateModel(model: IModel, params: ModelCreateParams): Promise<void>

   /**
    * Creates a new Object in memory only. Not indended to be stored on the backend.
    * Objects created this way have no ID assigned to them until they are saved.
    * 
    * @param model The Model
    * @param params The Object Creation Params 
    */
   createObject<T extends StackObject>(model: IModel, params: ObjectCreateParams): Promise<T>

   /**
    * Saves an Object to the backend.
    * 
    * @param model The Model
    * @param obj The Object to Save
    */
   saveObject<T extends StackObject>(model: IModel, obj: T): Promise<void>

   /**
    * Deletes an Object from the backend
    * 
    * @param model The Model
    * @param obj The Object to delete
    */
   deleteObject<T extends StackObject>(model: IModel, obj: T): Promise<void>

   /**
    * Retrieves many objects in a paged fashion.
    * 
    * @param model The Model representing the Objects
    * @param options PageRequest Options
    */
   getManyObjects<T extends StackObject>(model: IModel, options: PageRequest): Promise<PageResponse<T>>
   
   /**
    * Retrieves the Edit version of the Object
    * 
    * @param model The Model of the Object
    * @param id The Object's ID
    */
   getObject<T extends StackObject>(model: IModel, id: string): Promise<T | undefined>

   /**
    * Determines if an ID is already in use.
    * 
    * @param id The ID to test
    * @param model The associated Model
    */
   hasId(id: string, model: IModel): Promise<boolean>
   
   /**
    * Creates and stores a custom Query Object
    * 
    * @param handler The handler to create the custom Query Object
    */
    storeQueryObject<T>(handler: ApplyStoreContextHandler<T>): Promise<T | undefined>

   /**
    * Updates an already existing object with the latest from the stored version.
    * This method is intended to be used on long lived objects where we want them
    * to be updated locally, and not saved.
    * 
    * @param model The Model
    * @param obj The Object
    * @param onUpdate Function to update the Object based on the latest version
    */
   updateObject<T extends StackObject>(model: IModel, obj: T, onUpdate: UpdateObjectHandler<T>): Promise<void>
}


export class Orchestrator implements IOrchestrator {
   get cache(): ICache {
      return this.context.cache
   }

   get rfc(): IRequestForChangeSource {
      return this.context.rfc
   }

   get serializer(): IValueSerializer {
      return this.context.serializer
   }

   get stack(): IStack {
      return this.context.stack
   }

   get uid(): IUidKeeper {
      return this.context.uid
   }

   constructor(readonly context: IStackContext) {

   }

   async boostrap(): Promise<void> {
      await this.rfc.create(new BootstrapEvent())
         .fulfill(async (event) => {
            await this.stack.emit(EventSet.Bootstrap, event)
         })
         .commit()
   }

   async createModel(name: string, params: ModelCreateParams): Promise<IModel> {
      let model = await this.stack.get.model(name)

      if(model !== undefined) {
         throw new Error(`A Model with the name ${name} already exists`)
      }

      model = await Model.create(name, this.context)
      await model.append(params)

      this.cache.saveModel(model)

      await this.rfc.create(new ModelCreateEvent(model))
         .fulfill(async (event) => {
            await this.stack.emit(EventSet.ModelCreated, event)
         })
         .commit()

      return model
   }

   async deleteModel(model: IModel): Promise<void> {
      await this.rfc.create(new ModelDeleteEvent(model))
         .fulfill( async (event) => {
            this.cache.deleteModel(model.name)
         })
         .commit()
   }

   // Note: This may not be needed. Watch for this.
   // Model's are stored in local cache because they are
   // defined locally, and are the contract between the
   // the expected data set and what is stored.
   async getModel(name: string): Promise<IModel | undefined> {
      let model: IModel | undefined

      await this.rfc.create(new GetModelEvent(name))
         .fulfill(async (event) => {
            let getModel = event as GetModelEvent
            model = getModel.model || this.cache.getModel(name)

            if(model !== undefined) {
               this.cache.saveModel(model)
            }

            await this.stack.emit(EventSet.GetModel, event)
         })
         .commit()

      return model
   }

   async updateModel(model: IModel, params: ModelCreateParams): Promise<void> {
      this.rfc.create(new ModelUpdateEvent(model))
         .fulfill(async (event) => {
            let updateModelEvent = event as ModelUpdateEvent
            this.cache.saveModel(updateModelEvent.model)
         })
         .commit()
   }

   async createObject<T extends StackObject>(model: IModel, params: ObjectCreateParams): Promise<T> {
      let created = await ProxyObject.fromCreated<T>(model, params, this.context) as T

      await this.rfc.create(new ObjectCreateEvent(model, created))
         .fulfill(async (event) => {
            await this.stack.emit(EventSet.ObjectCreated, event)
         })
         .commit()

      return created
   }

   /**
    * 
    * @param model The Model
    * @param obj The Object to save. Note that this is really a Proxy'd SerializableObject
    */
   async saveObject<T extends StackObject>(model: IModel, obj: T): Promise<void> {
      if(obj.id === UidKeeper.IdNotSet) {
         obj.id = await this.uid.generate(model)
      }
      
      let validations = await model.validate(obj)

      if (!validations.success) {
         throw new Error(`Cannot Save Object with ID ${obj.id} since it fails validation. Reason: ${validations.results.map(r => r.error)}`)
      }

      //@ts-ignore
      let serialized = ProxyObject.unwrap(obj)

      await this.rfc.create(new ObjectSaveEvent<T>(model, obj, serialized))
         .fulfill(async (event) => {
            this.cache.saveObject(model, obj)
            await this.stack.emit(EventSet.ObjectSaved, event)
         })
         .commit()
   }

   async getManyObjects<T extends StackObject>(model: IModel, options: PageRequest = { cursor: '', limit: 100 }): Promise<PageResponse<T>> {
      let results = {
         cursor: '',
         items: new Array<T>()
      }

      await this.rfc.create(new GetManyObjectsEvent(model, options))
         .fulfill(async (event) => {
            let cast = event as GetManyObjectsEvent<T>

            await this.stack.emit(EventSet.GetManyObjects, cast)

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
               let items = objects.slice(0, Math.min(objects.length, limit))

               if (items.length == limit && objects.length > limit) {
                  results.cursor = Buffer.from(objects[limit].id).toString('base64')
               } else {
                  // If there are no more entries in the next set, we default the cursor
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

               let nextIndex = index + limit
               results.items = objects.slice(index, nextIndex)

               if (objects.length > nextIndex) {
                  results.cursor = Buffer.from(objects[nextIndex].id).toString('base64')
               } else {
                  // If there are no more entries in the next set, we default the cursor
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
      await this.rfc.create(new ObjectDeleteEvent(model, obj))
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
               // We get a serialized version of the Object
               let serialized = await ProxyObject.fromStored(model, cast.object, this.context.serializer)
               this.cache.saveObject(model, serialized)

               //@ts-ignore
               object = serialized as T
            }

            await this.stack.emit(EventSet.GetObject, event)
         })
         .commit()

      return object
   }

   async hasId(id: string, model: IModel): Promise<boolean> {
      let hasId = false

      await this.rfc.create(new HasIdEvent(id, model))
         .fulfill(async (event) => {
            let cast = event as HasIdEvent

            await this.stack.emit(EventSet.HasId, event)

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

   async storeQueryObject<T>(handler: ApplyStoreContextHandler<T>): Promise<T | undefined> {
      let result: T | undefined = undefined

      await this.rfc.create(new GetStoreContextEvent())
         .fulfill(async (event) => {
            let getStoreContext = event as GetStoreContextEvent

            result = await handler(getStoreContext.contexts)
         })
         .commit()

      return result
   }

   /**
    * Updates an already existing object with the latest from the stored version.
    * This method is intended to be used on long lived objects where we want them
    * to be updated locally, and not saved.
    * 
    * @param model The Model
    * @param obj The Object
    * @param onUpdate Function to update the Object based on the latest version
    */
   async updateObject<T extends StackObject>(model: IModel, obj: T, onUpdate: UpdateObjectHandler<T>): Promise<void> {
      await this.rfc.create(new ObjectUpdateEvent<T>(model, obj, ProxyObject.unwrap(obj)))
         .fulfill(async (event) => {
            let cast = event as ObjectUpdateEvent<T>

            let updated = cast.updated

            await onUpdate(updated, cast.exists)

            await this.stack.emit(EventSet.ObjectUpdated, event)
         })
         .commit()
   }
}