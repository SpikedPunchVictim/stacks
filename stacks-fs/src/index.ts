import * as path from 'path'
import {
   BootstrapEvent,
   EventSet,
   ExistState,
   GetObjectEvent,
   IPlugin,
   IStack,
   IEventRouter,
   StackObject,
   GetManyObjectsEvent,
   GetStoreContextEvent,
   IModel,
   ObjectDeleteEvent,
   ObjectSaveEvent,
   ObjectUpdateEvent
} from '@spikedpunch/stacks'

import * as fs from 'fs-extra'

const TempFileExt = '.temp'

export type FsOptions = {
   objectNameField?: string   // The field to use for the Object's file name. Defaults to 'id'
}

/**
 * File system plugin for Stacks
 * 
 * Notes:
 *    * GetMany cursor points to the next file in a sorted list
 */
export class FsPlugin implements IPlugin {
   readonly name: string = 'stacks-fs'
   readonly options: FsOptions

   private version: string | undefined = undefined // The plugin version

   constructor(readonly baseDir: string, options?: FsOptions) {
      // TODO: Normalize baseDir (~, .., etc)
      this.options = options || {}
   }


   /*
export enum EventSet {
   Bootstrap = 'bootstrap',
   GetManyObjects = 'get-many-objects',
   GetModel = 'get-model',
   GetObject = 'get-object',
   HasId = 'has-id',
   ModelCreated = 'model-created',
   ModelDeleted = 'model-deleted',
   ModelUpdated = 'model-updated',
   ObjectCreated = 'object-created',
   ObjectDeleted = 'object-deleted',
   ObjectUpdated = 'object-updated',
   ObjectSaved = 'object-saved'
}
   */
   async setup(stack: IStack, router: IEventRouter): Promise<void> {
      await fs.ensureDir(this.baseDir)

      //-------------------------------------------------------------------------------------------
      router.on<BootstrapEvent>(EventSet.Bootstrap, async (event: BootstrapEvent) => {
         for (let model of stack.get.models()) {
            await this.setupModel(model)
         }
      })

      //-------------------------------------------------------------------------------------------
      router.on<GetManyObjectsEvent<StackObject>>(EventSet.GetManyObjects, async (event: GetManyObjectsEvent<StackObject>) => {
         let modelDir = this.getModelDir(event.model.name)
         let reqCursor = event.page.cursor || ''
         let reqCount = event.page.limit == null ? 100 : event.page.limit

         // Ignore any Temp files that may be in the directory
         let files = await fs.readdir(modelDir)
         files = files.filter(it => path.parse(it).ext !== TempFileExt)
         files.sort()

         let cursor = ''
         let startIndex = 0
         let requestedFiles = new Array<string>()

         // The cursor becomes the next file one in the sorted list
         if (reqCursor !== '') {
            let names = files.map(f => path.parse(f).name)

            let decodedCursor = Buffer.from(reqCursor, 'base64').toString('ascii')
            let found = names.findIndex(it => it === decodedCursor)

            if (found < 0) {
               found = 0
               event.wasCursorFound = false
            } else {
               startIndex = found
            }
         }

         let endIndex = reqCount + startIndex
         requestedFiles = files.slice(startIndex, endIndex)

         if (endIndex < (files.length - 1)) {
            let parsed = path.parse(path.join(this.baseDir, files[endIndex]))
            cursor = parsed.name
         } else {
            cursor = ''
         }

         let objects = new Array<StackObject>()

         for (let file of requestedFiles) {
            objects.push({
               id: file.slice(0, (".json".length * -1)),
               ...await fs.readJson(path.join(modelDir, file))
            })
         }

         event.results = {
            cursor: cursor === '' ? '' : Buffer.from(cursor).toString('base64'),
            items: objects
         }
      })

      router.on(EventSet.GetStoreContext, async (event: GetStoreContextEvent) => {
         if (this.version === undefined) {
            let pkg = await fs.readJson(path.join(__dirname, '..', 'package.json'))
            this.version = pkg.version
         }

         event.contexts.push({
            name: 'stacks:fs',
            version: this.version || 'version-not-set',
            store: {
               baseDir: this.baseDir,
               options: this.options,
               fs: fs
            }
         })
      })

      //-------------------------------------------------------------------------------------------
      router.on<ObjectSaveEvent<StackObject>>(EventSet.ObjectSaved, async (event: ObjectSaveEvent<StackObject>) => {
         let modelDir = this.getModelDir(event.model.name)

         try {
            await fs.ensureDir(modelDir)
            await fs.writeJson(path.join(modelDir, `${event.serialize.id}.json`), event.serialize.toJs(), { spaces: 2 })
         } catch (err) {
            throw new Error(`[stacks-fs] Failed to save object. Reason: ${err}`)
         }
      })

      //-------------------------------------------------------------------------------------------
      router.on<GetObjectEvent<StackObject>>(EventSet.GetObject, async (event: GetObjectEvent<StackObject>) => {
         let objectPath = this.getObjectPath(event.model.name, event.id)

         try {
            let obj = await fs.readJson(objectPath)
            event.object = obj
         } catch (err) {
            throw new Error(`[stacks-fs] Failed to retrieve Object ${event.id}. Reason ${err}`)
         }
      })

      //-------------------------------------------------------------------------------------------
      router.on<ObjectDeleteEvent<StackObject>>(EventSet.ObjectDeleted, async (event: ObjectDeleteEvent<StackObject>) => {
         let objectPath = this.getObjectPath(event.model.name, event.object.id)

         try {
            await fs.remove(objectPath)
         } catch (err) {
            throw new Error(`[stacks-fs] Failed to delete an Object ${event.object.id}. Reason ${err}`)
         }
      })

      //-------------------------------------------------------------------------------------------
      router.on<ObjectUpdateEvent<StackObject>>(EventSet.ObjectUpdated, async (event: ObjectUpdateEvent<StackObject>) => {
         let objectPath = this.getObjectPath(event.model.name, event.object.id)

         try {
            await fs.access(objectPath)

            event.exists = ExistState.Exists

            event.updated = await fs.readJson(objectPath)
         } catch (err) {
            event.exists = ExistState.DoesNotExist
         }
      })
   }

   private getModelDir(modelName: string): string {
      return path.join(this.baseDir, modelName)
   }

   private getObjectPath(modelName: string, objectId: string): string {
      let modelDir = this.getModelDir(modelName)
      return path.join(modelDir, `${objectId}.json`)
   }

   private async setupModel(model: IModel): Promise<void> {
      let modelDir = this.getModelDir(model.name)
      await fs.ensureDir(modelDir)
   }

   // private async writeObject(model: IModel, object: StackObject): Promise<void> {
   //    let obj = {}

   //    for(let member of model.members) {
   //       member.value.
   //    }
   // }
}