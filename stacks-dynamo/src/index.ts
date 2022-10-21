import {
   BootstrapEvent,
   EventSet,
   // ExistState,
   // GetObjectEvent,
   IPlugin,
   IStack,
   IEventRouter,
   SaveObjectEvent,
   StackObject,
   // GetManyObjectsEvent,
   // IModel,
   // DeleteObjectEvent,
   // UpdateObjectEvent
} from "@spikedpunch/stacks"

import {
   Dynatron,
   DynatronClient,
   DynatronClientConfig,

} from 'dynatron'


export type DynamoDbPluginConfig = {

} & DynatronClientConfig


/**
 * File system plugin for Stacks
 * 
 * Notes:
 *    * GetMany cursor points to the next file in a sorted list
 */
export class DynamoDbPlugin implements IPlugin {
   readonly name: string = 'stacks-dynamo'

   private client: Dynatron

   constructor(readonly baseDir: string, readonly options: DynamoDbPluginConfig) {
      // TODO: Normalize options
      this.client = new Dynatron(new DynatronClient(options))
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

      //-------------------------------------------------------------------------------------------
      router.on<BootstrapEvent>(EventSet.Bootstrap, async (event: BootstrapEvent) => {
         // for(let model of stack.get.models()) {
         //    //model.
         // }
      })

      //-------------------------------------------------------------------------------------------
      // router.on<GetManyObjectsEvent<StackObject>>(EventSet.GetManyObjects, async (event: GetManyObjectsEvent<StackObject>) => {
      //    let modelDir = this.getModelDir(event.model.name)
      //    let reqCursor = event.options.cursor || ''
      //    let reqCount = event.options.limit == null ? 100 : event.options.limit

      //    // Ignore any Temp files that may be in the directory
      //    let files = await fs.readdir(modelDir)
      //    files = files.filter(it => path.parse(it).ext !== TempFileExt)
      //    files.sort()

      //    let cursor = ''
      //    let startIndex = 0
      //    let requestedFiles = new Array<string>()

      //    // The cursor becomes the next file one in the sorted list
      //    if (reqCursor !== '') {
      //       let names = files.map(f => path.parse(f).name)

      //       let decodedCursor = Buffer.from(reqCursor, 'base64').toString('ascii')
      //       let found = names.findIndex(it => it === decodedCursor)

      //       if (found < 0) {
      //          found = 0
      //          event.wasCursorFound = false
      //       } else {
      //          startIndex = found
      //       }
      //    }

      //    let endIndex = reqCount + startIndex
      //    requestedFiles = files.slice(startIndex, endIndex)

      //    if (endIndex < (files.length - 1)) {
      //       let parsed = path.parse(path.join(this.baseDir, files[endIndex]))
      //       cursor = parsed.name
      //    } else {
      //       cursor = ''
      //    }

      //    let objects = new Array<StackObject>()

      //    for (let file of requestedFiles) {
      //       objects.push(await fs.readJson(path.join(modelDir, file)))
      //    }

      //    event.results = {
      //       cursor: cursor === '' ? '' : Buffer.from(cursor).toString('base64'),
      //       items: objects
      //    }
      // })

      //-------------------------------------------------------------------------------------------
      router.on<SaveObjectEvent<StackObject>>(EventSet.ObjectSaved, async (event: SaveObjectEvent<StackObject>) => {
         /*
            readonly model: IModel
            readonly object: T
            readonly serialize: IProxyObject
         */
         let saved = await this.client.Items(event.model.name)
            .put(event.serialize.toJs())
            .$<StackObject>()

         console.dir(saved, { depth: null })
      })

      // //-------------------------------------------------------------------------------------------
      // router.on<GetObjectEvent<StackObject>>(EventSet.GetObject, async (event: GetObjectEvent<StackObject>) => {
      //    let objectPath = this.getObjectPath(event.model.id, event.id)

      //    try {
      //       let obj = await fs.readJson(objectPath)
      //       event.object = obj
      //    } catch (err) {
      //       throw new Error(`[stacks-fs] Failed to retrieve Object ${event.id}. Reason ${err}`)
      //    }
      // })

      // //-------------------------------------------------------------------------------------------
      // router.on<DeleteObjectEvent<StackObject>>(EventSet.ObjectDeleted, async (event: DeleteObjectEvent<StackObject>) => {
      //    let objectPath = this.getObjectPath(event.model.name, event.object.id)

      //    try {
      //       await fs.remove(objectPath)
      //    } catch (err) {
      //       throw new Error(`[stacks-fs] Failed to delete an Object ${event.object.id}. Reason ${err}`)
      //    }
      // })

      // //-------------------------------------------------------------------------------------------
      // router.on<UpdateObjectEvent<StackObject>>(EventSet.ObjectUpdated, async (event: UpdateObjectEvent<StackObject>) => {
      //    let objectPath = this.getObjectPath(event.model.name, event.object.id)
      //    let tempPath = `${objectPath}${TempFileExt}`

      //    try {
      //       await fs.access(objectPath)

      //       event.exists = ExistState.Exists

      //       // We ensure we always have a copy of the original until we're done writing
      //       // the changed file. We remove the copy if the write is sucessful, otherwise
      //       // we rollback the change and keep the copy.
      //       await fs.copy(objectPath, tempPath)
      //       await fs.remove(objectPath)
      //       await fs.writeJson(objectPath, event.serialize.toJs(), { spaces: 2 })
      //       event.updated = 
      //    } catch (err) {
      //       try {
      //          await fs.access(tempPath)
      //          await fs.move(tempPath, objectPath, { overwrite: true })
      //       } catch (err) {
      //          // swallow
      //       }

      //       throw new Error(`[stacks-fs] Failed to update an Object ${event.object.id}. Reason ${err}`)
      //    } finally {
      //       try {
      //          await fs.access(tempPath)
      //          await fs.remove(tempPath)
      //       } catch (err) {
      //          // swallow
      //       }
      //    }
      // })
   }

   // private getModelDir(modelName: string): string {
   //    return path.join(this.baseDir, modelName)
   // }

   // private getObjectPath(modelName: string, objectId: string): string {
   //    let modelDir = this.getModelDir(modelName)
   //    return path.join(modelDir, `${objectId}.json`)
   // }

   // private async setupModel(model: IModel): Promise<void> {
   //    let modelDir = this.getModelDir(model.name)
   //    await fs.ensureDir(modelDir)
   // }

   // private async writeObject(model: IModel, object: StackObject): Promise<void> {
   //    let obj = {}

   //    for(let member of model.members) {
   //       member.value.
   //    }
   // }
}