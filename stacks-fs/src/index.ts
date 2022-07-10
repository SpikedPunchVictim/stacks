import * as path from 'path'
import {
   BootstrapEvent,
   EventSet,
   ExistState,
   GetObjectEvent,
   IPlugin,
   IStack,
   IEventRouter,
   SaveObjectEvent,
   StackObject,
   GetManyObjectsEvent,
   IModel,
   DeleteObjectEvent,
   UpdateObjectEvent
} from '@spikedpunch/stacks'

import * as fs from 'fs-extra'

export type FsOptions = {

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

   constructor(readonly baseDir: string, options: FsOptions) {
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
         let reqCursor = event.options.cursor || ''
         let reqCount = event.options.limit == null ? 100 : event.options.limit

         let files = await fs.readdir(modelDir)
         files.sort()

         let cursor = ''
         let startIndex = 0
         let requestedFiles = new Array<string>()

         // The cursor becomes the next file one in the sorted list
         if (reqCursor !== '') {
            let names = files.map(f => path.parse(f).name)

            let decodedCursor = Buffer.from(reqCursor, 'base64').toString('ascii')            
            let found = names.findIndex(decodedCursor)

            if (found < 0) {
               found = 0
               event.wasCursorFound = false
            } else {
               startIndex = found
            }
         }

         let endIndex = Math.min((files.length - startIndex), reqCount)

         requestedFiles = files.slice(startIndex, endIndex)

         if (endIndex < (files.length - 1)) {
            let parsed = path.parse(path.join(this.baseDir, files[endIndex]))
            cursor = parsed.name
         } else {
            cursor = ''
         }

         let objects = new Array<StackObject>()

         for (let file of requestedFiles) {
            objects.push(await fs.readJson(path.join(modelDir, file)))
         }

         event.results = {
            cursor: cursor === '' ? '' : Buffer.from(cursor).toString('base64'),
            items: objects
         }
      })

      //-------------------------------------------------------------------------------------------
      router.on<SaveObjectEvent<StackObject>>(EventSet.ObjectSaved, async (event: SaveObjectEvent<StackObject>) => {
         let modelDir = this.getModelDir(event.model.name)
         await fs.ensureDir(modelDir)
         await fs.writeJson(path.join(modelDir, `${event.serialize.id}.json`), event.serialize.toJs())
      })

      //-------------------------------------------------------------------------------------------
      router.on<GetObjectEvent<StackObject>>(EventSet.GetObject, async (event: GetObjectEvent<StackObject>) => {
         let objectPath = this.getObjectPath(event.model.id, event.id)

         try {
            let obj = await fs.readJson(objectPath)
            event.object = obj
         } catch(err) {
            throw new Error(`Failed to retrieve Object ${event.id}. Reason ${err}`)
         }
      })

      //-------------------------------------------------------------------------------------------
      router.on<DeleteObjectEvent<StackObject>>(EventSet.ObjectDeleted, async (event: DeleteObjectEvent<StackObject>) => {
         let objectPath = this.getObjectPath(event.model.id, event.object.id)

         try {
            await fs.remove(objectPath)
         } catch(err) {
            throw new Error(`Failed to delete an Object ${event.object.id}. Reason ${err}`)
         }
      })

      //-------------------------------------------------------------------------------------------
      router.on<UpdateObjectEvent<StackObject>>(EventSet.ObjectUpdated, async (event: UpdateObjectEvent<StackObject>) => {
         let objectPath = this.getObjectPath(event.model.id, event.object.id)
         console.log(objectPath)
         let exists = await fs.access(objectPath)

         if(exists) {
            event.exists = ExistState.Exists

            // try {
            //    await fs.remove(objectPath)
            //    await fs.writeJson(objectPath, event.object)
            //    event.object = obj
            // } catch(err) {

            // }
         }

         // try {
         //    await fs.remove(objectPath)
         // } catch(err) {
         //    throw new Error(`Failed to delete an Object ${event.object.id}. Reason ${err}`)
         // }
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